"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.$isCollapsibleContentNode = exports.$createCollapsibleContentNode = exports.CollapsibleContentNode = exports.convertCollapsibleContentElement = void 0;
const lexical_1 = require("lexical");
function convertCollapsibleContentElement(domNode) {
    const node = $createCollapsibleContentNode();
    return {
        node,
    };
}
exports.convertCollapsibleContentElement = convertCollapsibleContentElement;
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
        return {
            div: (domNode) => {
                if (!domNode.hasAttribute('data-lexical-collapsible-content')) {
                    return null;
                }
                return {
                    conversion: convertCollapsibleContentElement,
                    priority: 2,
                };
            },
        };
    }
    exportDOM() {
        const element = document.createElement('div');
        element.setAttribute('data-lexical-collapsible-content', 'true');
        return { element };
    }
    static importJSON(serializedNode) {
        return $createCollapsibleContentNode();
    }
    isShadowRoot() {
        return true;
    }
    exportJSON() {
        return Object.assign(Object.assign({}, super.exportJSON()), { type: 'collapsible-content', version: 1 });
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
//# sourceMappingURL=CollapsibleContentNode.js.map