import { Config } from 'payload/config';
import { Field } from 'payload/types';

export const getBaseFields = (config: Config): Field[] => [
  {
    name: 'doc',
    label: 'Product',
    type: 'relationship',
    required: true,
    relationTo: /*config.collections.map(({ slug }) => slug),*/ 'products',
  },
  {
    name: 'customLabel',
    label: 'Custom Label (optional)',
    type: 'text',
    required: false,
  },
  {
    name: 'display', // required
    label: 'Display',
    type: 'select', // required
    defaultValue: 'affiliate_link_best_shop_label_name_and_price',
    required: true,
    options: [
      {
        label: 'Name',
        value: 'name',
      },
      {
        label: 'Price',
        value: 'price_best_shop',
      },
      {
        label: 'Price Range',
        value: 'price_range_all_shops',
      },
      {
        label: 'Name with price in brackets',
        value: 'name_price_best_shop_brackets',
      },
      {
        label: 'Name with price range in brackets',
        value: 'name_price_range_all_shops_brackets',
      },
      {
        label: 'Affiliate Link best shop (Name as label)',
        value: 'affiliate_link_best_shop_label_name',
      },
      {
        label: 'Affiliate Link best shop (Name as label with price in brackets)',
        value: 'affiliate_link_best_shop_label_name_and_price',
      },
    ],
  },
];
