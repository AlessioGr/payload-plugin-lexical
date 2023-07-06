/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { DOMConversionMap, DOMConversionOutput, DOMExportOutput, EditorConfig, ElementNode, LexicalEditor, LexicalNode, RangeSelection, SerializedElementNode } from 'lexical';
type SerializedCollapsibleTitleNode = SerializedElementNode;
export declare function convertSummaryElement(domNode: HTMLElement): DOMConversionOutput | null;
export declare class CollapsibleTitleNode extends ElementNode {
    static getType(): string;
    static clone(node: CollapsibleTitleNode): CollapsibleTitleNode;
    createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement;
    updateDOM(prevNode: CollapsibleTitleNode, dom: HTMLElement): boolean;
    static importDOM(): DOMConversionMap | null;
    static importJSON(serializedNode: SerializedCollapsibleTitleNode): CollapsibleTitleNode;
    exportDOM(): DOMExportOutput;
    exportJSON(): SerializedCollapsibleTitleNode;
    collapseAtStart(_selection: RangeSelection): boolean;
    insertNewAfter(_: RangeSelection, restoreSelection?: boolean): ElementNode;
}
export declare function $createCollapsibleTitleNode(): CollapsibleTitleNode;
export declare function $isCollapsibleTitleNode(node: LexicalNode | null | undefined): node is CollapsibleTitleNode;
export {};
