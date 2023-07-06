/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import * as React from 'react';
import { ReactNode } from 'react';
import { EditorConfig } from '../../types';
import { OnChangeProps } from './types';
import './index.scss';
export declare const LexicalEditorComponent: React.FC<OnChangeProps>;
type ContextShape = {
    editorConfig?: EditorConfig;
    uuid?: string;
};
export declare const EditorConfigContext: ({ children, editorConfig, }: {
    children: ReactNode;
    editorConfig: EditorConfig;
}) => JSX.Element;
export declare const useEditorConfigContext: () => ContextShape;
export {};
