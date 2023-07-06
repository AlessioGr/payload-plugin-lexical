"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.$isCollapsibleTitleNode = exports.$createCollapsibleTitleNode = exports.CollapsibleTitleNode = exports.convertSummaryElement = void 0;
const lexical_1 = require("lexical");
const CollapsibleContainerNode_1 = require("./CollapsibleContainerNode");
const CollapsibleContentNode_1 = require("./CollapsibleContentNode");
function convertSummaryElement(domNode) {
    const node = $createCollapsibleTitleNode();
    return {
        node,
    };
}
exports.convertSummaryElement = convertSummaryElement;
class CollapsibleTitleNode extends lexical_1.ElementNode {
    static getType() {
        return 'collapsible-title';
    }
    static clone(node) {
        return new CollapsibleTitleNode(node.__key);
    }
    createDOM(config, editor) {
        const dom = document.createElement('summary');
        dom.classList.add('Collapsible__title');
        return dom;
    }
    updateDOM(prevNode, dom) {
        return false;
    }
    static importDOM() {
        return {
            summary: (domNode) => {
                return {
                    conversion: convertSummaryElement,
                    priority: 1,
                };
            },
        };
    }
    static importJSON(serializedNode) {
        return $createCollapsibleTitleNode();
    }
    exportDOM() {
        const element = document.createElement('summary');
        return { element };
    }
    exportJSON() {
        return Object.assign(Object.assign({}, super.exportJSON()), { type: 'collapsible-title', version: 1 });
    }
    collapseAtStart(_selection) {
        this.getParentOrThrow().insertBefore(this);
        return true;
    }
    insertNewAfter(_, restoreSelection = true) {
        const containerNode = this.getParentOrThrow();
        if (!(0, CollapsibleContainerNode_1.$isCollapsibleContainerNode)(containerNode)) {
            throw new Error('CollapsibleTitleNode expects to be child of CollapsibleContainerNode');
        }
        if (containerNode.getOpen()) {
            const contentNode = this.getNextSibling();
            if (!(0, CollapsibleContentNode_1.$isCollapsibleContentNode)(contentNode)) {
                throw new Error('CollapsibleTitleNode expects to have CollapsibleContentNode sibling');
            }
            const firstChild = contentNode.getFirstChild();
            if ((0, lexical_1.$isElementNode)(firstChild)) {
                return firstChild;
            }
            const paragraph = (0, lexical_1.$createParagraphNode)();
            contentNode.append(paragraph);
            return paragraph;
        }
        const paragraph = (0, lexical_1.$createParagraphNode)();
        containerNode.insertAfter(paragraph, restoreSelection);
        return paragraph;
    }
}
exports.CollapsibleTitleNode = CollapsibleTitleNode;
function $createCollapsibleTitleNode() {
    return new CollapsibleTitleNode();
}
exports.$createCollapsibleTitleNode = $createCollapsibleTitleNode;
function $isCollapsibleTitleNode(node) {
    return node instanceof CollapsibleTitleNode;
}
exports.$isCollapsibleTitleNode = $isCollapsibleTitleNode;
//# sourceMappingURL=CollapsibleTitleNode.js.map