import * as React from 'react';

import PasteLogPlugin from './plugins';
import { type Feature } from '../../../types';

export function PasteLogFeature(props: { enabled: boolean }): Feature {
  const { enabled = false } = props;

  return {
    plugins: [
      {
        component: enabled ? <PasteLogPlugin key="pastelog" /> : <></>,
        position: 'outside',
      },
    ],
  };
}
