/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ElementTransformer, TextMatchTransformer, Transformer } from '@lexical/markdown';
import { EditorConfig } from '../../../../types';
export declare const IMAGE: TextMatchTransformer;
export declare const TABLE: (editorConfig: EditorConfig) => ElementTransformer;
export declare const PLAYGROUND_TRANSFORMERS: (editorConfig: EditorConfig) => Array<Transformer>;
