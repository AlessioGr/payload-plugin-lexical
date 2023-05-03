import * as React from 'react';

import { EmojiNode } from './nodes/EmojiNode';
import EmojisPlugin from './plugins';
import { EditorConfig, type Feature } from '../../types';


export function EmojisFeature(props: {}): Feature {
  return {
    plugins: [
      {
        component: <EmojisPlugin key="emojis" />,
      },
    ],
    subEditorPlugins: [<EmojisPlugin key="emojis" />],
    nodes: [EmojiNode],
    tableCellNodes: [EmojiNode],
  };
}
