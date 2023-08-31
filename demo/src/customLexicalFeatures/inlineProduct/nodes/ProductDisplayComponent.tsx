import * as React from 'react';
import { Suspense, useEffect, useState } from 'react';

import { useConfig } from 'payload/distadmin/components/utilities/Config/index';
import { useTranslation } from 'react-i18next';
import { requests } from 'payload/distadmin/api';
import { Display } from './InlineProductNode';
import './index.scss';

export default function ProductDisplayComponent({
  doc,
  display,
  customLabel,
}: {
  doc: {
    value: string;
    relationTo: string;
  } | null;
  display: Display;
  customLabel?: string;
}): JSX.Element {
  console.log('customLabel: ', customLabel);
  const {
    collections,
    serverURL,
    routes: { api },
  } = useConfig();
  const { i18n } = useTranslation();

  console.log('Loading ProductDisplayComponent...');

  const [productData, setProductData] = useState<{
    href: string;
    label: string;
  }>({ href: undefined, label: 'Loading product...' });

  useEffect(() => {
    async function loadProductData() {
      const response = await requests.get(`${serverURL}${api}/${doc?.relationTo}/${doc.value}`, {
        headers: {
          'Accept-Language': i18n.language,
        },
      });
      const json = await response.json();

      const shops = json?.product?.shops;
      const best_shop_price = shops[0].price ?? '??';
      const best_shop_price_currency = shops[0].currency ?? '??';

      if (display === 'name') {
        setProductData({
          href: undefined,
          label: json?.title,
        });
      } else if (display === 'price_best_shop') {
        if (shops.length > 0) {
          setProductData({
            href: undefined,
            label: best_shop_price + ' ' + best_shop_price_currency,
          });
        }
      } else if (display === 'name_price_best_shop_brackets') {
        if (shops.length > 0) {
          setProductData({
            href: undefined,
            label: json?.title + ' (' + best_shop_price + ' ' + best_shop_price_currency + ')',
          });
        }
      } else if (display === 'affiliate_link_best_shop_label_name_and_price') {
        if (shops.length > 0) {
          setProductData({
            href: shops[0].link,
            label:
              (customLabel ?? json?.title) +
              ' (' +
              best_shop_price +
              ' ' +
              best_shop_price_currency +
              ')',
          });
        }
      } else if (display === 'affiliate_link_best_shop_label_name') {
        if (shops.length > 0) {
          setProductData({
            href: shops[0].link,
            label: customLabel ?? json?.title,
          });
        }
      } else {
        setProductData({
          href: '',
          label: 'Unknown display type',
        });
      }
    }

    loadProductData();
  }, []);

  return (
    <Suspense fallback={<span>Loading product...</span>}>
      <a className="productDisplayComponent" href={productData.href}>
        {productData.label}
      </a>
    </Suspense>
  );
}
