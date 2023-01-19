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
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { AutoLinkNode, LinkNode } from "../plugins/LinkPlugin/LinkNodeModified";

import { CollapsibleContainerNode } from "../plugins/CollapsiblePlugin/CollapsibleContainerNode";
import { CollapsibleContentNode } from "../plugins/CollapsiblePlugin/CollapsibleContentNode";
import { CollapsibleTitleNode } from "../plugins/CollapsiblePlugin/CollapsibleTitleNode";
import { AutocompleteNode } from "./AutocompleteNode";
import { FigmaNode } from "./FigmaNode";
import { ImageNode } from "./ImageNode";
import { KeywordNode } from "./KeywordNode";
import { MentionNode } from "./MentionNode";
import { TableNode as NewTableNode } from "./TableNode";
import { TweetNode } from "./TweetNode";
import { YouTubeNode } from "./YouTubeNode";
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

  if (editorConfig.featuresold.mentions.enabled) {
    nodes.push(MentionNode);
  }
  if (editorConfig.featuresold.twitter.enabled) {
    nodes.push(TweetNode);
  }
  if (editorConfig.featuresold.horizontalRule.enabled) {
    nodes.push(HorizontalRuleNode);
  }
  if (editorConfig.featuresold.youtube.enabled) {
    nodes.push(YouTubeNode);
  }
  if (editorConfig.featuresold.figma.enabled) {
    nodes.push(FigmaNode);
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
    KeywordNode,
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
