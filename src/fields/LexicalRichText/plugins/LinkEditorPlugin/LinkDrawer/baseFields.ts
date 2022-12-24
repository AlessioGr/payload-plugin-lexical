import { Config } from 'payload/dist/config/types';
import { Field } from 'payload/dist/fields/config/types';
import { extractTranslations } from 'payload/dist/translations/extractTranslations';

const translations = extractTranslations([
  'fields:textToDisplay',
  'fields:linkType',
  'fields:chooseBetweenCustomTextOrDocument',
  'fields:customURL',
  'fields:internalLink',
  'fields:enterURL',
  'fields:chooseDocumentToLink',
  'fields:openInNewTab',
]);

export const getBaseFields = (config: Config): Field[] => [
  {
    name: 'text',
    label: translations['fields:textToDisplay'],
    type: 'text',
    required: true,
  },
  {
    name: 'linkType',
    label: translations['fields:linkType'],
    type: 'radio',
    required: true,
    admin: {
      description: translations['fields:chooseBetweenCustomTextOrDocument'],
    },
    defaultValue: 'custom',
    options: [
      {
        label: translations['fields:customURL'],
        value: 'custom',
      },
      {
        label: translations['fields:internalLink'],
        value: 'internal',
      },
    ],
  },
  {
    name: 'url',
    label: translations['fields:enterURL'],
    type: 'text',
    required: true,
    admin: {
      condition: ({ linkType, url }) => {
        return (typeof linkType === 'undefined' && url) || linkType === 'custom';
      },
    },
  },
  {
    name: 'doc',
    label: translations['fields:chooseDocumentToLink'],
    type: 'relationship',
    required: true,
    relationTo: config.collections.map(({ slug }) => slug),
    admin: {
      condition: ({ linkType }) => {
        return linkType === 'internal';
      },
    },
  },
  {
    name: 'newTab',
    label: translations['fields:openInNewTab'],
    type: 'checkbox',
  },
];
