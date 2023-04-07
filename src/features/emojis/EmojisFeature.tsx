import { EditorConfig, Feature } from '../../types';
import { EmojiNode } from './nodes/EmojiNode';
import EmojisPlugin from './plugins';
import * as React from 'react';

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
