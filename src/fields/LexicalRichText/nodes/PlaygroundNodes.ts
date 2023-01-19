/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Klass, LexicalNode } from "lexical";

import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { HashtagNode } from "@lexical/hashtag";
import { ListItemNode, ListNode } from "@lexical/list";
import { MarkNode } from "@lexical/mark";
import { OverflowNode } from "@lexical/overflow";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { AutoLinkNode, LinkNode } from "../plugins/LinkPlugin/LinkNodeModified";

import { CollapsibleContainerNode } from "../plugins/CollapsiblePlugin/CollapsibleContainerNode";
import { CollapsibleContentNode } from "../plugins/CollapsiblePlugin/CollapsibleContentNode";
import { CollapsibleTitleNode } from "../plugins/CollapsiblePlugin/CollapsibleTitleNode";
import { AutocompleteNode } from "./AutocompleteNode";
import { ImageNode } from "./ImageNode";
import { TableNode as NewTableNode } from "./TableNode";
import type { EditorConfig } from "../../../types";

function PlaygroundNodes(
  editorConfig: EditorConfig
): Array<Klass<LexicalNode>> {
  const nodes: Array<Klass<LexicalNode>> = [];
  if (editorConfig.featuresold.tables.enabled) {
    nodes.push(NewTableNode, TableNode, TableCellNode, TableRowNode);
  }

  if (editorConfig.featuresold.upload.enabled) {
    nodes.push(ImageNode);
  }

  nodes.push(
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    HashtagNode,
    CodeHighlightNode,
    AutoLinkNode,
    LinkNode,
    OverflowNode,
    AutocompleteNode,
    MarkNode,
    CollapsibleContainerNode,
    CollapsibleContentNode,
    CollapsibleTitleNode
  );

  for (const feature of editorConfig.features) {
    if (feature.nodes && feature.nodes.length > 0) {
      for (const node of feature.nodes) {
        nodes.push(node);
      }
    }
  }

  return nodes;
}

export default PlaygroundNodes;
