/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/// <reference types="react" />
import { EditorThemeClasses, NodeKey } from 'lexical';
import { Rows } from './TableNode';
export default function TableComponent({ nodeKey, rows: rawRows, theme, }: {
    nodeKey: NodeKey;
    rows: Rows;
    theme: EditorThemeClasses;
}): JSX.Element;
