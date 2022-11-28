"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOGGLE_COLLAPSIBLE_COMMAND = exports.INSERT_COLLAPSIBLE_COMMAND = void 0;
require("./Collapsible.scss");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const CollapsibleContainerNode_1 = require("./CollapsibleContainerNode");
const CollapsibleContentNode_1 = require("./CollapsibleContentNode");
const CollapsibleTitleNode_1 = require("./CollapsibleTitleNode");
exports.INSERT_COLLAPSIBLE_COMMAND = (0, lexical_1.createCommand)();
exports.TOGGLE_COLLAPSIBLE_COMMAND = (0, lexical_1.createCommand)();
function CollapsiblePlugin() {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => {
        if (!editor.hasNodes([
            CollapsibleContainerNode_1.CollapsibleContainerNode,
            CollapsibleTitleNode_1.CollapsibleTitleNode,
            CollapsibleContentNode_1.CollapsibleContentNode,
        ])) {
            throw new Error('CollapsiblePlugin: CollapsibleContainerNode, CollapsibleTitleNode, or CollapsibleContentNode not registered on editor');
        }
        return (0, utils_1.mergeRegister)(
        // Structure enforcing transformers for each node type. In case nesting structure is not
        // "Container > Title + Content" it'll unwrap nodes and convert it back
        // to regular content.
        editor.registerNodeTransform(CollapsibleContentNode_1.CollapsibleContentNode, (node) => {
            const parent = node.getParent();
            if (!(0, CollapsibleContainerNode_1.$isCollapsibleContainerNode)(parent)) {
                const children = node.getChildren();
                for (const child of children) {
                    node.insertBefore(child);
                }
                node.remove();
            }
        }), editor.registerNodeTransform(CollapsibleTitleNode_1.CollapsibleTitleNode, (node) => {
            const parent = node.getParent();
            if (!(0, CollapsibleContainerNode_1.$isCollapsibleContainerNode)(parent)) {
                node.replace((0, lexical_1.$createParagraphNode)().append(...node.getChildren()));
            }
        }), editor.registerNodeTransform(CollapsibleContainerNode_1.CollapsibleContainerNode, (node) => {
            const children = node.getChildren();
            if (children.length !== 2
                || !(0, CollapsibleTitleNode_1.$isCollapsibleTitleNode)(children[0])
                || !(0, CollapsibleContentNode_1.$isCollapsibleContentNode)(children[1])) {
                for (const child of children) {
                    node.insertBefore(child);
                }
                node.remove();
            }
        }), 
        // This handles the case when container is collapsed and we delete its previous sibling
        // into it, it would cause collapsed content deleted (since it's display: none, and selection
        // swallows it when deletes single char). Instead we expand container, which is although
        // not perfect, but avoids bigger problem
        editor.registerCommand(lexical_1.DELETE_CHARACTER_COMMAND, () => {
            const selection = (0, lexical_1.$getSelection)();
            if (!(0, lexical_1.$isRangeSelection)(selection)
                || !selection.isCollapsed()
                || selection.anchor.offset !== 0) {
                return false;
            }
            const anchorNode = selection.anchor.getNode();
            const topLevelElement = anchorNode.getTopLevelElement();
            if (topLevelElement === null) {
                return false;
            }
            const container = topLevelElement.getPreviousSibling();
            if (!(0, CollapsibleContainerNode_1.$isCollapsibleContainerNode)(container) || container.getOpen()) {
                return false;
            }
            container.setOpen(true);
            return true;
        }, lexical_1.COMMAND_PRIORITY_LOW), 
        // When collapsible is the last child pressing down arrow will insert paragraph
        // below it to allow adding more content. It's similar what $insertBlockNode
        // (mainly for decorators), except it'll always be possible to continue adding
        // new content even if trailing paragraph is accidentally deleted
        editor.registerCommand(lexical_1.KEY_ARROW_DOWN_COMMAND, () => {
            const selection = (0, lexical_1.$getSelection)();
            if (!(0, lexical_1.$isRangeSelection)(selection) || !selection.isCollapsed()) {
                return false;
            }
            const container = (0, utils_1.$findMatchingParent)(selection.anchor.getNode(), CollapsibleContainerNode_1.$isCollapsibleContainerNode);
            if (container === null) {
                return false;
            }
            const parent = container.getParent();
            if (parent !== null && parent.getLastChild() === container) {
                parent.append((0, lexical_1.$createParagraphNode)());
            }
            return false;
        }, lexical_1.COMMAND_PRIORITY_LOW), 
        // Handling CMD+Enter to toggle collapsible element collapsed state
        editor.registerCommand(lexical_1.INSERT_PARAGRAPH_COMMAND, () => {
            var _a;
            // @ts-ignore
            const windowEvent = (_a = editor._window) === null || _a === void 0 ? void 0 : _a.event;
            if (windowEvent
                && (windowEvent.ctrlKey || windowEvent.metaKey)
                && windowEvent.key === 'Enter') {
                const selection = (0, lexical_1.$getPreviousSelection)();
                if ((0, lexical_1.$isRangeSelection)(selection) && selection.isCollapsed()) {
                    const parent = (0, utils_1.$findMatchingParent)(selection.anchor.getNode(), (node) => (0, lexical_1.$isElementNode)(node) && !node.isInline());
                    if ((0, CollapsibleTitleNode_1.$isCollapsibleTitleNode)(parent)) {
                        const container = parent.getParent();
                        if ((0, CollapsibleContainerNode_1.$isCollapsibleContainerNode)(container)) {
                            container.toggleOpen();
                            (0, lexical_1.$setSelection)(selection.clone());
                            return true;
                        }
                    }
                }
            }
            return false;
        }, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(exports.INSERT_COLLAPSIBLE_COMMAND, () => {
            editor.update(() => {
                const selection = (0, lexical_1.$getSelection)();
                if (!(0, lexical_1.$isRangeSelection)(selection)) {
                    return;
                }
                const title = (0, CollapsibleTitleNode_1.$createCollapsibleTitleNode)();
                const content = (0, CollapsibleContentNode_1.$createCollapsibleContentNode)().append((0, lexical_1.$createParagraphNode)());
                const container = (0, CollapsibleContainerNode_1.$createCollapsibleContainerNode)().append(title, content);
                selection.insertNodes([container]);
                title.selectStart();
            });
            return true;
        }, lexical_1.COMMAND_PRIORITY_EDITOR), editor.registerCommand(exports.TOGGLE_COLLAPSIBLE_COMMAND, (key) => {
            editor.update(() => {
                const containerNode = (0, lexical_1.$getNodeByKey)(key);
                if ((0, CollapsibleContainerNode_1.$isCollapsibleContainerNode)(containerNode)) {
                    containerNode.toggleOpen();
                }
            });
            return true;
        }, lexical_1.COMMAND_PRIORITY_EDITOR));
    }, [editor]);
    return null;
}
exports.default = CollapsiblePlugin;
//# sourceMappingURL=index.js.map