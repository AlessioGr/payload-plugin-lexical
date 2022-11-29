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
import { MarkNode } from '@lexical/mark';
import { OverflowNode } from '@lexical/overflow';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { AutoLinkNode, LinkNode } from '../plugins/LinkPlugin/LinkPluginModified';

import { CollapsibleContainerNode } from '../plugins/CollapsiblePlugin/CollapsibleContainerNode';
import { CollapsibleContentNode } from '../plugins/CollapsiblePlugin/CollapsibleContentNode';
import { CollapsibleTitleNode } from '../plugins/CollapsiblePlugin/CollapsibleTitleNode';
import { AutocompleteNode } from './AutocompleteNode';
import { EmojiNode } from './EmojiNode';
import { EquationNode } from './EquationNode';
import { FigmaNode } from './FigmaNode';
import { ImageNode } from './ImageNode';
import { KeywordNode } from './KeywordNode';
import { MentionNode } from './MentionNode';
import { TableNode as NewTableNode } from './TableNode';
import { TweetNode } from './TweetNode';
import { YouTubeNode } from './YouTubeNode';
import type {EditorConfig} from "../../../types";

function PlaygroundNodes(editorConfig: EditorConfig): Array<Klass<LexicalNode>> {
  const nodes: Array<Klass<LexicalNode>> = [];
  if(editorConfig.features.tables.enabled){
    nodes.push(NewTableNode, TableNode, TableCellNode, TableRowNode);
  }

  if(editorConfig.features.upload.enabled){
    nodes.push(ImageNode);
  }

  if(editorConfig.features.mentions.enabled){
    nodes.push(MentionNode);
  }
  if(editorConfig.features.twitter.enabled){
    nodes.push(TweetNode);
  }
  if(editorConfig.features.horizontalRule.enabled){
    nodes.push(HorizontalRuleNode);
  }
  if(editorConfig.features.youtube.enabled){
    nodes.push(YouTubeNode);
  }
  if(editorConfig.features.figma.enabled){
    nodes.push(FigmaNode);
  }
  if(editorConfig.features.equations.enabled){
    nodes.push(EquationNode);
  }

  if(editorConfig.nodes.length > 0){
    for(const customNode of editorConfig.nodes){
      nodes.push(customNode.node);
    }
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
      MentionNode,
      EmojiNode,
      AutocompleteNode,
      KeywordNode,
      MarkNode,
      CollapsibleContainerNode,
      CollapsibleContentNode,
      CollapsibleTitleNode
  )

  return nodes;
}

export default PlaygroundNodes;
