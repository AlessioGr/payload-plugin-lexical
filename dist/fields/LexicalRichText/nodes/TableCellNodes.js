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
const ImageNode_1 = require("./ImageNode");
function TableCellNodes(editorConfig) {
    const nodes = [
        rich_text_1.HeadingNode,
        list_1.ListNode,
        list_1.ListItemNode,
        rich_text_1.QuoteNode,
        code_1.CodeNode,
        hashtag_1.HashtagNode,
        code_1.CodeHighlightNode,
        ImageNode_1.ImageNode,
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
exports.default = TableCellNodes;
//# sourceMappingURL=TableCellNodes.js.map