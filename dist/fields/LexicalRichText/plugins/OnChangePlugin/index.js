"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnChangePlugin = void 0;
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const react_1 = require("react");
const useLayoutEffect_1 = __importDefault(require("../../shared/useLayoutEffect"));
const CommentPlugin_1 = require("../CommentPlugin");
const deepEqual_1 = require("../../../../tools/deepEqual");
function OnChangePlugin({ ignoreHistoryMergeTagChange = true, ignoreSelectionChange = false, onChange, value, }) {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const commentsContext = (0, CommentPlugin_1.useCommentsContext)();
    (0, react_1.useEffect)(() => {
        const valueJson = value.jsonContent;
        const editorState = editor.getEditorState();
        // In case the value is changed from outside (e.g. through some beforeChange hook in payload),
        // we need to update the lexical editor to reflect the new value.
        if (!(0, deepEqual_1.deepEqual)(valueJson, editorState.toJSON())) {
            const editorState = editor.parseEditorState(valueJson);
            editor.setEditorState(editorState);
        }
        else {
        }
    }, [value]);
    (0, useLayoutEffect_1.default)(() => {
        if (onChange) {
            return editor.registerUpdateListener(({ editorState, dirtyElements, dirtyLeaves, prevEditorState, tags, }) => {
                if ((ignoreSelectionChange
                    && dirtyElements.size === 0
                    && dirtyLeaves.size === 0)
                    || (ignoreHistoryMergeTagChange && tags.has('history-merge'))
                    || prevEditorState.isEmpty()) {
                    return;
                }
                onChange(editorState, editor, tags, commentsContext.commentStore);
            });
        }
    }, [
        commentsContext,
        commentsContext.commentStore,
        editor,
        ignoreHistoryMergeTagChange,
        ignoreSelectionChange,
        onChange,
    ]);
    return null;
}
exports.OnChangePlugin = OnChangePlugin;
//# sourceMappingURL=index.js.map