/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {EditorState, LexicalEditor} from 'lexical';

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import useLayoutEffect from '../../shared/useLayoutEffect';
import { useCommentsContext } from '../CommentPlugin';
import { CommentStore } from '../../commenting';

export function OnChangePlugin({
  ignoreHistoryMergeTagChange = true,
  ignoreSelectionChange = false,
  onChange,
}: {
  ignoreHistoryMergeTagChange?: boolean;
  ignoreSelectionChange?: boolean;
  onChange: (editorState: EditorState, editor: LexicalEditor, tags: Set<string>, commentStore: CommentStore) => void;
}): null {
  const [editor] = useLexicalComposerContext();
  const commentsContext = useCommentsContext();


  useLayoutEffect(() => {
    if (onChange) {
      return editor.registerUpdateListener(
        ({editorState, dirtyElements, dirtyLeaves, prevEditorState, tags}) => {
          if (
            (ignoreSelectionChange &&
              dirtyElements.size === 0 &&
              dirtyLeaves.size === 0) ||
            (ignoreHistoryMergeTagChange && tags.has('history-merge')) ||
            prevEditorState.isEmpty()
          ) {
            return;
          }

          onChange(editorState, editor, tags, commentsContext.commentStore);
        },
      );
    }
  }, [commentsContext, commentsContext.commentStore, editor, ignoreHistoryMergeTagChange, ignoreSelectionChange, onChange]);

  return null;
}
