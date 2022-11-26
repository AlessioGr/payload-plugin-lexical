"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const code_1 = require("@lexical/code");
const hashtag_1 = require("@lexical/hashtag");
const list_1 = require("@lexical/list");
const mark_1 = require("@lexical/mark");
const overflow_1 = require("@lexical/overflow");
const LexicalHorizontalRuleNode_1 = require("@lexical/react/LexicalHorizontalRuleNode");
const rich_text_1 = require("@lexical/rich-text");
const table_1 = require("@lexical/table");
const LinkPluginModified_1 = require("../plugins/LinkPlugin/LinkPluginModified");
const CollapsibleContainerNode_1 = require("../plugins/CollapsiblePlugin/CollapsibleContainerNode");
const CollapsibleContentNode_1 = require("../plugins/CollapsiblePlugin/CollapsibleContentNode");
const CollapsibleTitleNode_1 = require("../plugins/CollapsiblePlugin/CollapsibleTitleNode");
const AutocompleteNode_1 = require("./AutocompleteNode");
const EmojiNode_1 = require("./EmojiNode");
const EquationNode_1 = require("./EquationNode");
const FigmaNode_1 = require("./FigmaNode");
const ImageNode_1 = require("./ImageNode");
const KeywordNode_1 = require("./KeywordNode");
const MentionNode_1 = require("./MentionNode");
const TableNode_1 = require("./TableNode");
const TweetNode_1 = require("./TweetNode");
const YouTubeNode_1 = require("./YouTubeNode");
const PlaygroundNodes = [
    rich_text_1.HeadingNode,
    list_1.ListNode,
    list_1.ListItemNode,
    rich_text_1.QuoteNode,
    code_1.CodeNode,
    TableNode_1.TableNode,
    table_1.TableNode,
    table_1.TableCellNode,
    table_1.TableRowNode,
    hashtag_1.HashtagNode,
    code_1.CodeHighlightNode,
    LinkPluginModified_1.AutoLinkNode,
    LinkPluginModified_1.LinkNode,
    overflow_1.OverflowNode,
    ImageNode_1.ImageNode,
    MentionNode_1.MentionNode,
    EmojiNode_1.EmojiNode,
    EquationNode_1.EquationNode,
    AutocompleteNode_1.AutocompleteNode,
    KeywordNode_1.KeywordNode,
    LexicalHorizontalRuleNode_1.HorizontalRuleNode,
    TweetNode_1.TweetNode,
    YouTubeNode_1.YouTubeNode,
    FigmaNode_1.FigmaNode,
    mark_1.MarkNode,
    CollapsibleContainerNode_1.CollapsibleContainerNode,
    CollapsibleContentNode_1.CollapsibleContentNode,
    CollapsibleTitleNode_1.CollapsibleTitleNode,
];
exports.default = PlaygroundNodes;
