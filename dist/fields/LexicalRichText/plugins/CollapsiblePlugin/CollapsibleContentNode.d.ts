/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { DOMConversionMap, EditorConfig, ElementNode, LexicalNode, SerializedElementNode, Spread } from 'lexical';
type SerializedCollapsibleContentNode = Spread<{
    type: 'collapsible-content';
    version: 1;
}, SerializedElementNode>;
export declare class CollapsibleContentNode extends ElementNode {
    static getType(): string;
    static clone(node: CollapsibleContentNode): CollapsibleContentNode;
    createDOM(config: EditorConfig): HTMLElement;
    updateDOM(prevNode: CollapsibleContentNode, dom: HTMLElement): boolean;
    static importDOM(): DOMConversionMap | null;
    static importJSON(serializedNode: SerializedCollapsibleContentNode): CollapsibleContentNode;
    isShadowRoot(): boolean;
    exportJSON(): SerializedCollapsibleContentNode;
}
export declare function $createCollapsibleContentNode(): CollapsibleContentNode;
export declare function $isCollapsibleContentNode(node: LexicalNode | null | undefined): node is CollapsibleContentNode;
export {};
