/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/// <reference types="react" />
import { TypeaheadOption } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { EditorConfig } from '../../../../types';
/**
 * Used for / commands
 */
export declare class ComponentPickerOption extends TypeaheadOption {
    title: string;
    icon?: JSX.Element;
    keywords: Array<string>;
    keyboardShortcut?: string;
    onSelect: (queryString: string) => void;
    constructor(title: string, options: {
        icon?: JSX.Element;
        keywords?: Array<string>;
        keyboardShortcut?: string;
        onSelect: (queryString: string) => void;
    });
}
export default function ComponentPickerMenuPlugin(props: {
    editorConfig: EditorConfig;
}): JSX.Element;
