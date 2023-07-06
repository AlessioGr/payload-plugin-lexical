"use strict";
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
require("./index.scss");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const useLexicalEditable_1 = __importDefault(require("@lexical/react/useLexicalEditable"));
const table_1 = require("@lexical/table");
const lexical_1 = require("lexical");
const React = __importStar(require("react"));
const react_1 = require("react");
const react_dom_1 = require("react-dom");
const MIN_ROW_HEIGHT = 33;
const MIN_COLUMN_WIDTH = 50;
function TableCellResizer({ editor }) {
    const targetRef = (0, react_1.useRef)(null);
    const resizerRef = (0, react_1.useRef)(null);
    const tableRectRef = (0, react_1.useRef)(null);
    const mouseStartPosRef = (0, react_1.useRef)(null);
    const [mouseCurrentPos, updateMouseCurrentPos] = (0, react_1.useState)(null);
    const [activeCell, updateActiveCell] = (0, react_1.useState)(null);
    const [isSelectingGrid, updateIsSelectingGrid] = (0, react_1.useState)(false);
    const [draggingDirection, updateDraggingDirection] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        return editor.registerCommand(lexical_1.SELECTION_CHANGE_COMMAND, (payload) => {
            const selection = (0, lexical_1.$getSelection)();
            const isGridSelection = (0, lexical_1.DEPRECATED_$isGridSelection)(selection);
            if (isSelectingGrid !== isGridSelection) {
                updateIsSelectingGrid(isGridSelection);
            }
            return false;
        }, lexical_1.COMMAND_PRIORITY_HIGH);
    });
    const resetState = (0, react_1.useCallback)(() => {
        updateActiveCell(null);
        targetRef.current = null;
        updateDraggingDirection(null);
        mouseStartPosRef.current = null;
        tableRectRef.current = null;
    }, []);
    (0, react_1.useEffect)(() => {
        const onMouseMove = (event) => {
            setTimeout(() => {
                const target = event.target;
                if (draggingDirection) {
                    updateMouseCurrentPos({
                        x: event.clientX,
                        y: event.clientY,
                    });
                    return;
                }
                if (resizerRef.current && resizerRef.current.contains(target)) {
                    return;
                }
                if (targetRef.current !== target) {
                    targetRef.current = target;
                    const cell = (0, table_1.getCellFromTarget)(target);
                    if (cell && activeCell !== cell) {
                        editor.update(() => {
                            const tableCellNode = (0, lexical_1.$getNearestNodeFromDOMNode)(cell.elem);
                            if (!tableCellNode) {
                                throw new Error('TableCellResizer: Table cell node not found.');
                            }
                            const tableNode = (0, table_1.$getTableNodeFromLexicalNodeOrThrow)(tableCellNode);
                            const tableElement = editor.getElementByKey(tableNode.getKey());
                            if (!tableElement) {
                                throw new Error('TableCellResizer: Table element not found.');
                            }
                            targetRef.current = target;
                            tableRectRef.current = tableElement.getBoundingClientRect();
                            updateActiveCell(cell);
                        });
                    }
                    else if (cell == null) {
                        resetState();
                    }
                }
            }, 0);
        };
        document.addEventListener('mousemove', onMouseMove);
        return () => {
            document.removeEventListener('mousemove', onMouseMove);
        };
    }, [activeCell, draggingDirection, editor, resetState]);
    const isHeightChanging = (direction) => {
        if (direction === 'bottom')
            return true;
        return false;
    };
    const updateRowHeight = (0, react_1.useCallback)((newHeight) => {
        if (!activeCell) {
            throw new Error('TableCellResizer: Expected active cell.');
        }
        editor.update(() => {
            const tableCellNode = (0, lexical_1.$getNearestNodeFromDOMNode)(activeCell.elem);
            if (!(0, table_1.$isTableCellNode)(tableCellNode)) {
                throw new Error('TableCellResizer: Table cell node not found.');
            }
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
            tableRow.setHeight(newHeight);
        });
    }, [activeCell, editor]);
    const updateColumnWidth = (0, react_1.useCallback)((newWidth) => {
        if (!activeCell) {
            throw new Error('TableCellResizer: Expected active cell.');
        }
        editor.update(() => {
            const tableCellNode = (0, lexical_1.$getNearestNodeFromDOMNode)(activeCell.elem);
            if (!(0, table_1.$isTableCellNode)(tableCellNode)) {
                throw new Error('TableCellResizer: Table cell node not found.');
            }
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
                tableCell.setWidth(newWidth);
            }
        });
    }, [activeCell, editor]);
    const toggleResize = (0, react_1.useCallback)((direction) => (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!activeCell) {
            throw new Error('TableCellResizer: Expected active cell.');
        }
        if (draggingDirection === direction && mouseStartPosRef.current) {
            const { x, y } = mouseStartPosRef.current;
            if (activeCell === null) {
                return;
            }
            const { height, width } = activeCell.elem.getBoundingClientRect();
            if (isHeightChanging(direction)) {
                const heightChange = Math.abs(event.clientY - y);
                const isShrinking = direction === 'bottom' && y > event.clientY;
                updateRowHeight(Math.max(isShrinking ? height - heightChange : heightChange + height, MIN_ROW_HEIGHT));
            }
            else {
                const widthChange = Math.abs(event.clientX - x);
                const isShrinking = direction === 'right' && x > event.clientX;
                updateColumnWidth(Math.max(isShrinking ? width - widthChange : widthChange + width, MIN_COLUMN_WIDTH));
            }
            resetState();
        }
        else {
            mouseStartPosRef.current = {
                x: event.clientX,
                y: event.clientY,
            };
            updateMouseCurrentPos(mouseStartPosRef.current);
            updateDraggingDirection(direction);
        }
    }, [
        activeCell,
        draggingDirection,
        resetState,
        updateColumnWidth,
        updateRowHeight,
    ]);
    const getResizers = (0, react_1.useCallback)(() => {
        if (activeCell) {
            const { height, width, top, left } = activeCell.elem.getBoundingClientRect();
            const styles = {
                bottom: {
                    backgroundColor: 'none',
                    cursor: 'row-resize',
                    height: '10px',
                    left: `${window.pageXOffset + left}px`,
                    top: `${window.pageYOffset + top + height}px`,
                    width: `${width}px`,
                },
                right: {
                    backgroundColor: 'none',
                    cursor: 'col-resize',
                    height: `${height}px`,
                    left: `${window.pageXOffset + left + width}px`,
                    top: `${window.pageYOffset + top}px`,
                    width: '10px',
                },
            };
            const tableRect = tableRectRef.current;
            if (draggingDirection && mouseCurrentPos && tableRect) {
                if (isHeightChanging(draggingDirection)) {
                    styles[draggingDirection].left = `${window.pageXOffset + tableRect.left}px`;
                    styles[draggingDirection].top = `${window.pageYOffset + mouseCurrentPos.y}px`;
                    styles[draggingDirection].height = '3px';
                    styles[draggingDirection].width = `${tableRect.width}px`;
                }
                else {
                    styles[draggingDirection].top = `${window.pageYOffset + tableRect.top}px`;
                    styles[draggingDirection].left = `${window.pageXOffset + mouseCurrentPos.x}px`;
                    styles[draggingDirection].width = '3px';
                    styles[draggingDirection].height = `${tableRect.height}px`;
                }
                styles[draggingDirection].backgroundColor = '#adf';
            }
            return styles;
        }
        return {
            bottom: null,
            left: null,
            right: null,
            top: null,
        };
    }, [activeCell, draggingDirection, mouseCurrentPos]);
    const resizerStyles = getResizers();
    return (React.createElement("div", { ref: resizerRef }, activeCell != null && !isSelectingGrid && (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "TableCellResizer__resizer TableCellResizer__ui", style: resizerStyles.right || undefined, onMouseDown: toggleResize('right'), onMouseUp: toggleResize('right') }),
        React.createElement("div", { className: "TableCellResizer__resizer TableCellResizer__ui", style: resizerStyles.bottom || undefined, onMouseDown: toggleResize('bottom'), onMouseUp: toggleResize('bottom') })))));
}
function TableCellResizerPlugin() {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const isEditable = (0, useLexicalEditable_1.default)();
    return (0, react_1.useMemo)(() => isEditable
        ? (0, react_dom_1.createPortal)(React.createElement(TableCellResizer, { editor: editor }), document.body)
        : null, [editor, isEditable]);
}
exports.default = TableCellResizerPlugin;
//# sourceMappingURL=index.js.map