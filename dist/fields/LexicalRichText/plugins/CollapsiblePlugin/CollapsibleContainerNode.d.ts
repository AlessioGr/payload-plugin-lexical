/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { DOMConversionMap, EditorConfig, ElementNode, LexicalNode, NodeKey, SerializedElementNode, Spread } from 'lexical';
type SerializedCollapsibleContainerNode = Spread<{
    type: 'collapsible-container';
    version: 1;
}, SerializedElementNode>;
export declare class CollapsibleContainerNode extends ElementNode {
    __open: boolean;
    constructor(open: boolean, key?: NodeKey);
    static getType(): string;
    static clone(node: CollapsibleContainerNode): CollapsibleContainerNode;
    createDOM(config: EditorConfig): HTMLElement;
    updateDOM(prevNode: CollapsibleContainerNode, dom: HTMLDetailsElement): boolean;
    static importDOM(): DOMConversionMap | null;
    static importJSON(serializedNode: SerializedCollapsibleContainerNode): CollapsibleContainerNode;
    exportJSON(): SerializedCollapsibleContainerNode;
    setOpen(open: boolean): void;
    getOpen(): boolean;
    toggleOpen(): void;
}
export declare function $createCollapsibleContainerNode(): CollapsibleContainerNode;
export declare function $isCollapsibleContainerNode(node: LexicalNode | null | undefined): node is CollapsibleContainerNode;
export {};
