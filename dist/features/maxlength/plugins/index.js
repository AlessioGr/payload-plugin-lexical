"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxLengthPlugin = void 0;
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const selection_1 = require("@lexical/selection");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
function MaxLengthPlugin({ maxLength }) {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => {
        let lastRestoredEditorState = null;
        return editor.registerNodeTransform(lexical_1.RootNode, (rootNode) => {
            const selection = (0, lexical_1.$getSelection)();
            if (!(0, lexical_1.$isRangeSelection)(selection) || !selection.isCollapsed()) {
                return;
            }
            const prevEditorState = editor.getEditorState();
            const prevTextContentSize = prevEditorState.read(() => rootNode.getTextContentSize());
            const textContentSize = rootNode.getTextContentSize();
            if (prevTextContentSize !== textContentSize) {
                const delCount = textContentSize - maxLength;
                const { anchor } = selection;
                if (delCount > 0) {
                    // Restore the old editor state instead if the last
                    // text content was already at the limit.
                    if (prevTextContentSize === maxLength &&
                        lastRestoredEditorState !== prevEditorState) {
                        lastRestoredEditorState = prevEditorState;
                        (0, utils_1.$restoreEditorState)(editor, prevEditorState);
                    }
                    else {
                        (0, selection_1.trimTextContentFromAnchor)(editor, anchor, delCount);
                    }
                }
            }
        });
    }, [editor, maxLength]);
    return null;
}
exports.MaxLengthPlugin = MaxLengthPlugin;
//# sourceMappingURL=index.js.map