import * as React from 'react';

import { MentionNode } from './nodes/MentionNode';
import MentionsPlugin from './plugins';
import { type Feature } from '../../types';

export function MentionsFeature(): Feature {
  return {
    plugins: [
      {
        component: <MentionsPlugin key="mentions" />,
      },
    ],
    subEditorPlugins: [<MentionsPlugin key="mentions" />],
    tablePlugins: [<MentionsPlugin key="mentions" />],
    nodes: [MentionNode],
    tableCellNodes: [MentionNode],
  };
}
