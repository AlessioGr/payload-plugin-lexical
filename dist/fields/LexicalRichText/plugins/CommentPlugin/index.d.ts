/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ReactNode } from 'react';
import type { LexicalCommand } from 'lexical';
import './index.scss';
import './modal.scss';
import { Comments, CommentStore } from '../../commenting';
export declare const INSERT_INLINE_COMMAND: LexicalCommand<void>;
export default function CommentPlugin({}: {}): JSX.Element;
type ContextShape = {
    commentStore?: CommentStore;
};
export declare const CommentsContext: ({ children, initialComments, }: {
    children: ReactNode;
    initialComments?: Comments;
}) => JSX.Element;
export declare const useCommentsContext: () => ContextShape;
export {};
