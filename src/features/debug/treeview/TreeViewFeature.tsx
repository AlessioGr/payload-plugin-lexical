import * as React from 'react';

import TreeViewPlugin from './plugins';
import { type Feature } from '../../../types';

export function TreeViewFeature(props: { enabled: boolean }): Feature {
  const { enabled = false } = props;

  return {
    plugins: [
      {
        component: enabled && <TreeViewPlugin key="treeview" />,
        position: 'bottom',
      },
    ],
  };
}
