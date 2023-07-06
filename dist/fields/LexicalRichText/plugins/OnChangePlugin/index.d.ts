/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { EditorState, LexicalEditor } from 'lexical';
import { CommentStore } from '../../commenting';
export declare function OnChangePlugin({ ignoreHistoryMergeTagChange, ignoreSelectionChange, onChange, value, }: {
    ignoreHistoryMergeTagChange?: boolean;
    ignoreSelectionChange?: boolean;
    onChange: (editorState: EditorState, editor: LexicalEditor, tags: Set<string>, commentStore: CommentStore) => void;
    value: any;
}): null;
