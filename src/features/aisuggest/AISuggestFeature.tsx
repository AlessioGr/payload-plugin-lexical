import * as React from 'react';

import { AISuggestNode } from './nodes/AISuggestNode';
import AISuggestPlugin from './plugins';
import { type Feature } from '../../types';

export function AISuggestFeature(props: {}): Feature {
  return {
    plugins: [
      {
        component: <AISuggestPlugin key="aisuggest" />,
      },
    ],
    nodes: [AISuggestNode],
    tableCellNodes: [AISuggestNode],
  };
}
