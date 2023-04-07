/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Klass, LexicalNode } from 'lexical';

import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { HashtagNode } from '@lexical/hashtag';
import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';

import { ImageNode } from './ImageNode';
import { EditorConfig } from '../../../types';

function TableCellNodes(editorConfig: EditorConfig): Array<Klass<LexicalNode>> {
  const nodes: Array<Klass<LexicalNode>> = [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    HashtagNode,
    CodeHighlightNode,
    ImageNode,
  ];

  for (const feature of editorConfig.features) {
    if (feature.tableCellNodes && feature.tableCellNodes.length > 0) {
      for (const node of feature.tableCellNodes) {
        nodes.push(node);
      }
    }
  }

  return nodes;
}

export default TableCellNodes;
