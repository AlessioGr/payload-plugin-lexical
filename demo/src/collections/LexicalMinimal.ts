import { CollectionConfig } from 'payload/types';
import minimalLexicalRichText from '../fields/minimalLexicalRichTextField';

const LexicalMinimal: CollectionConfig = {
  slug: 'minimalLexicalRichText',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    minimalLexicalRichText(),
  ],
};

export default LexicalMinimal;
