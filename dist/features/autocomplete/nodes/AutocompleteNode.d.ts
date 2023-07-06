/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/// <reference types="react" />
import type { Spread } from 'lexical';
import { DecoratorNode, EditorConfig, NodeKey, SerializedLexicalNode } from 'lexical';
declare global {
    interface Navigator {
        userAgentData?: {
            mobile: boolean;
        };
    }
}
export type SerializedAutocompleteNode = Spread<{
    uuid: string;
}, SerializedLexicalNode>;
export declare class AutocompleteNode extends DecoratorNode<JSX.Element | null> {
    __uuid: string;
    static clone(node: AutocompleteNode): AutocompleteNode;
    static getType(): 'autocomplete';
    static importJSON(serializedNode: SerializedAutocompleteNode): AutocompleteNode;
    exportJSON(): SerializedAutocompleteNode;
    constructor(uuid: string, key?: NodeKey);
    updateDOM(prevNode: unknown, dom: HTMLElement, config: EditorConfig): boolean;
    createDOM(config: EditorConfig): HTMLElement;
    decorate(): JSX.Element | null;
}
export declare function $createAutocompleteNode(uuid: string): AutocompleteNode;
