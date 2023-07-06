/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/// <reference types="react" />
import { NodeKey } from 'lexical';
type EquationComponentProps = {
    equation: string;
    inline: boolean;
    nodeKey: NodeKey;
};
export default function EquationComponent({ equation, inline, nodeKey, }: EquationComponentProps): JSX.Element;
export {};
