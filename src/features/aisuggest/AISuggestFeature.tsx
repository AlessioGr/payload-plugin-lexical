import { Feature } from '../../types';
import * as React from 'react';
import AISuggestPlugin from './plugins';
import { AISuggestNode } from './nodes/AISuggestNode';

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
