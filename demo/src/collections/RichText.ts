import { CollectionConfig } from 'payload/types';

const RichText: CollectionConfig = {
  slug: 'slateRichText',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      required: true,
    },
  ],
};

export default RichText;
