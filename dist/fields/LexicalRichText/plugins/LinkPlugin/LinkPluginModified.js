"use strict";
/** @module @lexical/link */
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleLink = exports.TOGGLE_LINK_COMMAND = exports.$isAutoLinkNode = exports.$createAutoLinkNode = exports.AutoLinkNode = exports.$isLinkNode = exports.$createLinkNode = exports.LinkNode = void 0;
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
/** @noInheritDoc */
class LinkNode extends lexical_1.ElementNode {
    static getType() {
        return 'link';
    }
    static clone(node) {
        return new LinkNode(node.__url, { rel: node.__rel, newTab: node.__newTab, doc: node.__doc, linkType: node.__linkType }, node.__key);
    }
    constructor(url, attributes = {}, key) {
        super(key);
        const { newTab = false, rel = null, doc = null, linkType = 'custom' } = attributes;
        this.__url = url;
        this.__newTab = newTab;
        this.__rel = rel;
        this.__doc = doc;
        this.__linkType = linkType;
    }
    createDOM(config) {
        const element = document.createElement('a');
        if (this.__linkType === 'custom') {
            element.href = this.__url;
        }
        if (this.__newTab) {
            element.target = '_blank';
        }
        if (this.__rel !== null) {
            element.rel = this.__rel;
        }
        (0, utils_1.addClassNamesToElement)(element, config.theme.link);
        return element;
    }
    updateDOM(prevNode, anchor, config) {
        const url = this.__url;
        const newTab = this.__newTab;
        const rel = this.__rel;
        if (url !== prevNode.__url && this.__linkType === 'custom') {
            anchor.href = url;
        }
        if (this.__linkType === 'internal' && prevNode.__linkType === 'custom') {
            anchor.removeAttribute('href');
        }
        if (newTab !== prevNode.__newTab) {
            if (newTab) {
                anchor.target = '_blank';
            }
            else {
                anchor.removeAttribute('target');
            }
        }
        if (rel !== prevNode.__rel) {
            if (rel) {
                anchor.rel = rel;
            }
            else {
                anchor.removeAttribute('rel');
            }
        }
        return false;
    }
    static importDOM() {
        return {
            a: (node) => ({
                conversion: convertAnchorElement,
                priority: 1,
            }),
        };
    }
    static importJSON(serializedNode) {
        const node = $createLinkNode(serializedNode.url, {
            rel: serializedNode.rel,
            newTab: serializedNode.newTab,
            linkType: serializedNode.linkType,
            doc: serializedNode.doc,
        });
        node.setFormat(serializedNode.format);
        node.setIndent(serializedNode.indent);
        node.setDirection(serializedNode.direction);
        return node;
    }
    exportJSON() {
        return Object.assign(Object.assign({}, super.exportJSON()), { rel: this.getRel(), newTab: this.isNewTab(), type: 'link', url: this.getURL(), linkType: this.getLinkType(), doc: this.getDoc(), version: 1 });
    }
    getURL() {
        return this.getLatest().__url;
    }
    setURL(url) {
        const writable = this.getWritable();
        writable.__url = url;
    }
    isNewTab() {
        return this.getLatest().__newTab;
    }
    setNewTab(newTab) {
        const writable = this.getWritable();
        writable.__newTab = newTab;
    }
    getDoc() {
        return this.getLatest().__doc;
    }
    setDoc(doc) {
        const writable = this.getWritable();
        writable.__doc = doc;
    }
    getLinkType() {
        return this.getLatest().__linkType;
    }
    setLinkType(linkType) {
        const writable = this.getWritable();
        writable.__linkType = linkType;
    }
    getRel() {
        return this.getLatest().__rel;
    }
    setRel(rel) {
        const writable = this.getWritable();
        writable.__rel = rel;
    }
    insertNewAfter(selection) {
        const element = this.getParentOrThrow().insertNewAfter(selection);
        if ((0, lexical_1.$isElementNode)(element)) {
            const linkNode = $createLinkNode(this.__url, {
                rel: this.__rel,
                newTab: this.__newTab,
                linkType: this.__linkType,
                doc: this.__doc,
            });
            element.append(linkNode);
            return linkNode;
        }
        return null;
    }
    canInsertTextBefore() {
        return false;
    }
    canInsertTextAfter() {
        return false;
    }
    canBeEmpty() {
        return false;
    }
    isInline() {
        return true;
    }
    extractWithChild(child, selection, destination) {
        if (!(0, lexical_1.$isRangeSelection)(selection)) {
            return false;
        }
        const anchorNode = selection.anchor.getNode();
        const focusNode = selection.focus.getNode();
        return (this.isParentOf(anchorNode)
            && this.isParentOf(focusNode)
            && selection.getTextContent().length > 0);
    }
}
exports.LinkNode = LinkNode;
function convertAnchorElement(domNode) {
    let node = null;
    if (domNode instanceof HTMLAnchorElement) {
        const content = domNode.textContent;
        if (content !== null && content !== '') {
            node = $createLinkNode(domNode.getAttribute('href') || '', {
                rel: domNode.getAttribute('rel'),
                newTab: domNode.getAttribute('target') === '_blank',
                linkType: 'custom',
                doc: null,
            });
        }
    }
    return { node };
}
function $createLinkNode(url, attributes) {
    return new LinkNode(url, attributes);
}
exports.$createLinkNode = $createLinkNode;
function $isLinkNode(node) {
    return node instanceof LinkNode;
}
exports.$isLinkNode = $isLinkNode;
// Custom node type to override `canInsertTextAfter` that will
// allow typing within the link
class AutoLinkNode extends LinkNode {
    static getType() {
        return 'autolink';
    }
    static clone(node) {
        return new AutoLinkNode(node.__url, { rel: node.__rel, newTab: node.__newTab, linkType: node.__linkType, doc: node.__doc }, node.__key);
    }
    static importJSON(serializedNode) {
        const node = $createAutoLinkNode(serializedNode.url, {
            rel: serializedNode.rel,
            newTab: serializedNode.newTab,
            linkType: serializedNode.linkType,
            doc: serializedNode.doc,
        });
        node.setFormat(serializedNode.format);
        node.setIndent(serializedNode.indent);
        node.setDirection(serializedNode.direction);
        return node;
    }
    static importDOM() {
        // TODO: Should link node should handle the import over autolink?
        return null;
    }
    exportJSON() {
        return Object.assign(Object.assign({}, super.exportJSON()), { type: 'autolink', version: 1 });
    }
    insertNewAfter(selection) {
        const element = this.getParentOrThrow().insertNewAfter(selection);
        if ((0, lexical_1.$isElementNode)(element)) {
            const linkNode = $createAutoLinkNode(this.__url, {
                rel: this.__rel,
                newTab: this.__newTab,
                linkType: this.__linkType,
                doc: this.__doc,
            });
            element.append(linkNode);
            return linkNode;
        }
        return null;
    }
}
exports.AutoLinkNode = AutoLinkNode;
function $createAutoLinkNode(url, attributes) {
    return new AutoLinkNode(url, attributes);
}
exports.$createAutoLinkNode = $createAutoLinkNode;
function $isAutoLinkNode(node) {
    return node instanceof AutoLinkNode;
}
exports.$isAutoLinkNode = $isAutoLinkNode;
exports.TOGGLE_LINK_COMMAND = (0, lexical_1.createCommand)('TOGGLE_LINK_COMMAND');
function toggleLink(linkData) {
    const rel = 'noopener'; /* attributes.rel === undefined ? 'noopener' : attributes.rel; */
    const selection = (0, lexical_1.$getSelection)();
    if (!(0, lexical_1.$isRangeSelection)(selection)) {
        return;
    }
    const nodes = selection.extract();
    if (linkData === null) {
        // Remove LinkNodes
        nodes.forEach((node) => {
            const parent = node.getParent();
            if ($isLinkNode(parent)) {
                const children = parent.getChildren();
                for (let i = 0; i < children.length; i += 1) {
                    parent.insertBefore(children[i]);
                }
                parent.remove();
            }
        });
    }
    else {
        // Add or merge LinkNodes
        if (nodes.length === 1) {
            const firstNode = nodes[0];
            // if the first node is a LinkNode or if its
            // parent is a LinkNode, we update the URL, target and rel.
            const linkNode = $isLinkNode(firstNode)
                ? firstNode
                : $getLinkAncestor(firstNode);
            if (linkNode !== null) {
                linkNode.setURL(linkData.url);
                linkNode.setNewTab(linkData.newTab);
                linkNode.setLinkType(linkData.linkType);
                linkNode.setDoc(linkData.doc);
                if (rel !== null) {
                    linkNode.setRel(rel);
                }
                return;
            }
        }
        let prevParent = null;
        let linkNode = null;
        nodes.forEach((node) => {
            const parent = node.getParent();
            if (parent === linkNode
                || parent === null
                || ((0, lexical_1.$isElementNode)(node) && !node.isInline())) {
                return;
            }
            if ($isLinkNode(parent)) {
                linkNode = parent;
                parent.setURL(linkData.url);
                parent.setNewTab(linkData.newTab);
                parent.setLinkType(linkData.linkType);
                parent.setDoc(linkData.doc);
                if (rel !== null) {
                    linkNode.setRel(rel);
                }
                return;
            }
            if (!parent.is(prevParent)) {
                prevParent = parent;
                linkNode = $createLinkNode(linkData.url, { rel, newTab: linkData.newTab, linkType: linkData.linkType, doc: linkData.doc });
                if ($isLinkNode(parent)) {
                    if (node.getPreviousSibling() === null) {
                        parent.insertBefore(linkNode);
                    }
                    else {
                        parent.insertAfter(linkNode);
                    }
                }
                else {
                    node.insertBefore(linkNode);
                }
            }
            if ($isLinkNode(node)) {
                if (node.is(linkNode)) {
                    return;
                }
                if (linkNode !== null) {
                    const children = node.getChildren();
                    for (let i = 0; i < children.length; i += 1) {
                        linkNode.append(children[i]);
                    }
                }
                node.remove();
                return;
            }
            if (linkNode !== null) {
                linkNode.append(node);
            }
        });
    }
}
exports.toggleLink = toggleLink;
function $getLinkAncestor(node) {
    return $getAncestor(node, (ancestor) => $isLinkNode(ancestor));
}
function $getAncestor(node, predicate) {
    let parent = node;
    while (parent !== null
        && (parent = parent.getParent()) !== null
        && !predicate(parent))
        ;
    return parent;
}
//# sourceMappingURL=LinkPluginModified.js.map