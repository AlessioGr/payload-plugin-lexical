/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { HistoryState } from '@lexical/react/LexicalHistoryPlugin';
import { ReactNode } from 'react';
type ContextShape = {
    historyState?: HistoryState;
};
export declare const SharedHistoryContext: ({ children, }: {
    children: ReactNode;
}) => JSX.Element;
export declare const useSharedHistoryContext: () => ContextShape;
export {};
