import * as React from 'react';

import { KeywordNode } from './nodes/KeywordNode';
import KeywordsPlugin from './plugins';
import { type Feature } from '../../types';

export function KeywordsFeature(): Feature {
  return {
    plugins: [
      {
        component: <KeywordsPlugin key="keywords" />,
      },
    ],
    subEditorPlugins: [<KeywordsPlugin key="keywords" />],
    nodes: [KeywordNode],
    tableCellNodes: [KeywordNode],
  };
}
