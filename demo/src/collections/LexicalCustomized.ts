import { CollectionConfig } from 'payload/types';
import customizedLexicalRichText from '../fields/customizedLexicalRichTextField';

const LexicalCustomized: CollectionConfig = {
  slug: 'customLexicalRichText',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    customizedLexicalRichText(),
  ],
};

export default LexicalCustomized;
