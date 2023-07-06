/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/// <reference types="react" />
import 'katex/dist/katex.css';
import './modal.scss';
import './index.scss';
import { LexicalCommand } from 'lexical';
import { EditorConfig } from '../../../types';
type CommandPayload = {
    equation: string;
    inline: boolean;
};
export declare const INSERT_EQUATION_COMMAND: LexicalCommand<CommandPayload>;
export declare function InsertEquationDrawer(props: {
    editorConfig: EditorConfig;
}): JSX.Element;
export default function EquationsPlugin(): JSX.Element | null;
export {};
