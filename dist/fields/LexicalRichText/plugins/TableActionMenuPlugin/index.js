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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const table_1 = require("@lexical/table");
const lexical_1 = require("lexical");
const React = __importStar(require("react"));
const react_1 = require("react");
const react_dom_1 = require("react-dom");
const useLexicalEditable_1 = __importDefault(require("../../hooks/useLexicalEditable"));
function TableActionMenu({ onClose, tableCellNode: _tableCellNode, setIsMenuOpen, contextRef, }) {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const dropDownRef = (0, react_1.useRef)(null);
    const [tableCellNode, updateTableCellNode] = (0, react_1.useState)(_tableCellNode);
    const [selectionCounts, updateSelectionCounts] = (0, react_1.useState)({
        columns: 1,
        rows: 1,
    });
    (0, react_1.useEffect)(() => {
        return editor.registerMutationListener(table_1.TableCellNode, (nodeMutations) => {
            const nodeUpdated = nodeMutations.get(tableCellNode.getKey()) === 'updated';
            if (nodeUpdated) {
                editor.getEditorState().read(() => {
                    updateTableCellNode(tableCellNode.getLatest());
                });
            }
        });
    }, [editor, tableCellNode]);
    (0, react_1.useEffect)(() => {
        editor.getEditorState().read(() => {
            const selection = (0, lexical_1.$getSelection)();
            if ((0, lexical_1.DEPRECATED_$isGridSelection)(selection)) {
                const selectionShape = selection.getShape();
                updateSelectionCounts({
                    columns: selectionShape.toX - selectionShape.fromX + 1,
                    rows: selectionShape.toY - selectionShape.fromY + 1,
                });
            }
        });
    }, [editor]);
    (0, react_1.useEffect)(() => {
        const menuButtonElement = contextRef.current;
        const dropDownElement = dropDownRef.current;
        if (menuButtonElement != null && dropDownElement != null) {
            const menuButtonRect = menuButtonElement.getBoundingClientRect();
            dropDownElement.style.opacity = '1';
            dropDownElement.style.left = `${menuButtonRect.left + menuButtonRect.width + window.pageXOffset + 5}px`;
            dropDownElement.style.top = `${menuButtonRect.top + window.pageYOffset}px`;
        }
    }, [contextRef, dropDownRef]);
    (0, react_1.useEffect)(() => {
        function handleClickOutside(event) {
            if (dropDownRef.current != null
                && contextRef.current != null
                && !dropDownRef.current.contains(event.target)
                && !contextRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, [setIsMenuOpen, contextRef]);
    const clearTableSelection = (0, react_1.useCallback)(() => {
        editor.update(() => {
            if (tableCellNode.isAttached()) {
                const tableNode = (0, table_1.$getTableNodeFromLexicalNodeOrThrow)(tableCellNode);
                const tableElement = editor.getElementByKey(tableNode.getKey());
                if (!tableElement) {
                    throw new Error('Expected to find tableElement in DOM');
                }
                const tableSelection = (0, table_1.getTableSelectionFromTableElement)(tableElement);
                if (tableSelection !== null) {
                    tableSelection.clearHighlight();
                }
                tableNode.markDirty();
                updateTableCellNode(tableCellNode.getLatest());
            }
            const rootNode = (0, lexical_1.$getRoot)();
            rootNode.selectStart();
        });
    }, [editor, tableCellNode]);
    const insertTableRowAtSelection = (0, react_1.useCallback)((shouldInsertAfter) => {
        editor.update(() => {
            const selection = (0, lexical_1.$getSelection)();
            const tableNode = (0, table_1.$getTableNodeFromLexicalNodeOrThrow)(tableCellNode);
            let tableRowIndex;
            if ((0, lexical_1.DEPRECATED_$isGridSelection)(selection)) {
                const selectionShape = selection.getShape();
                tableRowIndex = shouldInsertAfter
                    ? selectionShape.toY
                    : selectionShape.fromY;
            }
            else {
                tableRowIndex = (0, table_1.$getTableRowIndexFromTableCellNode)(tableCellNode);
            }
            const grid = (0, table_1.$getElementGridForTableNode)(editor, tableNode);
            (0, table_1.$insertTableRow)(tableNode, tableRowIndex, shouldInsertAfter, selectionCounts.rows, grid);
            clearTableSelection();
            onClose();
        });
    }, [editor, tableCellNode, selectionCounts.rows, clearTableSelection, onClose]);
    const insertTableColumnAtSelection = (0, react_1.useCallback)((shouldInsertAfter) => {
        editor.update(() => {
            const selection = (0, lexical_1.$getSelection)();
            const tableNode = (0, table_1.$getTableNodeFromLexicalNodeOrThrow)(tableCellNode);
            let tableColumnIndex;
            if ((0, lexical_1.DEPRECATED_$isGridSelection)(selection)) {
                const selectionShape = selection.getShape();
                tableColumnIndex = shouldInsertAfter
                    ? selectionShape.toX
                    : selectionShape.fromX;
            }
            else {
                tableColumnIndex = (0, table_1.$getTableColumnIndexFromTableCellNode)(tableCellNode);
            }
            const grid = (0, table_1.$getElementGridForTableNode)(editor, tableNode);
            (0, table_1.$insertTableColumn)(tableNode, tableColumnIndex, shouldInsertAfter, selectionCounts.columns, grid);
            clearTableSelection();
            onClose();
        });
    }, [
        editor,
        tableCellNode,
        selectionCounts.columns,
        clearTableSelection,
        onClose,
    ]);
    const deleteTableRowAtSelection = (0, react_1.useCallback)(() => {
        editor.update(() => {
            const tableNode = (0, table_1.$getTableNodeFromLexicalNodeOrThrow)(tableCellNode);
            const tableRowIndex = (0, table_1.$getTableRowIndexFromTableCellNode)(tableCellNode);
            (0, table_1.$removeTableRowAtIndex)(tableNode, tableRowIndex);
            clearTableSelection();
            onClose();
        });
    }, [editor, tableCellNode, clearTableSelection, onClose]);
    const deleteTableAtSelection = (0, react_1.useCallback)(() => {
        editor.update(() => {
            const tableNode = (0, table_1.$getTableNodeFromLexicalNodeOrThrow)(tableCellNode);
            tableNode.remove();
            clearTableSelection();
            onClose();
        });
    }, [editor, tableCellNode, clearTableSelection, onClose]);
    const deleteTableColumnAtSelection = (0, react_1.useCallback)(() => {
        editor.update(() => {
            const tableNode = (0, table_1.$getTableNodeFromLexicalNodeOrThrow)(tableCellNode);
            const tableColumnIndex = (0, table_1.$getTableColumnIndexFromTableCellNode)(tableCellNode);
            (0, table_1.$deleteTableColumn)(tableNode, tableColumnIndex);
            clearTableSelection();
            onClose();
        });
    }, [editor, tableCellNode, clearTableSelection, onClose]);
    const toggleTableRowIsHeader = (0, react_1.useCallback)(() => {
        editor.update(() => {
            const tableNode = (0, table_1.$getTableNodeFromLexicalNodeOrThrow)(tableCellNode);
            const tableRowIndex = (0, table_1.$getTableRowIndexFromTableCellNode)(tableCellNode);
            const tableRows = tableNode.getChildren();
            if (tableRowIndex >= tableRows.length || tableRowIndex < 0) {
                throw new Error('Expected table cell to be inside of table row.');
            }
            const tableRow = tableRows[tableRowIndex];
            if (!(0, table_1.$isTableRowNode)(tableRow)) {
                throw new Error('Expected table row');
            }
            tableRow.getChildren().forEach((tableCell) => {
                if (!(0, table_1.$isTableCellNode)(tableCell)) {
                    throw new Error('Expected table cell');
                }
                tableCell.toggleHeaderStyle(table_1.TableCellHeaderStates.ROW);
            });
            clearTableSelection();
            onClose();
        });
    }, [editor, tableCellNode, clearTableSelection, onClose]);
    const toggleTableColumnIsHeader = (0, react_1.useCallback)(() => {
        editor.update(() => {
            const tableNode = (0, table_1.$getTableNodeFromLexicalNodeOrThrow)(tableCellNode);
            const tableColumnIndex = (0, table_1.$getTableColumnIndexFromTableCellNode)(tableCellNode);
            const tableRows = tableNode.getChildren();
            for (let r = 0; r < tableRows.length; r++) {
                const tableRow = tableRows[r];
                if (!(0, table_1.$isTableRowNode)(tableRow)) {
                    throw new Error('Expected table row');
                }
                const tableCells = tableRow.getChildren();
                if (tableColumnIndex >= tableCells.length || tableColumnIndex < 0) {
                    throw new Error('Expected table cell to be inside of table row.');
                }
                const tableCell = tableCells[tableColumnIndex];
                if (!(0, table_1.$isTableCellNode)(tableCell)) {
                    throw new Error('Expected table cell');
                }
                tableCell.toggleHeaderStyle(table_1.TableCellHeaderStates.COLUMN);
            }
            clearTableSelection();
            onClose();
        });
    }, [editor, tableCellNode, clearTableSelection, onClose]);
    return (0, react_dom_1.createPortal)(
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    React.createElement("div", { className: "dropdown", ref: dropDownRef, onClick: (e) => {
            e.stopPropagation();
        } },
        React.createElement("button", { className: "item", onClick: () => insertTableRowAtSelection(false) },
            React.createElement("span", { className: "text" },
                "Insert",
                ' ',
                selectionCounts.rows === 1 ? 'row' : `${selectionCounts.rows} rows`,
                ' ',
                "above")),
        React.createElement("button", { className: "item", onClick: () => insertTableRowAtSelection(true) },
            React.createElement("span", { className: "text" },
                "Insert",
                ' ',
                selectionCounts.rows === 1 ? 'row' : `${selectionCounts.rows} rows`,
                ' ',
                "below")),
        React.createElement("hr", null),
        React.createElement("button", { className: "item", onClick: () => insertTableColumnAtSelection(false) },
            React.createElement("span", { className: "text" },
                "Insert",
                ' ',
                selectionCounts.columns === 1
                    ? 'column'
                    : `${selectionCounts.columns} columns`,
                ' ',
                "left")),
        React.createElement("button", { className: "item", onClick: () => insertTableColumnAtSelection(true) },
            React.createElement("span", { className: "text" },
                "Insert",
                ' ',
                selectionCounts.columns === 1
                    ? 'column'
                    : `${selectionCounts.columns} columns`,
                ' ',
                "right")),
        React.createElement("hr", null),
        React.createElement("button", { className: "item", onClick: () => deleteTableColumnAtSelection() },
            React.createElement("span", { className: "text" }, "Delete column")),
        React.createElement("button", { className: "item", onClick: () => deleteTableRowAtSelection() },
            React.createElement("span", { className: "text" }, "Delete row")),
        React.createElement("button", { className: "item", onClick: () => deleteTableAtSelection() },
            React.createElement("span", { className: "text" }, "Delete table")),
        React.createElement("hr", null),
        React.createElement("button", { className: "item", onClick: () => toggleTableRowIsHeader() },
            React.createElement("span", { className: "text" },
                (tableCellNode.__headerState & table_1.TableCellHeaderStates.ROW)
                    === table_1.TableCellHeaderStates.ROW
                    ? 'Remove'
                    : 'Add',
                ' ',
                "row header")),
        React.createElement("button", { className: "item", onClick: () => toggleTableColumnIsHeader() },
            React.createElement("span", { className: "text" },
                (tableCellNode.__headerState & table_1.TableCellHeaderStates.COLUMN)
                    === table_1.TableCellHeaderStates.COLUMN
                    ? 'Remove'
                    : 'Add',
                ' ',
                "column header"))), document.body);
}
function TableCellActionMenuContainer({ anchorElem, }) {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const menuButtonRef = (0, react_1.useRef)(null);
    const menuRootRef = (0, react_1.useRef)(null);
    const [isMenuOpen, setIsMenuOpen] = (0, react_1.useState)(false);
    const [tableCellNode, setTableMenuCellNode] = (0, react_1.useState)(null);
    const moveMenu = (0, react_1.useCallback)(() => {
        const menu = menuButtonRef.current;
        const selection = (0, lexical_1.$getSelection)();
        const nativeSelection = window.getSelection();
        const { activeElement } = document;
        if (selection == null || menu == null) {
            setTableMenuCellNode(null);
            return;
        }
        const rootElement = editor.getRootElement();
        if ((0, lexical_1.$isRangeSelection)(selection)
            && rootElement !== null
            && nativeSelection !== null
            && rootElement.contains(nativeSelection.anchorNode)) {
            const tableCellNodeFromSelection = (0, table_1.$getTableCellNodeFromLexicalNode)(selection.anchor.getNode());
            if (tableCellNodeFromSelection == null) {
                setTableMenuCellNode(null);
                return;
            }
            const tableCellParentNodeDOM = editor.getElementByKey(tableCellNodeFromSelection.getKey());
            if (tableCellParentNodeDOM == null) {
                setTableMenuCellNode(null);
                return;
            }
            setTableMenuCellNode(tableCellNodeFromSelection);
        }
        else if (!activeElement) {
            setTableMenuCellNode(null);
        }
    }, [editor]);
    (0, react_1.useEffect)(() => {
        return editor.registerUpdateListener(() => {
            editor.getEditorState().read(() => {
                moveMenu();
            });
        });
    });
    (0, react_1.useEffect)(() => {
        const menuButtonDOM = menuButtonRef.current;
        if (menuButtonDOM != null && tableCellNode != null) {
            const tableCellNodeDOM = editor.getElementByKey(tableCellNode.getKey());
            if (tableCellNodeDOM != null) {
                const tableCellRect = tableCellNodeDOM.getBoundingClientRect();
                const menuRect = menuButtonDOM.getBoundingClientRect();
                const anchorRect = anchorElem.getBoundingClientRect();
                const top = tableCellRect.top - anchorRect.top + 4;
                const left = tableCellRect.right - menuRect.width - 10 - anchorRect.left;
                menuButtonDOM.style.opacity = '1';
                menuButtonDOM.style.transform = `translate(${left}px, ${top}px)`;
            }
            else {
                menuButtonDOM.style.opacity = '0';
                menuButtonDOM.style.transform = 'translate(-10000px, -10000px)';
            }
        }
    }, [menuButtonRef, tableCellNode, editor, anchorElem]);
    const prevTableCellDOM = (0, react_1.useRef)(tableCellNode);
    (0, react_1.useEffect)(() => {
        if (prevTableCellDOM.current !== tableCellNode) {
            setIsMenuOpen(false);
        }
        prevTableCellDOM.current = tableCellNode;
    }, [prevTableCellDOM, tableCellNode]);
    return (React.createElement("div", { className: "table-cell-action-button-container", ref: menuButtonRef }, tableCellNode != null && (React.createElement(React.Fragment, null,
        React.createElement("button", { className: "table-cell-action-button chevron-down", onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
            }, ref: menuRootRef },
            React.createElement("i", { className: "chevron-down" })),
        isMenuOpen && (React.createElement(TableActionMenu, { contextRef: menuRootRef, setIsMenuOpen: setIsMenuOpen, onClose: () => setIsMenuOpen(false), tableCellNode: tableCellNode }))))));
}
function TableActionMenuPlugin({ anchorElem = document.body, }) {
    const isEditable = (0, useLexicalEditable_1.default)();
    return (0, react_dom_1.createPortal)(isEditable ? (React.createElement(TableCellActionMenuContainer, { anchorElem: anchorElem })) : null, anchorElem);
}
exports.default = TableActionMenuPlugin;
