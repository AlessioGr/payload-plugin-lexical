import { CollectionConfig } from 'payload/types';
import { lexicalRichTextField } from '../../../src/fields/LexicalRichText';
//import lexicalRichTextField from '../../../dist/fields/lexicalRichTextField'

const Lexical: CollectionConfig = {
  slug: 'lexicalRichText',
  admin: {
    useAsTitle: 'title',
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    lexicalRichTextField({
      name: 'lexicalRichTextEditor',
      label: 'Lexical Rich Text Editor',
      // required: true, cannot seed with requried: true
      admin: {
        readOnly: false,
      },
      editorConfigModifier: (defaultEditorConfig) => {
        defaultEditorConfig.output.html.enabled = true;
        defaultEditorConfig.output.markdown.enabled = true;
        return defaultEditorConfig;
      },
    }),
  ],
};

export default Lexical;
