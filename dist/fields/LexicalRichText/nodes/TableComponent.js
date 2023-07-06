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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const clipboard_1 = require("@lexical/clipboard");
const html_1 = require("@lexical/html");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const LexicalNestedComposer_1 = require("@lexical/react/LexicalNestedComposer");
const useLexicalNodeSelection_1 = require("@lexical/react/useLexicalNodeSelection");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const React = __importStar(require("react"));
const react_dom_1 = require("react-dom");
const environment_1 = require("../shared/environment");
const TablePlugin_1 = require("../plugins/TablePlugin");
const TableNode_1 = require("./TableNode");
const NO_CELLS = [];
function $createSelectAll() {
    const sel = (0, lexical_1.$createRangeSelection)();
    sel.focus.set('root', (0, lexical_1.$getRoot)().getChildrenSize(), 'element');
    return sel;
}
function createEmptyParagraphHTML(theme) {
    return `<p class="${theme.paragraph}"><br></p>`;
}
function focusCell(tableElem, id) {
    const cellElem = tableElem.querySelector(`[data-id=${id}]`);
    if (cellElem == null) {
        return;
    }
    cellElem.focus();
}
function isStartingResize(target) {
    return target.nodeType === 1 && target.hasAttribute('data-table-resize');
}
function generateHTMLFromJSON(editorStateJSON, cellEditor) {
    const editorState = cellEditor.parseEditorState(editorStateJSON);
    let html = TableNode_1.cellHTMLCache.get(editorStateJSON);
    if (html === undefined) {
        html = editorState.read(() => (0, html_1.$generateHtmlFromNodes)(cellEditor, null));
        const textContent = editorState.read(() => (0, lexical_1.$getRoot)().getTextContent());
        TableNode_1.cellHTMLCache.set(editorStateJSON, html);
        TableNode_1.cellTextContentCache.set(editorStateJSON, textContent);
    }
    return html;
}
function getCurrentDocument(editor) {
    const rootElement = editor.getRootElement();
    return rootElement !== null ? rootElement.ownerDocument : document;
}
function isCopy(keyCode, shiftKey, metaKey, ctrlKey) {
    if (shiftKey) {
        return false;
    }
    if (keyCode === 67) {
        return environment_1.IS_APPLE ? metaKey : ctrlKey;
    }
    return false;
}
function isCut(keyCode, shiftKey, metaKey, ctrlKey) {
    if (shiftKey) {
        return false;
    }
    if (keyCode === 88) {
        return environment_1.IS_APPLE ? metaKey : ctrlKey;
    }
    return false;
}
function isPaste(keyCode, shiftKey, metaKey, ctrlKey) {
    if (shiftKey) {
        return false;
    }
    if (keyCode === 86) {
        return environment_1.IS_APPLE ? metaKey : ctrlKey;
    }
    return false;
}
function getCellID(domElement) {
    let node = domElement;
    while (node !== null) {
        const possibleID = node.getAttribute('data-id');
        if (possibleID != null) {
            return possibleID;
        }
        node = node.parentElement;
    }
    return null;
}
function getTableCellWidth(domElement) {
    let node = domElement;
    while (node !== null) {
        if (node.nodeName === 'TH' || node.nodeName === 'TD') {
            return node.getBoundingClientRect().width;
        }
        node = node.parentElement;
    }
    return 0;
}
function $updateCells(rows, ids, cellCoordMap, cellEditor, updateTableNode, fn) {
    for (const id of ids) {
        const cell = getCell(rows, id, cellCoordMap);
        if (cell !== null && cellEditor !== null) {
            const editorState = cellEditor.parseEditorState(cell.json);
            cellEditor._headless = true;
            cellEditor.setEditorState(editorState);
            cellEditor.update(fn, { discrete: true });
            cellEditor._headless = false;
            const newJSON = JSON.stringify(cellEditor.getEditorState());
            updateTableNode((tableNode) => {
                const [x, y] = cellCoordMap.get(id);
                (0, lexical_1.$addUpdateTag)('history-push');
                tableNode.updateCellJSON(x, y, newJSON);
            });
        }
    }
}
function isTargetOnPossibleUIControl(target) {
    let node = target;
    while (node !== null) {
        const { nodeName } = node;
        if (nodeName === 'BUTTON' ||
            nodeName === 'INPUT' ||
            nodeName === 'TEXTAREA') {
            return true;
        }
        node = node.parentElement;
    }
    return false;
}
function getSelectedRect(startID, endID, cellCoordMap) {
    const startCoords = cellCoordMap.get(startID);
    const endCoords = cellCoordMap.get(endID);
    if (startCoords === undefined || endCoords === undefined) {
        return null;
    }
    const startX = Math.min(startCoords[0], endCoords[0]);
    const endX = Math.max(startCoords[0], endCoords[0]);
    const startY = Math.min(startCoords[1], endCoords[1]);
    const endY = Math.max(startCoords[1], endCoords[1]);
    return {
        endX,
        endY,
        startX,
        startY,
    };
}
function getSelectedIDs(rows, startID, endID, cellCoordMap) {
    const rect = getSelectedRect(startID, endID, cellCoordMap);
    if (rect === null) {
        return [];
    }
    const { startX, endY, endX, startY } = rect;
    const ids = [];
    for (let x = startX; x <= endX; x++) {
        for (let y = startY; y <= endY; y++) {
            ids.push(rows[y].cells[x].id);
        }
    }
    return ids;
}
function extractCellsFromRows(rows, rect) {
    const { startX, endY, endX, startY } = rect;
    const newRows = [];
    for (let y = startY; y <= endY; y++) {
        const row = rows[y];
        const newRow = (0, TableNode_1.createRow)();
        for (let x = startX; x <= endX; x++) {
            const cellClone = Object.assign({}, row.cells[x]);
            cellClone.id = (0, TableNode_1.createUID)();
            newRow.cells.push(cellClone);
        }
        newRows.push(newRow);
    }
    return newRows;
}
function TableCellEditor({ cellEditor }) {
    const { cellEditorConfig, cellEditorPlugins } = (0, react_1.useContext)(TablePlugin_1.CellContext);
    if (cellEditorPlugins === null || cellEditorConfig === null) {
        return null;
    }
    return (React.createElement(LexicalNestedComposer_1.LexicalNestedComposer, { initialEditor: cellEditor, initialTheme: cellEditorConfig.theme, initialNodes: cellEditorConfig.nodes }, cellEditorPlugins));
}
function getCell(rows, cellID, cellCoordMap) {
    const coords = cellCoordMap.get(cellID);
    if (coords === undefined) {
        return null;
    }
    const [x, y] = coords;
    const row = rows[y];
    return row.cells[x];
}
function TableActionMenu({ cell, rows, cellCoordMap, menuElem, updateCellsByID, onClose, updateTableNode, setSortingOptions, sortingOptions, }) {
    const dropDownRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const dropdownElem = dropDownRef.current;
        if (dropdownElem !== null) {
            const rect = menuElem.getBoundingClientRect();
            dropdownElem.style.top = `${rect.y}px`;
            dropdownElem.style.left = `${rect.x}px`;
        }
    }, [menuElem]);
    (0, react_1.useEffect)(() => {
        const handleClickOutside = (event) => {
            const dropdownElem = dropDownRef.current;
            if (dropdownElem !== null &&
                !dropdownElem.contains(event.target)) {
                event.stopPropagation();
            }
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, [onClose]);
    const coords = cellCoordMap.get(cell.id);
    if (coords === undefined) {
        return null;
    }
    const [x, y] = coords;
    return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    React.createElement("div", { className: "dropdown", ref: dropDownRef, onPointerMove: (e) => {
            e.stopPropagation();
        }, onPointerDown: (e) => {
            e.stopPropagation();
        }, onPointerUp: (e) => {
            e.stopPropagation();
        }, onClick: (e) => {
            e.stopPropagation();
        } },
        React.createElement("button", { className: "item", onClick: (event) => {
                event.preventDefault();
                updateTableNode((tableNode) => {
                    (0, lexical_1.$addUpdateTag)('history-push');
                    tableNode.updateCellType(x, y, cell.type === 'normal' ? 'header' : 'normal');
                });
                onClose();
            } },
            React.createElement("span", { className: "text" }, cell.type === 'normal' ? 'Make header' : 'Remove header')),
        React.createElement("button", { className: "item", onClick: (event) => {
                event.preventDefault();
                updateCellsByID([cell.id], () => {
                    const root = (0, lexical_1.$getRoot)();
                    root.clear();
                    root.append((0, lexical_1.$createParagraphNode)());
                });
                onClose();
            } },
            React.createElement("span", { className: "text" }, "Clear cell")),
        React.createElement("hr", null),
        cell.type === 'header' && y === 0 && (React.createElement(React.Fragment, null,
            sortingOptions !== null && sortingOptions.x === x && (React.createElement("button", { className: "item", onClick: (event) => {
                    event.preventDefault();
                    setSortingOptions(null);
                    onClose();
                } },
                React.createElement("span", { className: "text" }, "Remove sorting"))),
            (sortingOptions === null ||
                sortingOptions.x !== x ||
                sortingOptions.type === 'descending') && (React.createElement("button", { className: "item", onClick: (event) => {
                    event.preventDefault();
                    setSortingOptions({ type: 'ascending', x });
                    onClose();
                } },
                React.createElement("span", { className: "text" }, "Sort ascending"))),
            (sortingOptions === null ||
                sortingOptions.x !== x ||
                sortingOptions.type === 'ascending') && (React.createElement("button", { className: "item", onClick: (event) => {
                    event.preventDefault();
                    setSortingOptions({ type: 'descending', x });
                    onClose();
                } },
                React.createElement("span", { className: "text" }, "Sort descending"))),
            React.createElement("hr", null))),
        React.createElement("button", { className: "item", onClick: (event) => {
                event.preventDefault();
                updateTableNode((tableNode) => {
                    (0, lexical_1.$addUpdateTag)('history-push');
                    tableNode.insertRowAt(y);
                });
                onClose();
            } },
            React.createElement("span", { className: "text" }, "Insert row above")),
        React.createElement("button", { className: "item", onClick: (event) => {
                event.preventDefault();
                updateTableNode((tableNode) => {
                    (0, lexical_1.$addUpdateTag)('history-push');
                    tableNode.insertRowAt(y + 1);
                });
                onClose();
            } },
            React.createElement("span", { className: "text" }, "Insert row below")),
        React.createElement("hr", null),
        React.createElement("button", { className: "item", onClick: (event) => {
                event.preventDefault();
                updateTableNode((tableNode) => {
                    (0, lexical_1.$addUpdateTag)('history-push');
                    tableNode.insertColumnAt(x);
                });
                onClose();
            } },
            React.createElement("span", { className: "text" }, "Insert column left")),
        React.createElement("button", { className: "item", onClick: (event) => {
                event.preventDefault();
                updateTableNode((tableNode) => {
                    (0, lexical_1.$addUpdateTag)('history-push');
                    tableNode.insertColumnAt(x + 1);
                });
                onClose();
            } },
            React.createElement("span", { className: "text" }, "Insert column right")),
        React.createElement("hr", null),
        rows[0].cells.length !== 1 && (React.createElement("button", { className: "item", onClick: (event) => {
                event.preventDefault();
                updateTableNode((tableNode) => {
                    (0, lexical_1.$addUpdateTag)('history-push');
                    tableNode.deleteColumnAt(x);
                });
                onClose();
            } },
            React.createElement("span", { className: "text" }, "Delete column"))),
        rows.length !== 1 && (React.createElement("button", { className: "item", onClick: (event) => {
                event.preventDefault();
                updateTableNode((tableNode) => {
                    (0, lexical_1.$addUpdateTag)('history-push');
                    tableNode.deleteRowAt(y);
                });
                onClose();
            } },
            React.createElement("span", { className: "text" }, "Delete row"))),
        React.createElement("button", { className: "item", onClick: (event) => {
                event.preventDefault();
                updateTableNode((tableNode) => {
                    (0, lexical_1.$addUpdateTag)('history-push');
                    tableNode.selectNext();
                    tableNode.remove();
                });
                onClose();
            } },
            React.createElement("span", { className: "text" }, "Delete table"))));
}
function TableCell({ cell, cellCoordMap, cellEditor, isEditing, isSelected, isPrimarySelected, theme, updateCellsByID, updateTableNode, rows, setSortingOptions, sortingOptions, }) {
    const [showMenu, setShowMenu] = (0, react_1.useState)(false);
    const menuRootRef = (0, react_1.useRef)(null);
    const isHeader = cell.type !== 'normal';
    const editorStateJSON = cell.json;
    const CellComponent = isHeader ? 'th' : 'td';
    const cellWidth = cell.width;
    const menuElem = menuRootRef.current;
    const coords = cellCoordMap.get(cell.id);
    const isSorted = sortingOptions !== null &&
        coords !== undefined &&
        coords[0] === sortingOptions.x &&
        coords[1] === 0;
    (0, react_1.useEffect)(() => {
        if (isEditing || !isPrimarySelected) {
            setShowMenu(false);
        }
    }, [isEditing, isPrimarySelected]);
    return (React.createElement(CellComponent, { className: `${theme.tableCell} ${isHeader ? theme.tableCellHeader : ''} ${isSelected ? theme.tableCellSelected : ''}`, "data-id": cell.id, tabIndex: -1, style: { width: cellWidth !== null ? cellWidth : undefined } },
        isPrimarySelected && (React.createElement("div", { className: `${theme.tableCellPrimarySelected} ${isEditing ? theme.tableCellEditing : ''}` })),
        isPrimarySelected && isEditing ? (React.createElement(TableCellEditor, { cellEditor: cellEditor })) : (React.createElement(React.Fragment, null,
            React.createElement("div", { dangerouslySetInnerHTML: {
                    __html: editorStateJSON === ''
                        ? createEmptyParagraphHTML(theme)
                        : generateHTMLFromJSON(editorStateJSON, cellEditor),
                } }),
            React.createElement("div", { className: theme.tableCellResizer, "data-table-resize": "true" }))),
        isPrimarySelected && !isEditing && (React.createElement("div", { className: theme.tableCellActionButtonContainer, ref: menuRootRef },
            React.createElement("button", { className: theme.tableCellActionButton, onClick: (e) => {
                    e.preventDefault();
                    setShowMenu(!showMenu);
                    e.stopPropagation();
                } },
                React.createElement("i", { className: "chevron-down" })))),
        showMenu &&
            menuElem !== null &&
            (0, react_dom_1.createPortal)(React.createElement(TableActionMenu, { cell: cell, menuElem: menuElem, updateCellsByID: updateCellsByID, onClose: () => setShowMenu(false), updateTableNode: updateTableNode, cellCoordMap: cellCoordMap, rows: rows, setSortingOptions: setSortingOptions, sortingOptions: sortingOptions }), document.body),
        isSorted && React.createElement("div", { className: theme.tableCellSortedIndicator })));
}
function TableComponent({ nodeKey, rows: rawRows, theme, }) {
    const [isSelected, setSelected, clearSelection] = (0, useLexicalNodeSelection_1.useLexicalNodeSelection)(nodeKey);
    const resizeMeasureRef = (0, react_1.useRef)({
        point: 0,
        size: 0,
    });
    const [sortingOptions, setSortingOptions] = (0, react_1.useState)(null);
    const addRowsRef = (0, react_1.useRef)(null);
    const lastCellIDRef = (0, react_1.useRef)(null);
    const tableResizerRulerRef = (0, react_1.useRef)(null);
    const { cellEditorConfig } = (0, react_1.useContext)(TablePlugin_1.CellContext);
    const [isEditing, setIsEditing] = (0, react_1.useState)(false);
    const [showAddColumns, setShowAddColumns] = (0, react_1.useState)(false);
    const [showAddRows, setShowAddRows] = (0, react_1.useState)(false);
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const mouseDownRef = (0, react_1.useRef)(false);
    const [resizingID, setResizingID] = (0, react_1.useState)(null);
    const tableRef = (0, react_1.useRef)(null);
    const cellCoordMap = (0, react_1.useMemo)(() => {
        const map = new Map();
        for (let y = 0; y < rawRows.length; y++) {
            const row = rawRows[y];
            const { cells } = row;
            for (let x = 0; x < cells.length; x++) {
                const cell = cells[x];
                map.set(cell.id, [x, y]);
            }
        }
        return map;
    }, [rawRows]);
    const rows = (0, react_1.useMemo)(() => {
        if (sortingOptions === null) {
            return rawRows;
        }
        const _rows = rawRows.slice(1);
        _rows.sort((a, b) => {
            const aCells = a.cells;
            const bCells = b.cells;
            const { x } = sortingOptions;
            const aContent = TableNode_1.cellTextContentCache.get(aCells[x].json) || '';
            const bContent = TableNode_1.cellTextContentCache.get(bCells[x].json) || '';
            if (aContent === '' || bContent === '') {
                return 1;
            }
            if (sortingOptions.type === 'ascending') {
                return aContent.localeCompare(bContent);
            }
            return bContent.localeCompare(aContent);
        });
        _rows.unshift(rawRows[0]);
        return _rows;
    }, [rawRows, sortingOptions]);
    const [primarySelectedCellID, setPrimarySelectedCellID] = (0, react_1.useState)(null);
    const cellEditor = (0, react_1.useMemo)(() => {
        if (cellEditorConfig === null) {
            return null;
        }
        const _cellEditor = (0, lexical_1.createEditor)({
            namespace: cellEditorConfig.namespace,
            nodes: cellEditorConfig.nodes,
            onError: (error) => cellEditorConfig.onError(error, _cellEditor),
            theme: cellEditorConfig.theme,
        });
        return _cellEditor;
    }, [cellEditorConfig]);
    const [selectedCellIDs, setSelectedCellIDs] = (0, react_1.useState)([]);
    const selectedCellSet = (0, react_1.useMemo)(() => new Set(selectedCellIDs), [selectedCellIDs]);
    (0, react_1.useEffect)(() => {
        const tableElem = tableRef.current;
        if (isSelected &&
            document.activeElement === document.body &&
            tableElem !== null) {
            tableElem.focus();
        }
    }, [isSelected]);
    const updateTableNode = (0, react_1.useCallback)((fn) => {
        editor.update(() => {
            const tableNode = (0, lexical_1.$getNodeByKey)(nodeKey);
            if ((0, TableNode_1.$isTableNode)(tableNode)) {
                fn(tableNode);
            }
        });
    }, [editor, nodeKey]);
    const addColumns = () => {
        updateTableNode((tableNode) => {
            (0, lexical_1.$addUpdateTag)('history-push');
            tableNode.addColumns(1);
        });
    };
    const addRows = () => {
        updateTableNode((tableNode) => {
            (0, lexical_1.$addUpdateTag)('history-push');
            tableNode.addRows(1);
        });
    };
    const modifySelectedCells = (0, react_1.useCallback)((x, y, extend) => {
        const { id } = rows[y].cells[x];
        lastCellIDRef.current = id;
        if (extend) {
            const selectedIDs = getSelectedIDs(rows, primarySelectedCellID, id, cellCoordMap);
            setSelectedCellIDs(selectedIDs);
        }
        else {
            setPrimarySelectedCellID(id);
            setSelectedCellIDs(NO_CELLS);
            focusCell(tableRef.current, id);
        }
    }, [cellCoordMap, primarySelectedCellID, rows]);
    const saveEditorToJSON = (0, react_1.useCallback)(() => {
        if (cellEditor !== null && primarySelectedCellID !== null) {
            const json = JSON.stringify(cellEditor.getEditorState());
            updateTableNode((tableNode) => {
                const coords = cellCoordMap.get(primarySelectedCellID);
                if (coords === undefined) {
                    return;
                }
                (0, lexical_1.$addUpdateTag)('history-push');
                const [x, y] = coords;
                tableNode.updateCellJSON(x, y, json);
            });
        }
    }, [cellCoordMap, cellEditor, primarySelectedCellID, updateTableNode]);
    const selectTable = (0, react_1.useCallback)(() => {
        setTimeout(() => {
            var _a;
            const parentRootElement = editor.getRootElement();
            if (parentRootElement !== null) {
                parentRootElement.focus({ preventScroll: true });
                (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.removeAllRanges();
            }
        }, 20);
    }, [editor]);
    (0, react_1.useEffect)(() => {
        const tableElem = tableRef.current;
        if (tableElem === null) {
            return;
        }
        const doc = getCurrentDocument(editor);
        const isAtEdgeOfTable = (event) => {
            const x = event.clientX - tableRect.x;
            const y = event.clientY - tableRect.y;
            return x < 5 || y < 5;
        };
        const handlePointerDown = (event) => {
            const possibleID = getCellID(event.target);
            if (possibleID !== null &&
                editor.isEditable() &&
                tableElem.contains(event.target)) {
                if (isAtEdgeOfTable(event)) {
                    setSelected(true);
                    setPrimarySelectedCellID(null);
                    selectTable();
                    return;
                }
                setSelected(false);
                if (isStartingResize(event.target)) {
                    setResizingID(possibleID);
                    tableElem.style.userSelect = 'none';
                    resizeMeasureRef.current = {
                        point: event.clientX,
                        size: getTableCellWidth(event.target),
                    };
                    return;
                }
                mouseDownRef.current = true;
                if (primarySelectedCellID !== possibleID) {
                    if (isEditing) {
                        saveEditorToJSON();
                    }
                    setPrimarySelectedCellID(possibleID);
                    setIsEditing(false);
                    lastCellIDRef.current = possibleID;
                }
                else {
                    lastCellIDRef.current = null;
                }
                setSelectedCellIDs(NO_CELLS);
            }
            else if (primarySelectedCellID !== null &&
                !isTargetOnPossibleUIControl(event.target)) {
                setSelected(false);
                mouseDownRef.current = false;
                if (isEditing) {
                    saveEditorToJSON();
                }
                setPrimarySelectedCellID(null);
                setSelectedCellIDs(NO_CELLS);
                setIsEditing(false);
                lastCellIDRef.current = null;
            }
        };
        const tableRect = tableElem.getBoundingClientRect();
        const handlePointerMove = (event) => {
            if (resizingID !== null) {
                const tableResizerRulerElem = tableResizerRulerRef.current;
                if (tableResizerRulerElem !== null) {
                    const { size, point } = resizeMeasureRef.current;
                    const diff = event.clientX - point;
                    const newWidth = size + diff;
                    let x = event.clientX - tableRect.x;
                    if (x < 10) {
                        x = 10;
                    }
                    else if (x > tableRect.width - 10) {
                        x = tableRect.width - 10;
                    }
                    else if (newWidth < 20) {
                        x = point - size + 20 - tableRect.x;
                    }
                    tableResizerRulerElem.style.left = `${x}px`;
                }
                return;
            }
            if (!isEditing) {
                const { clientX, clientY } = event;
                const { width, x, y, height } = tableRect;
                const isOnRightEdge = clientX > x + width * 0.9 &&
                    clientX < x + width + 40 &&
                    !mouseDownRef.current;
                setShowAddColumns(isOnRightEdge);
                const isOnBottomEdge = event.target === addRowsRef.current ||
                    (clientY > y + height * 0.85 &&
                        clientY < y + height + 5 &&
                        !mouseDownRef.current);
                setShowAddRows(isOnBottomEdge);
            }
            if (isEditing ||
                !mouseDownRef.current ||
                primarySelectedCellID === null) {
                return;
            }
            const possibleID = getCellID(event.target);
            if (possibleID !== null && possibleID !== lastCellIDRef.current) {
                if (selectedCellIDs.length === 0) {
                    tableElem.style.userSelect = 'none';
                }
                const selectedIDs = getSelectedIDs(rows, primarySelectedCellID, possibleID, cellCoordMap);
                if (selectedIDs.length === 1) {
                    setSelectedCellIDs(NO_CELLS);
                }
                else {
                    setSelectedCellIDs(selectedIDs);
                }
                lastCellIDRef.current = possibleID;
            }
        };
        const handlePointerUp = (event) => {
            var _a;
            if (resizingID !== null) {
                const { size, point } = resizeMeasureRef.current;
                const diff = event.clientX - point;
                let newWidth = size + diff;
                if (newWidth < 10) {
                    newWidth = 10;
                }
                updateTableNode((tableNode) => {
                    const [x] = cellCoordMap.get(resizingID);
                    (0, lexical_1.$addUpdateTag)('history-push');
                    tableNode.updateColumnWidth(x, newWidth);
                });
                setResizingID(null);
            }
            if (tableElem !== null &&
                selectedCellIDs.length > 1 &&
                mouseDownRef.current) {
                tableElem.style.userSelect = 'text';
                (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.removeAllRanges();
            }
            mouseDownRef.current = false;
        };
        doc.addEventListener('pointerdown', handlePointerDown);
        doc.addEventListener('pointermove', handlePointerMove);
        doc.addEventListener('pointerup', handlePointerUp);
        return () => {
            doc.removeEventListener('pointerdown', handlePointerDown);
            doc.removeEventListener('pointermove', handlePointerMove);
            doc.removeEventListener('pointerup', handlePointerUp);
        };
    }, [
        cellEditor,
        editor,
        isEditing,
        rows,
        saveEditorToJSON,
        primarySelectedCellID,
        selectedCellSet,
        selectedCellIDs,
        cellCoordMap,
        resizingID,
        updateTableNode,
        setSelected,
        selectTable,
    ]);
    (0, react_1.useEffect)(() => {
        if (!isEditing && primarySelectedCellID !== null) {
            const doc = getCurrentDocument(editor);
            const loadContentIntoCell = (cell) => {
                if (cell !== null && cellEditor !== null) {
                    const editorStateJSON = cell.json;
                    const editorState = cellEditor.parseEditorState(editorStateJSON);
                    cellEditor.setEditorState(editorState);
                }
            };
            const handleDblClick = (event) => {
                const possibleID = getCellID(event.target);
                if (possibleID === primarySelectedCellID && editor.isEditable()) {
                    const cell = getCell(rows, possibleID, cellCoordMap);
                    loadContentIntoCell(cell);
                    setIsEditing(true);
                    setSelectedCellIDs(NO_CELLS);
                }
            };
            const handleKeyDown = (event) => {
                // Ignore arrow keys, escape or tab
                const { keyCode } = event;
                if (keyCode === 16 ||
                    keyCode === 27 ||
                    keyCode === 9 ||
                    keyCode === 37 ||
                    keyCode === 38 ||
                    keyCode === 39 ||
                    keyCode === 40 ||
                    keyCode === 8 ||
                    keyCode === 46 ||
                    !editor.isEditable()) {
                    return;
                }
                if (keyCode === 13) {
                    event.preventDefault();
                }
                if (!isEditing &&
                    primarySelectedCellID !== null &&
                    editor.getEditorState().read(() => (0, lexical_1.$getSelection)() === null) &&
                    event.target.contentEditable !== 'true') {
                    if (isCopy(keyCode, event.shiftKey, event.metaKey, event.ctrlKey)) {
                        editor.dispatchCommand(lexical_1.COPY_COMMAND, event);
                        return;
                    }
                    if (isCut(keyCode, event.shiftKey, event.metaKey, event.ctrlKey)) {
                        editor.dispatchCommand(lexical_1.CUT_COMMAND, event);
                        return;
                    }
                    if (isPaste(keyCode, event.shiftKey, event.metaKey, event.ctrlKey)) {
                        editor.dispatchCommand(lexical_1.PASTE_COMMAND, event);
                        return;
                    }
                }
                if (event.metaKey || event.ctrlKey || event.altKey) {
                    return;
                }
                const cell = getCell(rows, primarySelectedCellID, cellCoordMap);
                loadContentIntoCell(cell);
                setIsEditing(true);
                setSelectedCellIDs(NO_CELLS);
            };
            doc.addEventListener('dblclick', handleDblClick);
            doc.addEventListener('keydown', handleKeyDown);
            return () => {
                doc.removeEventListener('dblclick', handleDblClick);
                doc.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [
        cellEditor,
        editor,
        isEditing,
        rows,
        primarySelectedCellID,
        cellCoordMap,
    ]);
    const updateCellsByID = (0, react_1.useCallback)((ids, fn) => {
        $updateCells(rows, ids, cellCoordMap, cellEditor, updateTableNode, fn);
    }, [cellCoordMap, cellEditor, rows, updateTableNode]);
    const clearCellsCommand = (0, react_1.useCallback)(() => {
        if (primarySelectedCellID !== null && !isEditing) {
            updateCellsByID([primarySelectedCellID, ...selectedCellIDs], () => {
                const root = (0, lexical_1.$getRoot)();
                root.clear();
                root.append((0, lexical_1.$createParagraphNode)());
            });
            return true;
        }
        if (isSelected) {
            updateTableNode((tableNode) => {
                (0, lexical_1.$addUpdateTag)('history-push');
                tableNode.selectNext();
                tableNode.remove();
            });
        }
        return false;
    }, [
        isEditing,
        isSelected,
        primarySelectedCellID,
        selectedCellIDs,
        updateCellsByID,
        updateTableNode,
    ]);
    (0, react_1.useEffect)(() => {
        const tableElem = tableRef.current;
        if (tableElem === null) {
            return;
        }
        const copyDataToClipboard = (event, htmlString, lexicalString, plainTextString) => {
            const clipboardData = event instanceof KeyboardEvent ? null : event.clipboardData;
            event.preventDefault();
            if (clipboardData != null) {
                clipboardData.setData('text/html', htmlString);
                clipboardData.setData('text/plain', plainTextString);
                clipboardData.setData('application/x-lexical-editor', lexicalString);
            }
            else {
                const { clipboard } = navigator;
                if (clipboard != null) {
                    // Most browsers only support a single item in the clipboard at one time.
                    // So we optimize by only putting in HTML.
                    const data = [
                        new ClipboardItem({
                            'text/html': new Blob([htmlString], {
                                type: 'text/html',
                            }),
                        }),
                    ];
                    clipboard.write(data);
                }
            }
        };
        const getTypeFromObject = (clipboardData, type) => __awaiter(this, void 0, void 0, function* () {
            try {
                return clipboardData instanceof DataTransfer
                    ? clipboardData.getData(type)
                    : clipboardData instanceof ClipboardItem
                        ? yield (yield clipboardData.getType(type)).text()
                        : '';
            }
            catch (_a) {
                return '';
            }
        });
        const pasteContent = (event) => __awaiter(this, void 0, void 0, function* () {
            let clipboardData = (event instanceof InputEvent ? null : event.clipboardData) || null;
            if (primarySelectedCellID !== null && cellEditor !== null) {
                event.preventDefault();
                if (clipboardData === null) {
                    try {
                        const items = yield navigator.clipboard.read();
                        clipboardData = items[0];
                    }
                    catch (_b) {
                        // NO-OP
                    }
                }
                const lexicalString = clipboardData !== null
                    ? yield getTypeFromObject(clipboardData, 'application/x-lexical-editor')
                    : '';
                if (lexicalString) {
                    try {
                        const payload = JSON.parse(lexicalString);
                        if (payload.namespace === editor._config.namespace &&
                            Array.isArray(payload.nodes)) {
                            $updateCells(rows, [primarySelectedCellID], cellCoordMap, cellEditor, updateTableNode, () => {
                                const root = (0, lexical_1.$getRoot)();
                                root.clear();
                                root.append((0, lexical_1.$createParagraphNode)());
                                root.selectEnd();
                                const nodes = (0, clipboard_1.$generateNodesFromSerializedNodes)(payload.nodes);
                                const sel = (0, lexical_1.$getSelection)();
                                if ((0, lexical_1.$isRangeSelection)(sel)) {
                                    (0, clipboard_1.$insertGeneratedNodes)(cellEditor, nodes, sel);
                                }
                            });
                            return;
                        }
                        // eslint-disable-next-line no-empty
                    }
                    catch (_c) { }
                }
                const htmlString = clipboardData !== null
                    ? yield getTypeFromObject(clipboardData, 'text/html')
                    : '';
                if (htmlString) {
                    try {
                        const parser = new DOMParser();
                        const dom = parser.parseFromString(htmlString, 'text/html');
                        const possibleTableElement = dom.querySelector('table');
                        if (possibleTableElement != null) {
                            const pasteRows = (0, TableNode_1.extractRowsFromHTML)(possibleTableElement);
                            updateTableNode((tableNode) => {
                                const [x, y] = cellCoordMap.get(primarySelectedCellID);
                                (0, lexical_1.$addUpdateTag)('history-push');
                                tableNode.mergeRows(x, y, pasteRows);
                            });
                            return;
                        }
                        $updateCells(rows, [primarySelectedCellID], cellCoordMap, cellEditor, updateTableNode, () => {
                            const root = (0, lexical_1.$getRoot)();
                            root.clear();
                            root.append((0, lexical_1.$createParagraphNode)());
                            root.selectEnd();
                            const nodes = (0, html_1.$generateNodesFromDOM)(editor, dom);
                            const sel = (0, lexical_1.$getSelection)();
                            if ((0, lexical_1.$isRangeSelection)(sel)) {
                                (0, clipboard_1.$insertGeneratedNodes)(cellEditor, nodes, sel);
                            }
                        });
                        return;
                        // eslint-disable-next-line no-empty
                    }
                    catch (_d) { }
                }
                // Multi-line plain text in rich text mode pasted as separate paragraphs
                // instead of single paragraph with linebreaks.
                const text = clipboardData !== null
                    ? yield getTypeFromObject(clipboardData, 'text/plain')
                    : '';
                if (text != null) {
                    $updateCells(rows, [primarySelectedCellID], cellCoordMap, cellEditor, updateTableNode, () => {
                        const root = (0, lexical_1.$getRoot)();
                        root.clear();
                        root.selectEnd();
                        const sel = (0, lexical_1.$getSelection)();
                        if (sel !== null) {
                            sel.insertRawText(text);
                        }
                    });
                }
            }
        });
        const copyPrimaryCell = (event) => {
            if (primarySelectedCellID !== null && cellEditor !== null) {
                const cell = getCell(rows, primarySelectedCellID, cellCoordMap);
                const { json } = cell;
                const htmlString = TableNode_1.cellHTMLCache.get(json) || null;
                if (htmlString === null) {
                    return;
                }
                const editorState = cellEditor.parseEditorState(json);
                const plainTextString = editorState.read(() => (0, lexical_1.$getRoot)().getTextContent());
                const lexicalString = editorState.read(() => {
                    return JSON.stringify((0, clipboard_1.$generateJSONFromSelectedNodes)(cellEditor, null));
                });
                copyDataToClipboard(event, htmlString, lexicalString, plainTextString);
            }
        };
        const copyCellRange = (event) => {
            const lastCellID = lastCellIDRef.current;
            if (primarySelectedCellID !== null &&
                cellEditor !== null &&
                lastCellID !== null) {
                const rect = getSelectedRect(primarySelectedCellID, lastCellID, cellCoordMap);
                if (rect === null) {
                    return;
                }
                const dom = (0, TableNode_1.exportTableCellsToHTML)(rows, rect);
                const htmlString = dom.outerHTML;
                const plainTextString = dom.outerText;
                const tableNodeJSON = editor.getEditorState().read(() => {
                    const tableNode = (0, lexical_1.$getNodeByKey)(nodeKey);
                    return tableNode.exportJSON();
                });
                tableNodeJSON.rows = extractCellsFromRows(rows, rect);
                const lexicalJSON = {
                    namespace: cellEditor._config.namespace,
                    nodes: [tableNodeJSON],
                };
                const lexicalString = JSON.stringify(lexicalJSON);
                copyDataToClipboard(event, htmlString, lexicalString, plainTextString);
            }
        };
        const handlePaste = (event, activeEditor) => {
            const selection = (0, lexical_1.$getSelection)();
            if (primarySelectedCellID !== null &&
                !isEditing &&
                selection === null &&
                activeEditor === editor) {
                pasteContent(event);
                mouseDownRef.current = false;
                setSelectedCellIDs(NO_CELLS);
                return true;
            }
            return false;
        };
        const handleCopy = (event, activeEditor) => {
            const selection = (0, lexical_1.$getSelection)();
            if (primarySelectedCellID !== null &&
                !isEditing &&
                selection === null &&
                activeEditor === editor) {
                if (selectedCellIDs.length === 0) {
                    copyPrimaryCell(event);
                }
                else {
                    copyCellRange(event);
                }
                return true;
            }
            return false;
        };
        return (0, utils_1.mergeRegister)(editor.registerCommand(lexical_1.CLICK_COMMAND, (payload) => {
            const selection = (0, lexical_1.$getSelection)();
            if ((0, lexical_1.$isNodeSelection)(selection)) {
                return true;
            }
            return false;
        }, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.PASTE_COMMAND, handlePaste, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.COPY_COMMAND, handleCopy, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.CUT_COMMAND, (event, activeEditor) => {
            if (handleCopy(event, activeEditor)) {
                clearCellsCommand();
                return true;
            }
            return false;
        }, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_BACKSPACE_COMMAND, clearCellsCommand, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_DELETE_COMMAND, clearCellsCommand, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.FORMAT_TEXT_COMMAND, (payload) => {
            if (primarySelectedCellID !== null && !isEditing) {
                $updateCells(rows, [primarySelectedCellID, ...selectedCellIDs], cellCoordMap, cellEditor, updateTableNode, () => {
                    const sel = $createSelectAll();
                    sel.formatText(payload);
                });
                return true;
            }
            return false;
        }, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_ENTER_COMMAND, (event, targetEditor) => {
            const selection = (0, lexical_1.$getSelection)();
            if (primarySelectedCellID === null &&
                !isEditing &&
                (0, lexical_1.$isNodeSelection)(selection) &&
                selection.has(nodeKey) &&
                selection.getNodes().length === 1 &&
                targetEditor === editor) {
                const firstCellID = rows[0].cells[0].id;
                setPrimarySelectedCellID(firstCellID);
                focusCell(tableElem, firstCellID);
                event.preventDefault();
                event.stopPropagation();
                clearSelection();
                return true;
            }
            return false;
        }, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_TAB_COMMAND, (event) => {
            const selection = (0, lexical_1.$getSelection)();
            if (!isEditing &&
                selection === null &&
                primarySelectedCellID !== null) {
                const isBackward = event.shiftKey;
                const [x, y] = cellCoordMap.get(primarySelectedCellID);
                event.preventDefault();
                let nextX = null;
                let nextY = null;
                if (x === 0 && isBackward) {
                    if (y !== 0) {
                        nextY = y - 1;
                        nextX = rows[nextY].cells.length - 1;
                    }
                }
                else if (x === rows[y].cells.length - 1 && !isBackward) {
                    if (y !== rows.length - 1) {
                        nextY = y + 1;
                        nextX = 0;
                    }
                }
                else if (!isBackward) {
                    nextX = x + 1;
                    nextY = y;
                }
                else {
                    nextX = x - 1;
                    nextY = y;
                }
                if (nextX !== null && nextY !== null) {
                    modifySelectedCells(nextX, nextY, false);
                    return true;
                }
            }
            return false;
        }, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_ARROW_UP_COMMAND, (event, targetEditor) => {
            const selection = (0, lexical_1.$getSelection)();
            if (!isEditing && selection === null) {
                const extend = event.shiftKey;
                const cellID = extend
                    ? lastCellIDRef.current || primarySelectedCellID
                    : primarySelectedCellID;
                if (cellID !== null) {
                    const [x, y] = cellCoordMap.get(cellID);
                    if (y !== 0) {
                        modifySelectedCells(x, y - 1, extend);
                        return true;
                    }
                }
            }
            if (!(0, lexical_1.$isRangeSelection)(selection) || targetEditor !== cellEditor) {
                return false;
            }
            if (selection.isCollapsed() &&
                selection.anchor
                    .getNode()
                    .getTopLevelElementOrThrow()
                    .getPreviousSibling() === null) {
                event.preventDefault();
                return true;
            }
            return false;
        }, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_ARROW_DOWN_COMMAND, (event, targetEditor) => {
            const selection = (0, lexical_1.$getSelection)();
            if (!isEditing && selection === null) {
                const extend = event.shiftKey;
                const cellID = extend
                    ? lastCellIDRef.current || primarySelectedCellID
                    : primarySelectedCellID;
                if (cellID !== null) {
                    const [x, y] = cellCoordMap.get(cellID);
                    if (y !== rows.length - 1) {
                        modifySelectedCells(x, y + 1, extend);
                        return true;
                    }
                }
            }
            if (!(0, lexical_1.$isRangeSelection)(selection) || targetEditor !== cellEditor) {
                return false;
            }
            if (selection.isCollapsed() &&
                selection.anchor
                    .getNode()
                    .getTopLevelElementOrThrow()
                    .getNextSibling() === null) {
                event.preventDefault();
                return true;
            }
            return false;
        }, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_ARROW_LEFT_COMMAND, (event, targetEditor) => {
            const selection = (0, lexical_1.$getSelection)();
            if (!isEditing && selection === null) {
                const extend = event.shiftKey;
                const cellID = extend
                    ? lastCellIDRef.current || primarySelectedCellID
                    : primarySelectedCellID;
                if (cellID !== null) {
                    const [x, y] = cellCoordMap.get(cellID);
                    if (x !== 0) {
                        modifySelectedCells(x - 1, y, extend);
                        return true;
                    }
                }
            }
            if (!(0, lexical_1.$isRangeSelection)(selection) || targetEditor !== cellEditor) {
                return false;
            }
            if (selection.isCollapsed() && selection.anchor.offset === 0) {
                event.preventDefault();
                return true;
            }
            return false;
        }, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_ARROW_RIGHT_COMMAND, (event, targetEditor) => {
            const selection = (0, lexical_1.$getSelection)();
            if (!isEditing && selection === null) {
                const extend = event.shiftKey;
                const cellID = extend
                    ? lastCellIDRef.current || primarySelectedCellID
                    : primarySelectedCellID;
                if (cellID !== null) {
                    const [x, y] = cellCoordMap.get(cellID);
                    if (x !== rows[y].cells.length - 1) {
                        modifySelectedCells(x + 1, y, extend);
                        return true;
                    }
                }
            }
            if (!(0, lexical_1.$isRangeSelection)(selection) || targetEditor !== cellEditor) {
                return false;
            }
            if (selection.isCollapsed()) {
                const { anchor } = selection;
                if ((anchor.type === 'text' &&
                    anchor.offset === anchor.getNode().getTextContentSize()) ||
                    (anchor.type === 'element' &&
                        anchor.offset === anchor.getNode().getChildrenSize())) {
                    event.preventDefault();
                    return true;
                }
            }
            return false;
        }, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_ESCAPE_COMMAND, (event, targetEditor) => {
            const selection = (0, lexical_1.$getSelection)();
            if (!isEditing && selection === null && targetEditor === editor) {
                setSelected(true);
                setPrimarySelectedCellID(null);
                selectTable();
                return true;
            }
            if (!(0, lexical_1.$isRangeSelection)(selection)) {
                return false;
            }
            if (isEditing) {
                saveEditorToJSON();
                setIsEditing(false);
                if (primarySelectedCellID !== null) {
                    setTimeout(() => {
                        focusCell(tableElem, primarySelectedCellID);
                    }, 20);
                }
                return true;
            }
            return false;
        }, lexical_1.COMMAND_PRIORITY_LOW));
    }, [
        cellCoordMap,
        cellEditor,
        clearCellsCommand,
        clearSelection,
        editor,
        isEditing,
        modifySelectedCells,
        nodeKey,
        primarySelectedCellID,
        rows,
        saveEditorToJSON,
        selectTable,
        selectedCellIDs,
        setSelected,
        updateTableNode,
    ]);
    if (cellEditor === null) {
        return;
    }
    return (React.createElement("div", { style: { position: 'relative' } },
        React.createElement("table", { className: `${theme.table} ${isSelected ? theme.tableSelected : ''}`, ref: tableRef, tabIndex: -1 },
            React.createElement("tbody", null, rows.map((row) => (React.createElement("tr", { key: row.id, className: theme.tableRow }, row.cells.map((cell) => {
                const { id } = cell;
                return (React.createElement(TableCell, { key: id, cell: cell, theme: theme, isSelected: selectedCellSet.has(id), isPrimarySelected: primarySelectedCellID === id, isEditing: isEditing, sortingOptions: sortingOptions, cellEditor: cellEditor, updateCellsByID: updateCellsByID, updateTableNode: updateTableNode, cellCoordMap: cellCoordMap, rows: rows, setSortingOptions: setSortingOptions }));
            })))))),
        showAddColumns && (React.createElement("button", { className: theme.tableAddColumns, onClick: addColumns })),
        showAddRows && (React.createElement("button", { className: theme.tableAddRows, onClick: addRows, ref: addRowsRef })),
        resizingID !== null && (React.createElement("div", { className: theme.tableResizeRuler, ref: tableResizerRulerRef }))));
}
exports.default = TableComponent;
//# sourceMappingURL=TableComponent.js.map