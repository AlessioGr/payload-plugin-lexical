"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.$isCollapsibleContentNode = exports.$createCollapsibleContentNode = exports.CollapsibleContentNode = void 0;
const lexical_1 = require("lexical");
class CollapsibleContentNode extends lexical_1.ElementNode {
    static getType() {
        return 'collapsible-content';
    }
    static clone(node) {
        return new CollapsibleContentNode(node.__key);
    }
    createDOM(config) {
        const dom = document.createElement('div');
        dom.classList.add('Collapsible__content');
        return dom;
    }
    updateDOM(prevNode, dom) {
        return false;
    }
    static importDOM() {
        return {};
    }
    static importJSON(serializedNode) {
        return $createCollapsibleContentNode();
    }
    isShadowRoot() {
        return true;
    }
    exportJSON() {
        return {
            ...super.exportJSON(),
            type: 'collapsible-content',
            version: 1,
        };
    }
}
exports.CollapsibleContentNode = CollapsibleContentNode;
function $createCollapsibleContentNode() {
    return new CollapsibleContentNode();
}
exports.$createCollapsibleContentNode = $createCollapsibleContentNode;
function $isCollapsibleContentNode(node) {
    return node instanceof CollapsibleContentNode;
}
exports.$isCollapsibleContentNode = $isCollapsibleContentNode;
