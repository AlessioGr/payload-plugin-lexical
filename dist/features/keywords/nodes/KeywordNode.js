"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.$isKeywordNode = exports.$createKeywordNode = exports.KeywordNode = void 0;
const lexical_1 = require("lexical");
class KeywordNode extends lexical_1.TextNode {
    static getType() {
        return 'keyword';
    }
    static clone(node) {
        return new KeywordNode(node.__text, node.__key);
    }
    static importJSON(serializedNode) {
        const node = $createKeywordNode(serializedNode.text);
        node.setFormat(serializedNode.format);
        node.setDetail(serializedNode.detail);
        node.setMode(serializedNode.mode);
        node.setStyle(serializedNode.style);
        return node;
    }
    exportJSON() {
        return Object.assign(Object.assign({}, super.exportJSON()), { type: 'keyword', version: 1 });
    }
    createDOM(config) {
        const dom = super.createDOM(config);
        dom.style.cursor = 'default';
        dom.className = 'keyword';
        return dom;
    }
    canInsertTextBefore() {
        return false;
    }
    canInsertTextAfter() {
        return false;
    }
    isTextEntity() {
        return true;
    }
}
exports.KeywordNode = KeywordNode;
function $createKeywordNode(keyword) {
    return new KeywordNode(keyword);
}
exports.$createKeywordNode = $createKeywordNode;
function $isKeywordNode(node) {
    return node instanceof KeywordNode;
}
exports.$isKeywordNode = $isKeywordNode;
//# sourceMappingURL=KeywordNode.js.map