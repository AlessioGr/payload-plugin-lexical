"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$isAutoLinkNode = exports.$createAutoLinkNode = exports.AutoLinkNode = void 0;
const lexical_1 = require("lexical");
const LinkNodeModified_1 = require("./LinkNodeModified");
// Custom node type to override `canInsertTextAfter` that will
// allow typing within the link
class AutoLinkNode extends LinkNodeModified_1.LinkNode {
    static getType() {
        return 'autolink';
    }
    static clone(node) {
        return new AutoLinkNode({ attributes: node.__attributes, key: node.__key });
    }
    static importJSON(serializedNode) {
        const node = $createAutoLinkNode({ attributes: serializedNode.attributes });
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
    insertNewAfter(selection, restoreSelection = true) {
        const element = this.getParentOrThrow().insertNewAfter(selection, restoreSelection);
        if ((0, lexical_1.$isElementNode)(element)) {
            const linkNode = $createAutoLinkNode({ attributes: this.__attributes });
            element.append(linkNode);
            return linkNode;
        }
        return null;
    }
}
exports.AutoLinkNode = AutoLinkNode;
function $createAutoLinkNode({ attributes, }) {
    return (0, lexical_1.$applyNodeReplacement)(new AutoLinkNode({ attributes: attributes }));
}
exports.$createAutoLinkNode = $createAutoLinkNode;
function $isAutoLinkNode(node) {
    return node instanceof AutoLinkNode;
}
exports.$isAutoLinkNode = $isAutoLinkNode;
//# sourceMappingURL=AutoLinkNodeModified.js.map