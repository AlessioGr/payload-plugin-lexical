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
const rich_text_1 = require("@lexical/rich-text");
const LinkPluginModified_1 = require("../plugins/LinkPlugin/LinkPluginModified");
const AutocompleteNode_1 = require("./AutocompleteNode");
const EmojiNode_1 = require("./EmojiNode");
const EquationNode_1 = require("./EquationNode");
const ImageNode_1 = require("./ImageNode");
const KeywordNode_1 = require("./KeywordNode");
const MentionNode_1 = require("./MentionNode");
const PlaygroundNodes = [
    rich_text_1.HeadingNode,
    list_1.ListNode,
    list_1.ListItemNode,
    rich_text_1.QuoteNode,
    code_1.CodeNode,
    hashtag_1.HashtagNode,
    code_1.CodeHighlightNode,
    LinkPluginModified_1.AutoLinkNode,
    LinkPluginModified_1.LinkNode,
    ImageNode_1.ImageNode,
    MentionNode_1.MentionNode,
    EmojiNode_1.EmojiNode,
    EquationNode_1.EquationNode,
    AutocompleteNode_1.AutocompleteNode,
    KeywordNode_1.KeywordNode,
];
exports.default = PlaygroundNodes;
