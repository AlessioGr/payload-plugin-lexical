import * as React from 'react';

import { AutocompleteNode } from './nodes/AutocompleteNode';
import AutocompletePlugin from './plugins';
import { type Feature } from '../../types';

export function AutoCompleteFeature(props: {}): Feature {
  return {
    plugins: [
      {
        component: <AutocompletePlugin key="autocomplete" />,
      },
    ],
    nodes: [AutocompleteNode],
    tableCellNodes: [AutocompleteNode],
  };
}
