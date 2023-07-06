/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ReactNode } from 'react';
type Suggestion = null | string;
type PublishFn = (newSuggestion: Suggestion) => void;
type HookShape = [suggestion: Suggestion, setSuggestion: PublishFn];
export declare const SharedAutocompleteContext: ({ children, }: {
    children: ReactNode;
}) => JSX.Element;
export declare const useSharedAutocompleteContext: () => HookShape;
export {};
