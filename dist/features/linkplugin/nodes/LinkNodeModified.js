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
exports.toggleLink = exports.TOGGLE_LINK_COMMAND = exports.$isLinkNode = exports.$createLinkNode = exports.LinkNode = void 0;
const lexical_1 = require("lexical");
const utils_1 = require("@lexical/utils");
const SUPPORTED_URL_PROTOCOLS = new Set([
    'http:',
    'https:',
    'mailto:',
    'sms:',
    'tel:',
]);
/** @noInheritDoc */
class LinkNode extends lexical_1.ElementNode {
    static getType() {
        return 'link';
    }
    static clone(node) {
        return new LinkNode({
            attributes: node.__attributes,
            key: node.__key,
        });
    }
    constructor({ attributes = {
        url: null,
        newTab: false,
        sponsored: false,
        nofollow: false,
        rel: null,
        doc: null,
        linkType: 'custom',
    }, key, }) {
        super(key);
        this.__attributes = attributes;
    }
    createDOM(config) {
        var _a, _b, _c, _d, _e;
        const element = document.createElement('a');
        if (((_a = this.__attributes) === null || _a === void 0 ? void 0 : _a.linkType) === 'custom') {
            element.href = this.sanitizeUrl(this.__attributes.url);
        }
        if ((_b = this.__attributes) === null || _b === void 0 ? void 0 : _b.newTab) {
            element.target = '_blank';
        }
        element.rel = '';
        if ((_c = this.__attributes) === null || _c === void 0 ? void 0 : _c.sponsored) {
            element.rel += 'sponsored';
        }
        if ((_d = this.__attributes) === null || _d === void 0 ? void 0 : _d.nofollow) {
            element.rel += ' nofollow';
        }
        if (((_e = this.__attributes) === null || _e === void 0 ? void 0 : _e.rel) !== null) {
            element.rel += ` ${this.__rel}`;
        }
        (0, utils_1.addClassNamesToElement)(element, config.theme.link);
        return element;
    }
    updateDOM(prevNode, anchor, config) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const url = (_a = this.__attributes) === null || _a === void 0 ? void 0 : _a.url;
        const newTab = (_b = this.__attributes) === null || _b === void 0 ? void 0 : _b.newTab;
        const sponsored = (_c = this.__attributes) === null || _c === void 0 ? void 0 : _c.sponsored;
        const nofollow = (_d = this.__attributes) === null || _d === void 0 ? void 0 : _d.nofollow;
        const rel = (_e = this.__attributes) === null || _e === void 0 ? void 0 : _e.rel;
        if (url !== ((_f = prevNode.__attributes) === null || _f === void 0 ? void 0 : _f.url)
            && ((_g = this.__attributes) === null || _g === void 0 ? void 0 : _g.linkType) === 'custom') {
            anchor.href = url;
        }
        if (((_h = this.__attributes) === null || _h === void 0 ? void 0 : _h.linkType) === 'internal'
            && ((_j = prevNode.__attributes) === null || _j === void 0 ? void 0 : _j.linkType) === 'custom') {
            anchor.removeAttribute('href');
        }
        if (newTab !== ((_k = prevNode.__attributes) === null || _k === void 0 ? void 0 : _k.newTab)) {
            if (newTab) {
                anchor.target = '_blank';
            }
            else {
                anchor.removeAttribute('target');
            }
        }
        if (!anchor.rel) {
            anchor.rel = '';
        }
        if (sponsored !== prevNode.__attributes.sponsored) {
            if (sponsored) {
                anchor.rel += 'sponsored';
            }
            else {
                anchor.rel.replace(' sponsored', '').replace('sponsored', '');
            }
        }
        if (nofollow !== prevNode.__attributes.nofollow) {
            if (nofollow) {
                anchor.rel += 'nofollow';
            }
            else {
                anchor.rel.replace(' nofollow', '').replace('nofollow', '');
            }
        }
        if (rel !== prevNode.__attributes.rel) {
            if (rel) {
                anchor.rel += rel;
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
        const node = $createLinkNode({
            attributes: serializedNode.attributes,
        });
        node.setFormat(serializedNode.format);
        node.setIndent(serializedNode.indent);
        node.setDirection(serializedNode.direction);
        return node;
    }
    sanitizeUrl(url) {
        try {
            const parsedUrl = new URL(url);
            // eslint-disable-next-line no-script-url
            if (!SUPPORTED_URL_PROTOCOLS.has(parsedUrl.protocol)) {
                return 'about:blank';
            }
        }
        catch (e) {
            return 'https://';
        }
        return url;
    }
    exportJSON() {
        return Object.assign(Object.assign({}, super.exportJSON()), { attributes: this.getAttributes(), type: 'link', version: 2 });
    }
    getAttributes() {
        return this.getLatest().__attributes;
    }
    setAttributes(attributes) {
        const writable = this.getWritable();
        writable.__attributes = attributes;
    }
    insertNewAfter(selection, restoreSelection = true) {
        const element = this.getParentOrThrow().insertNewAfter(selection, restoreSelection);
        if ((0, lexical_1.$isElementNode)(element)) {
            const linkNode = $createLinkNode({ attributes: this.__attributes });
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
    var _a, _b;
    let node = null;
    if ((0, utils_1.isHTMLAnchorElement)(domNode)) {
        const content = domNode.textContent;
        if (content !== null && content !== '') {
            node = $createLinkNode({
                attributes: {
                    url: domNode.getAttribute('href') || '',
                    rel: domNode.getAttribute('rel'),
                    newTab: domNode.getAttribute('target') === '_blank',
                    sponsored: ((_a = domNode.getAttribute('rel')) === null || _a === void 0 ? void 0 : _a.includes('sponsored')) || false,
                    nofollow: ((_b = domNode.getAttribute('rel')) === null || _b === void 0 ? void 0 : _b.includes('nofollow')) || false,
                    linkType: 'custom',
                    doc: null,
                },
            });
        }
    }
    return { node };
}
function $createLinkNode({ attributes, }) {
    return (0, lexical_1.$applyNodeReplacement)(new LinkNode({ attributes }));
}
exports.$createLinkNode = $createLinkNode;
function $isLinkNode(node) {
    return node instanceof LinkNode;
}
exports.$isLinkNode = $isLinkNode;
exports.TOGGLE_LINK_COMMAND = (0, lexical_1.createCommand)('TOGGLE_LINK_COMMAND');
function toggleLink(linkAttributes) {
    const selection = (0, lexical_1.$getSelection)();
    if (!(0, lexical_1.$isRangeSelection)(selection)) {
        return;
    }
    const nodes = selection.extract();
    if (linkAttributes === null) {
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
                linkNode.setAttributes(linkAttributes);
                if (linkAttributes.text
                    && linkAttributes.text !== linkNode.getTextContent()) {
                    // remove all children and add child with new textcontent:
                    linkNode.append((0, lexical_1.$createTextNode)(linkAttributes.text));
                    linkNode.getChildren().forEach((child) => {
                        if (child !== linkNode.getLastChild()) {
                            child.remove();
                        }
                    });
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
                parent.setAttributes(linkAttributes);
                if (linkAttributes.text
                    && linkAttributes.text !== parent.getTextContent()) {
                    // remove all children and add child with new textcontent:
                    parent.append((0, lexical_1.$createTextNode)(linkAttributes.text));
                    parent.getChildren().forEach((child) => {
                        if (child !== parent.getLastChild()) {
                            child.remove();
                        }
                    });
                }
                return;
            }
            if (!parent.is(prevParent)) {
                prevParent = parent;
                linkNode = $createLinkNode({ attributes: linkAttributes });
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
//# sourceMappingURL=LinkNodeModified.js.map