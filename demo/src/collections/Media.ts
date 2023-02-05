import { CollectionConfig } from 'payload/types';
import path from 'path';

const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: (): boolean => true,
  },
  admin: {
    useAsTitle: 'filename',
    group: 'Other',
  },
  upload: {
    staticDir: path.resolve(__dirname, '../../uploads'),
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt Text',
      type: 'text',
      required: true,
    },
  ]
}

export default Media;
