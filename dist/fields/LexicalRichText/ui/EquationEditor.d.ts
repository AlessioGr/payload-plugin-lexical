/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/// <reference types="react" />
import './EquationEditor.scss';
type BaseEquationEditorProps = {
    equation: string;
    inline: boolean;
    inputRef: {
        current: null | HTMLInputElement | HTMLTextAreaElement;
    };
    setEquation: (equation: string) => void;
};
export default function EquationEditor({ equation, setEquation, inline, inputRef, }: BaseEquationEditorProps): JSX.Element;
export {};
