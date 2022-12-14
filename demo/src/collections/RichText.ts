import { CollectionConfig } from 'payload/types';

const RichText: CollectionConfig = {
    slug: 'richText',
    admin: {
        useAsTitle: 'title',
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true
        },
        {
            name: 'richText',
            type: 'richText'
        },
    ]
}

export default RichText;
