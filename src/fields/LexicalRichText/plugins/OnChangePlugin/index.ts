/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { deepEqual } from '../../../../tools/deepEqual';
import { type CommentStore } from '../../commenting';
import useLayoutEffect from '../../shared/useLayoutEffect';
import { useCommentsContext } from '../CommentPlugin';

import type { EditorState, LexicalEditor } from 'lexical';

export function OnChangePlugin({
  ignoreHistoryMergeTagChange = true,
  ignoreSelectionChange = false,
  onChange,
  value,
}: {
  ignoreHistoryMergeTagChange?: boolean;
  ignoreSelectionChange?: boolean;
  onChange: (
    editorState: EditorState,
    editor: LexicalEditor,
    tags: Set<string>,
    commentStore?: CommentStore
  ) => void;
  value: any;
}): null {
  const [editor] = useLexicalComposerContext();
  const commentsContext = useCommentsContext();

  useEffect(() => {
    const valueJson = value?.jsonContent;
    const editorState = editor.getEditorState();

    // In case the value is changed from outside (e.g. through some beforeChange hook in payload),
    // we need to update the lexical editor to reflect the new value.
    if (valueJson != null && !deepEqual(valueJson, editorState.toJSON())) {
      const editorState = editor.parseEditorState(valueJson);
      editor.setEditorState(editorState);
    }
  }, [value]);

  useLayoutEffect(() => {
    if (onChange != null) {
      return editor.registerUpdateListener(
        ({ editorState, dirtyElements, dirtyLeaves, prevEditorState, tags }) => {
          if (
            (ignoreSelectionChange && dirtyElements.size === 0 && dirtyLeaves.size === 0) ||
            (ignoreHistoryMergeTagChange && tags.has('history-merge')) ||
            prevEditorState.isEmpty()
          ) {
            return;
          }

          onChange(editorState, editor, tags, commentsContext.commentStore);
        }
      );
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
