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
exports.TablePlugin = exports.InsertNewTableDialog = exports.InsertTableDialog = exports.TableContext = exports.CellContext = exports.INSERT_NEW_TABLE_COMMAND = void 0;
require("./modal.scss");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const table_1 = require("@lexical/table");
const lexical_1 = require("lexical");
const react_1 = require("react");
const React = __importStar(require("react"));
const invariant_1 = __importDefault(require("../../shared/invariant"));
const TableNode_1 = require("../../nodes/TableNode");
const Button_1 = __importDefault(require("payload/dist/admin/components/elements/Button"));
const Dialog_1 = require("../../ui/Dialog");
const TextInput_1 = __importDefault(require("../../ui/TextInput"));
const EditDepth_1 = require("payload/dist/admin/components/utilities/EditDepth");
const Drawer_1 = require("payload/dist/admin/components/elements/Drawer");
const modal_1 = require("@faceless-ui/modal");
const LexicalEditorComponent_1 = require("../../LexicalEditorComponent");
exports.INSERT_NEW_TABLE_COMMAND = (0, lexical_1.createCommand)('INSERT_NEW_TABLE_COMMAND');
exports.CellContext = (0, react_1.createContext)({
    cellEditorConfig: null,
    cellEditorPlugins: null,
    set: () => {
        // Empty
    },
});
function TableContext({ children }) {
    const [contextValue, setContextValue] = (0, react_1.useState)({
        cellEditorConfig: null,
        cellEditorPlugins: null,
    });
    return (React.createElement(exports.CellContext.Provider, { value: (0, react_1.useMemo)(() => ({
            cellEditorConfig: contextValue.cellEditorConfig,
            cellEditorPlugins: contextValue.cellEditorPlugins,
            set: (cellEditorConfig, cellEditorPlugins) => {
                setContextValue({ cellEditorConfig, cellEditorPlugins });
            },
        }), [contextValue.cellEditorConfig, contextValue.cellEditorPlugins]) }, children));
}
exports.TableContext = TableContext;
const baseClass = 'rich-text-table-modal';
function InsertTableDialog({}) {
    const { uuid } = (0, LexicalEditorComponent_1.useEditorConfigContext)();
    const editDepth = (0, EditDepth_1.useEditDepth)();
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [activeEditor, setActiveEditor] = (0, react_1.useState)(editor);
    const tableDrawerSlug = (0, Drawer_1.formatDrawerSlug)({
        slug: `lexicalRichText-add-table` + uuid,
        depth: editDepth,
    });
    const { toggleModal, closeModal } = (0, modal_1.useModal)();
    const [rows, setRows] = (0, react_1.useState)('5');
    const [columns, setColumns] = (0, react_1.useState)('5');
    const [isDisabled, setIsDisabled] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const row = Number(rows);
        const column = Number(columns);
        if (row && row > 0 && row <= 500 && column && column > 0 && column <= 50) {
            setIsDisabled(false);
        }
        else {
            setIsDisabled(true);
        }
    }, [rows, columns]);
    const onClick = () => {
        activeEditor.dispatchCommand(table_1.INSERT_TABLE_COMMAND, {
            columns,
            rows,
        });
        closeModal(tableDrawerSlug);
    };
    return (React.createElement(Drawer_1.Drawer, { slug: tableDrawerSlug, key: tableDrawerSlug, className: baseClass, title: "Add table" },
        React.createElement(React.Fragment, null,
            React.createElement(TextInput_1.default, { placeholder: '# of rows (1-500)', label: "Rows", onChange: setRows, value: rows, "data-test-id": "table-modal-rows", type: "number" }),
            React.createElement(TextInput_1.default, { placeholder: '# of columns (1-50)', label: "Columns", onChange: setColumns, value: columns, "data-test-id": "table-modal-columns", type: "number" }),
            React.createElement(Dialog_1.DialogActions, { "data-test-id": "table-model-confirm-insert" },
                React.createElement(Button_1.default, { disabled: isDisabled, onClick: onClick }, "Confirm")))));
}
exports.InsertTableDialog = InsertTableDialog;
function InsertNewTableDialog({}) {
    const { uuid } = (0, LexicalEditorComponent_1.useEditorConfigContext)();
    const editDepth = (0, EditDepth_1.useEditDepth)();
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [activeEditor, setActiveEditor] = (0, react_1.useState)(editor);
    const newTableDrawerSlug = (0, Drawer_1.formatDrawerSlug)({
        slug: `lexicalRichText-add-newtable` + uuid,
        depth: editDepth,
    });
    const { toggleModal, closeModal } = (0, modal_1.useModal)();
    const [rows, setRows] = (0, react_1.useState)('');
    const [columns, setColumns] = (0, react_1.useState)('');
    const [isDisabled, setIsDisabled] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const row = Number(rows);
        const column = Number(columns);
        if (row && row > 0 && row <= 500 && column && column > 0 && column <= 50) {
            setIsDisabled(false);
        }
        else {
            setIsDisabled(true);
        }
    }, [rows, columns]);
    const onClick = () => {
        activeEditor.dispatchCommand(exports.INSERT_NEW_TABLE_COMMAND, { columns, rows });
        closeModal(newTableDrawerSlug);
    };
    return (React.createElement(Drawer_1.Drawer, { slug: newTableDrawerSlug, key: newTableDrawerSlug, className: baseClass, title: "Add new table (Experimental)" },
        React.createElement(React.Fragment, null,
            React.createElement(TextInput_1.default, { placeholder: '# of rows (1-500)', label: "Rows", onChange: setRows, value: rows, "data-test-id": "table-modal-rows", type: "number" }),
            React.createElement(TextInput_1.default, { placeholder: '# of columns (1-50)', label: "Columns", onChange: setColumns, value: columns, "data-test-id": "table-modal-columns", type: "number" }),
            React.createElement(Dialog_1.DialogActions, { "data-test-id": "table-modal-confirm-insert" },
                React.createElement(Button_1.default, { disabled: isDisabled, onClick: onClick }, "Confirm")))));
}
exports.InsertNewTableDialog = InsertNewTableDialog;
function TablePlugin({ cellEditorConfig, children, }) {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const cellContext = (0, react_1.useContext)(exports.CellContext);
    (0, react_1.useEffect)(() => {
        if (!editor.hasNodes([TableNode_1.TableNode])) {
            (0, invariant_1.default)(false, 'TablePlugin: TableNode is not registered on editor');
        }
        cellContext.set(cellEditorConfig, children);
        return editor.registerCommand(exports.INSERT_NEW_TABLE_COMMAND, ({ columns, rows, includeHeaders }) => {
            const tableNode = (0, TableNode_1.$createTableNodeWithDimensions)(Number(rows), Number(columns), includeHeaders);
            (0, lexical_1.$insertNodes)([tableNode]);
            return true;
        }, lexical_1.COMMAND_PRIORITY_EDITOR);
    }, [cellContext, cellEditorConfig, children, editor]);
    return null;
}
exports.TablePlugin = TablePlugin;
//# sourceMappingURL=index.js.map