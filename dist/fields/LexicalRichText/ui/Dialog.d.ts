/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import './Dialog.scss';
import { ReactNode } from 'react';
type Props = Readonly<{
    'data-test-id'?: string;
    children: ReactNode;
}>;
export declare function DialogButtonsList({ children }: Props): JSX.Element;
export declare function DialogActions({ 'data-test-id': dataTestId, children, }: Props): JSX.Element;
export {};
