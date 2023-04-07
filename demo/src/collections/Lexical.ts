import { CollectionConfig } from 'payload/types';
import { lexicalRichTextField } from '../../../src/fields/lexicalRichTextField';
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
    }),
    lexicalRichTextField({
      name: 'lexicalRichTextEditor2',
      label: 'Lexical Rich Text Editor 2',
    }),
  ],
};

export default Lexical;
