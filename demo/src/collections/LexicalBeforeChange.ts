import { CollectionConfig } from 'payload/types';
import customizedLexicalRichText from '../fields/customizedLexicalRichTextField';
import { createHeadlessEditor } from '@lexical/headless';
import PlaygroundNodes from '../../../src/fields/LexicalRichText/nodes/PlaygroundNodes';
import { defaultEditorConfig } from '../../../src';
import { $getRoot } from 'lexical';
import { $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';

const LexicalBeforeChange: CollectionConfig = {
  slug: 'beforeChangeLexicalRichText',
  admin: {
    useAsTitle: 'title',
  },
  hooks: {
    beforeChange: [
      async ({ data }) => {
        const headlessEditor = await createHeadlessEditor({
          nodes: PlaygroundNodes(defaultEditorConfig),
        });

        await headlessEditor.update(() => {
          $convertFromMarkdownString('Somedateee ' + Date.now().toString(), TRANSFORMERS);
        });

        const textContent = headlessEditor.getEditorState().read(() => {
          return $getRoot().getTextContent();
        });
        console.log('New textcontent', textContent);
        const preview =
          textContent?.length > 100 ? `${textContent.slice(0, 100)}\u2026` : textContent;

        const lexicalValue = {
          jsonContent: headlessEditor.getEditorState().toJSON(),
          preview: preview,
          characters: textContent?.length,
          words: textContent?.split(' ').length,
          comments: undefined,
        };

        return {
          ...data,
          input: lexicalValue,
        };
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    customizedLexicalRichText({
      name: 'input',
    }),
  ],
};

export default LexicalBeforeChange;
