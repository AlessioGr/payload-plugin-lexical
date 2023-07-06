/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { Klass, LexicalNode } from 'lexical';
import type { EditorConfig } from '../../../types';
declare function PlaygroundNodes(editorConfig: EditorConfig): Array<Klass<LexicalNode>>;
export default PlaygroundNodes;
