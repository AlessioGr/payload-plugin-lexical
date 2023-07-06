/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { DOMConversionMap, DOMConversionOutput, DOMExportOutput, EditorConfig, ElementNode, LexicalNode, SerializedElementNode } from 'lexical';
type SerializedCollapsibleContentNode = SerializedElementNode;
export declare function convertCollapsibleContentElement(domNode: HTMLElement): DOMConversionOutput | null;
export declare class CollapsibleContentNode extends ElementNode {
    static getType(): string;
    static clone(node: CollapsibleContentNode): CollapsibleContentNode;
    createDOM(config: EditorConfig): HTMLElement;
    updateDOM(prevNode: CollapsibleContentNode, dom: HTMLElement): boolean;
    static importDOM(): DOMConversionMap | null;
    exportDOM(): DOMExportOutput;
    static importJSON(serializedNode: SerializedCollapsibleContentNode): CollapsibleContentNode;
    isShadowRoot(): boolean;
    exportJSON(): SerializedCollapsibleContentNode;
}
export declare function $createCollapsibleContentNode(): CollapsibleContentNode;
export declare function $isCollapsibleContentNode(node: LexicalNode | null | undefined): node is CollapsibleContentNode;
export {};
