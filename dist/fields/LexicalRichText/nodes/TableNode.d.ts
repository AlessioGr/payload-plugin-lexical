/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/// <reference types="react" />
import type { DOMConversionMap, DOMExportOutput, EditorConfig, LexicalEditor, LexicalNode, NodeKey, SerializedLexicalNode, Spread } from 'lexical';
import { DecoratorNode } from 'lexical';
export type Cell = {
    colSpan: number;
    json: string;
    type: 'normal' | 'header';
    id: string;
    width: number | null;
};
export type Row = {
    cells: Array<Cell>;
    height: null | number;
    id: string;
};
export type Rows = Array<Row>;
export declare const cellHTMLCache: Map<string, string>;
export declare const cellTextContentCache: Map<string, string>;
export declare function createUID(): string;
export declare function createRow(): Row;
export type SerializedTableNode = Spread<{
    rows: Rows;
}, SerializedLexicalNode>;
export declare function extractRowsFromHTML(tableElem: HTMLTableElement): Rows;
export declare function exportTableCellsToHTML(rows: Rows, rect?: {
    startX: number;
    endX: number;
    startY: number;
    endY: number;
}): HTMLElement;
export declare class TableNode extends DecoratorNode<JSX.Element> {
    __rows: Rows;
    static getType(): string;
    static clone(node: TableNode): TableNode;
    static importJSON(serializedNode: SerializedTableNode): TableNode;
    exportJSON(): SerializedTableNode;
    static importDOM(): DOMConversionMap | null;
    exportDOM(): DOMExportOutput;
    constructor(rows?: Rows, key?: NodeKey);
    createDOM(): HTMLElement;
    updateDOM(): false;
    mergeRows(startX: number, startY: number, mergeRows: Rows): void;
    updateCellJSON(x: number, y: number, json: string): void;
    updateCellType(x: number, y: number, type: 'header' | 'normal'): void;
    insertColumnAt(x: number): void;
    deleteColumnAt(x: number): void;
    addColumns(count: number): void;
    insertRowAt(y: number): void;
    deleteRowAt(y: number): void;
    addRows(count: number): void;
    updateColumnWidth(x: number, width: number): void;
    decorate(_: LexicalEditor, config: EditorConfig): JSX.Element;
    isInline(): false;
}
export declare function $isTableNode(node: LexicalNode | null | undefined): node is TableNode;
export declare function $createTableNode(rows: Rows): TableNode;
export declare function $createTableNodeWithDimensions(rowCount: number, columnCount: number, includeHeaders?: boolean): TableNode;
