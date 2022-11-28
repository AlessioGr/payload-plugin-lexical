/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { DOMConversionMap, EditorConfig, ElementNode, LexicalEditor, LexicalNode, RangeSelection, SerializedElementNode, Spread } from 'lexical';
type SerializedCollapsibleTitleNode = Spread<{
    type: 'collapsible-title';
    version: 1;
}, SerializedElementNode>;
export declare class CollapsibleTitleNode extends ElementNode {
    static getType(): string;
    static clone(node: CollapsibleTitleNode): CollapsibleTitleNode;
    createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement;
    updateDOM(prevNode: CollapsibleTitleNode, dom: HTMLElement): boolean;
    static importDOM(): DOMConversionMap | null;
    static importJSON(serializedNode: SerializedCollapsibleTitleNode): CollapsibleTitleNode;
    exportJSON(): SerializedCollapsibleTitleNode;
    collapseAtStart(_selection: RangeSelection): boolean;
    insertNewAfter(): ElementNode;
}
export declare function $createCollapsibleTitleNode(): CollapsibleTitleNode;
export declare function $isCollapsibleTitleNode(node: LexicalNode | null | undefined): node is CollapsibleTitleNode;
export {};
