/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { HashtagNode } from '@lexical/hashtag';
import { ListItemNode, ListNode } from '@lexical/list';
import { MarkNode } from '@lexical/mark';
import { OverflowNode } from '@lexical/overflow';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';

import { ImageNode } from './ImageNode';
import { InlineImageNode } from './InlineImageNode/InlineImageNode';
import { TableNode as NewTableNode } from './TableNode';

import type { EditorConfig } from '../../../types';
import type { Klass, LexicalNode } from 'lexical';

function PlaygroundNodes(editorConfig: EditorConfig): Array<Klass<LexicalNode>> {
  const nodes: Array<Klass<LexicalNode>> = [];
  if (editorConfig.toggles.tables.enabled) {
    nodes.push(NewTableNode, TableNode, TableCellNode, TableRowNode);
  }

  if (editorConfig.toggles.upload.enabled) {
    nodes.push(ImageNode);
    nodes.push(InlineImageNode);
  }

  nodes.push(
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    HashtagNode,
    CodeHighlightNode,
    OverflowNode,
    MarkNode
  );

  for (const feature of editorConfig.features) {
    if (feature.nodes != null && feature.nodes.length > 0) {
      for (const node of feature.nodes) {
        nodes.push(node);
      }
    }
  }

  return nodes;
}

export default PlaygroundNodes;
