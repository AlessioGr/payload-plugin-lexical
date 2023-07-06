"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$createTableNodeWithDimensions = exports.$createTableNode = exports.$isTableNode = exports.TableNode = exports.exportTableCellsToHTML = exports.extractRowsFromHTML = exports.createRow = exports.createUID = exports.cellTextContentCache = exports.cellHTMLCache = void 0;
const lexical_1 = require("lexical");
const React = __importStar(require("react"));
const react_1 = require("react");
exports.cellHTMLCache = new Map();
exports.cellTextContentCache = new Map();
const emptyEditorJSON = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';
const plainTextEditorJSON = (text) => text === ''
    ? emptyEditorJSON
    : `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":${text},"type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`;
const TableComponent = React.lazy(
// @ts-ignore
() => Promise.resolve().then(() => __importStar(require('./TableComponent'))));
function createUID() {
    return Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(0, 5);
}
exports.createUID = createUID;
function createCell(type) {
    return {
        colSpan: 1,
        id: createUID(),
        json: emptyEditorJSON,
        type,
        width: null,
    };
}
function createRow() {
    return {
        cells: [],
        height: null,
        id: createUID(),
    };
}
exports.createRow = createRow;
function extractRowsFromHTML(tableElem) {
    const rowElems = tableElem.querySelectorAll('tr');
    const rows = [];
    for (let y = 0; y < rowElems.length; y++) {
        const rowElem = rowElems[y];
        const cellElems = rowElem.querySelectorAll('td,th');
        if (!cellElems || cellElems.length === 0) {
            continue;
        }
        const cells = [];
        for (let x = 0; x < cellElems.length; x++) {
            const cellElem = cellElems[x];
            const isHeader = cellElem.nodeName === 'TH';
            const cell = createCell(isHeader ? 'header' : 'normal');
            cell.json = plainTextEditorJSON(JSON.stringify(cellElem.innerText.replace(/\n/g, ' ')));
            cells.push(cell);
        }
        const row = createRow();
        row.cells = cells;
        rows.push(row);
    }
    return rows;
}
exports.extractRowsFromHTML = extractRowsFromHTML;
function convertTableElement(domNode) {
    const rowElems = domNode.querySelectorAll('tr');
    if (!rowElems || rowElems.length === 0) {
        return null;
    }
    const rows = [];
    for (let y = 0; y < rowElems.length; y++) {
        const rowElem = rowElems[y];
        const cellElems = rowElem.querySelectorAll('td,th');
        if (!cellElems || cellElems.length === 0) {
            continue;
        }
        const cells = [];
        for (let x = 0; x < cellElems.length; x++) {
            const cellElem = cellElems[x];
            const isHeader = cellElem.nodeName === 'TH';
            const cell = createCell(isHeader ? 'header' : 'normal');
            cell.json = plainTextEditorJSON(JSON.stringify(cellElem.innerText.replace(/\n/g, ' ')));
            cells.push(cell);
        }
        const row = createRow();
        row.cells = cells;
        rows.push(row);
    }
    return { node: $createTableNode(rows) };
}
function exportTableCellsToHTML(rows, rect) {
    const table = document.createElement('table');
    const colGroup = document.createElement('colgroup');
    const tBody = document.createElement('tbody');
    const firstRow = rows[0];
    for (let x = rect != null ? rect.startX : 0; x < (rect != null ? rect.endX + 1 : firstRow.cells.length); x++) {
        const col = document.createElement('col');
        colGroup.append(col);
    }
    for (let y = rect != null ? rect.startY : 0; y < (rect != null ? rect.endY + 1 : rows.length); y++) {
        const row = rows[y];
        const cells = row.cells;
        const rowElem = document.createElement('tr');
        for (let x = rect != null ? rect.startX : 0; x < (rect != null ? rect.endX + 1 : cells.length); x++) {
            const cell = cells[x];
            const cellElem = document.createElement(cell.type === 'header' ? 'th' : 'td');
            cellElem.innerHTML = exports.cellHTMLCache.get(cell.json) || '';
            rowElem.appendChild(cellElem);
        }
        tBody.appendChild(rowElem);
    }
    table.appendChild(colGroup);
    table.appendChild(tBody);
    return table;
}
exports.exportTableCellsToHTML = exportTableCellsToHTML;
class TableNode extends lexical_1.DecoratorNode {
    static getType() {
        return 'tablesheet';
    }
    static clone(node) {
        return new TableNode(Array.from(node.__rows), node.__key);
    }
    static importJSON(serializedNode) {
        return $createTableNode(serializedNode.rows);
    }
    exportJSON() {
        return {
            rows: this.__rows,
            type: 'tablesheet',
            version: 1,
        };
    }
    static importDOM() {
        return {
            table: (_node) => ({
                conversion: convertTableElement,
                priority: 0,
            }),
        };
    }
    exportDOM() {
        return { element: exportTableCellsToHTML(this.__rows) };
    }
    constructor(rows, key) {
        super(key);
        this.__rows = rows || [];
    }
    createDOM() {
        return document.createElement('div');
    }
    updateDOM() {
        return false;
    }
    mergeRows(startX, startY, mergeRows) {
        const self = this.getWritable();
        const rows = self.__rows;
        const endY = Math.min(rows.length, startY + mergeRows.length);
        for (let y = startY; y < endY; y++) {
            const row = rows[y];
            const mergeRow = mergeRows[y - startY];
            const cells = row.cells;
            const cellsClone = Array.from(cells);
            const rowClone = Object.assign(Object.assign({}, row), { cells: cellsClone });
            const mergeCells = mergeRow.cells;
            const endX = Math.min(cells.length, startX + mergeCells.length);
            for (let x = startX; x < endX; x++) {
                const cell = cells[x];
                const mergeCell = mergeCells[x - startX];
                const cellClone = Object.assign(Object.assign({}, cell), { json: mergeCell.json, type: mergeCell.type });
                cellsClone[x] = cellClone;
            }
            rows[y] = rowClone;
        }
    }
    updateCellJSON(x, y, json) {
        const self = this.getWritable();
        const rows = self.__rows;
        const row = rows[y];
        const cells = row.cells;
        const cell = cells[x];
        const cellsClone = Array.from(cells);
        const cellClone = Object.assign(Object.assign({}, cell), { json });
        const rowClone = Object.assign(Object.assign({}, row), { cells: cellsClone });
        cellsClone[x] = cellClone;
        rows[y] = rowClone;
    }
    updateCellType(x, y, type) {
        const self = this.getWritable();
        const rows = self.__rows;
        const row = rows[y];
        const cells = row.cells;
        const cell = cells[x];
        const cellsClone = Array.from(cells);
        const cellClone = Object.assign(Object.assign({}, cell), { type });
        const rowClone = Object.assign(Object.assign({}, row), { cells: cellsClone });
        cellsClone[x] = cellClone;
        rows[y] = rowClone;
    }
    insertColumnAt(x) {
        const self = this.getWritable();
        const rows = self.__rows;
        for (let y = 0; y < rows.length; y++) {
            const row = rows[y];
            const cells = row.cells;
            const cellsClone = Array.from(cells);
            const rowClone = Object.assign(Object.assign({}, row), { cells: cellsClone });
            const type = (cells[x] || cells[x - 1]).type;
            cellsClone.splice(x, 0, createCell(type));
            rows[y] = rowClone;
        }
    }
    deleteColumnAt(x) {
        const self = this.getWritable();
        const rows = self.__rows;
        for (let y = 0; y < rows.length; y++) {
            const row = rows[y];
            const cells = row.cells;
            const cellsClone = Array.from(cells);
            const rowClone = Object.assign(Object.assign({}, row), { cells: cellsClone });
            cellsClone.splice(x, 1);
            rows[y] = rowClone;
        }
    }
    addColumns(count) {
        const self = this.getWritable();
        const rows = self.__rows;
        for (let y = 0; y < rows.length; y++) {
            const row = rows[y];
            const cells = row.cells;
            const cellsClone = Array.from(cells);
            const rowClone = Object.assign(Object.assign({}, row), { cells: cellsClone });
            const type = cells[cells.length - 1].type;
            for (let x = 0; x < count; x++) {
                cellsClone.push(createCell(type));
            }
            rows[y] = rowClone;
        }
    }
    insertRowAt(y) {
        const self = this.getWritable();
        const rows = self.__rows;
        const prevRow = rows[y] || rows[y - 1];
        const cellCount = prevRow.cells.length;
        const row = createRow();
        for (let x = 0; x < cellCount; x++) {
            const cell = createCell(prevRow.cells[x].type);
            row.cells.push(cell);
        }
        rows.splice(y, 0, row);
    }
    deleteRowAt(y) {
        const self = this.getWritable();
        const rows = self.__rows;
        rows.splice(y, 1);
    }
    addRows(count) {
        const self = this.getWritable();
        const rows = self.__rows;
        const prevRow = rows[rows.length - 1];
        const cellCount = prevRow.cells.length;
        for (let y = 0; y < count; y++) {
            const row = createRow();
            for (let x = 0; x < cellCount; x++) {
                const cell = createCell(prevRow.cells[x].type);
                row.cells.push(cell);
            }
            rows.push(row);
        }
    }
    updateColumnWidth(x, width) {
        const self = this.getWritable();
        const rows = self.__rows;
        for (let y = 0; y < rows.length; y++) {
            const row = rows[y];
            const cells = row.cells;
            const cellsClone = Array.from(cells);
            const rowClone = Object.assign(Object.assign({}, row), { cells: cellsClone });
            cellsClone[x].width = width;
            rows[y] = rowClone;
        }
    }
    decorate(_, config) {
        return (React.createElement(react_1.Suspense, null,
            React.createElement(TableComponent, { nodeKey: this.__key, theme: config.theme, rows: this.__rows })));
    }
    isInline() {
        return false;
    }
}
exports.TableNode = TableNode;
function $isTableNode(node) {
    return node instanceof TableNode;
}
exports.$isTableNode = $isTableNode;
function $createTableNode(rows) {
    return new TableNode(rows);
}
exports.$createTableNode = $createTableNode;
function $createTableNodeWithDimensions(rowCount, columnCount, includeHeaders = true) {
    const rows = [];
    for (let y = 0; y < columnCount; y++) {
        const row = createRow();
        rows.push(row);
        for (let x = 0; x < rowCount; x++) {
            row.cells.push(createCell(includeHeaders === true && (y === 0 || x === 0) ? 'header' : 'normal'));
        }
    }
    return new TableNode(rows);
}
exports.$createTableNodeWithDimensions = $createTableNodeWithDimensions;
//# sourceMappingURL=TableNode.js.map