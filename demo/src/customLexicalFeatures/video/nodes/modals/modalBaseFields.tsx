import { Config } from 'payload/dist/config/types';
import { Field } from 'payload/dist/fields/config/types';

export const getBaseFields = (config: Config): Field[] => [
  {
    name: 'source',
    label: 'Source',
    type: 'select',
    required: true,
    options: [
      {
        label: 'YouTube',
        value: 'youtube',
      },
      {
        label: 'Vimeo',
        value: 'vimeo',
      },
    ],
  },
  {
    name: 'id',
    label: 'ID',
    type: 'text',
    required: true,
  },
];
