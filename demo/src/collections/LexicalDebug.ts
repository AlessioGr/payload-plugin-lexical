import { CollectionConfig } from 'payload/types';
import debugLexicalRichText from '../fields/debugLexicalRichTextField';

const LexicalDebug: CollectionConfig = {
  slug: 'debugLexicalRichText',
  admin: {
    useAsTitle: 'title',
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    debugLexicalRichText({ debug: true }),
  ],
};

export default LexicalDebug;
