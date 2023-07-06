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
const rich_text_1 = require("@lexical/rich-text");
const table_1 = require("@lexical/table");
const TableNode_1 = require("./TableNode");
const ImageNode_1 = require("./ImageNode");
function PlaygroundNodes(editorConfig) {
    const nodes = [];
    if (editorConfig.toggles.tables.enabled) {
        nodes.push(TableNode_1.TableNode, table_1.TableNode, table_1.TableCellNode, table_1.TableRowNode);
    }
    if (editorConfig.toggles.upload.enabled) {
        nodes.push(ImageNode_1.ImageNode);
    }
    nodes.push(rich_text_1.HeadingNode, list_1.ListNode, list_1.ListItemNode, rich_text_1.QuoteNode, code_1.CodeNode, hashtag_1.HashtagNode, code_1.CodeHighlightNode, overflow_1.OverflowNode, mark_1.MarkNode);
    for (const feature of editorConfig.features) {
        if (feature.nodes && feature.nodes.length > 0) {
            for (const node of feature.nodes) {
                nodes.push(node);
            }
        }
    }
    return nodes;
}
exports.default = PlaygroundNodes;
//# sourceMappingURL=PlaygroundNodes.js.map