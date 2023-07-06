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
exports.ComponentPickerOption = void 0;
const code_1 = require("@lexical/code");
const list_1 = require("@lexical/list");
const LexicalAutoEmbedPlugin_1 = require("@lexical/react/LexicalAutoEmbedPlugin");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const LexicalTypeaheadMenuPlugin_1 = require("@lexical/react/LexicalTypeaheadMenuPlugin");
const rich_text_1 = require("@lexical/rich-text");
const selection_1 = require("@lexical/selection");
const table_1 = require("@lexical/table");
const lexical_1 = require("lexical");
const react_1 = require("react");
const React = __importStar(require("react"));
const ReactDOM = __importStar(require("react-dom"));
const AutoEmbedPlugin_1 = require("../AutoEmbedPlugin");
const ModalPlugin_1 = require("../ModalPlugin");
/**
 * Used for / commands
 */
class ComponentPickerOption extends LexicalTypeaheadMenuPlugin_1.TypeaheadOption {
    constructor(title, options) {
        super(title);
        this.title = title;
        this.keywords = options.keywords || [];
        this.icon = options.icon;
        this.keyboardShortcut = options.keyboardShortcut;
        this.onSelect = options.onSelect.bind(this);
    }
}
exports.ComponentPickerOption = ComponentPickerOption;
function ComponentPickerMenuItem({ index, isSelected, onClick, onMouseEnter, option, }) {
    let className = 'item';
    if (isSelected) {
        className += ' selected';
    }
    return (React.createElement("li", { key: option.key, tabIndex: -1, className: className, ref: option.setRefElement, role: "option", "aria-selected": isSelected, id: `typeahead-item-${index}`, onMouseEnter: onMouseEnter, onClick: onClick },
        option.icon,
        React.createElement("span", { className: "text" }, option.title)));
}
function ComponentPickerMenuPlugin(props) {
    const editorConfig = props.editorConfig;
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [queryString, setQueryString] = (0, react_1.useState)(null);
    const checkForTriggerMatch = (0, LexicalTypeaheadMenuPlugin_1.useBasicTypeaheadTriggerMatch)('/', {
        minLength: 0,
    });
    const getDynamicOptions = (0, react_1.useCallback)(() => {
        const options = [];
        if (queryString == null) {
            return options;
        }
        if (!editorConfig.toggles.tables.enabled ||
            !editorConfig.toggles.tables.display) {
            return options;
        }
        const fullTableRegex = new RegExp(/^([1-9]|10)x([1-9]|10)$/);
        const partialTableRegex = new RegExp(/^([1-9]|10)x?$/);
        const fullTableMatch = fullTableRegex.exec(queryString);
        const partialTableMatch = partialTableRegex.exec(queryString);
        if (fullTableMatch) {
            const [rows, columns] = fullTableMatch[0]
                .split('x')
                .map((n) => parseInt(n, 10));
            options.push(new ComponentPickerOption(`${rows}x${columns} Table`, {
                icon: React.createElement("i", { className: "icon table" }),
                keywords: ['table'],
                onSelect: () => 
                // @ts-ignore Correct types, but since they're dynamic TS doesn't like it.
                editor.dispatchCommand(table_1.INSERT_TABLE_COMMAND, { columns, rows }),
            }));
        }
        else if (partialTableMatch) {
            const rows = parseInt(partialTableMatch[0], 10);
            options.push(...Array.from({ length: 5 }, (_, i) => i + 1).map((columns) => new ComponentPickerOption(`${rows}x${columns} Table`, {
                icon: React.createElement("i", { className: "icon table" }),
                keywords: ['table'],
                onSelect: () => 
                // @ts-ignore Correct types, but since they're dynamic TS doesn't like it.
                editor.dispatchCommand(table_1.INSERT_TABLE_COMMAND, { columns, rows }),
            })));
        }
        return options;
    }, [editor, queryString]);
    const options = (0, react_1.useMemo)(() => {
        // @ts-ignore
        // @ts-ignore
        const baseOptions = [];
        baseOptions.push(new ComponentPickerOption('Paragraph', {
            icon: React.createElement("i", { className: "icon paragraph" }),
            keywords: ['normal', 'paragraph', 'p', 'text'],
            onSelect: () => editor.update(() => {
                const selection = (0, lexical_1.$getSelection)();
                if ((0, lexical_1.$isRangeSelection)(selection)) {
                    (0, selection_1.$setBlocksType)(selection, () => (0, lexical_1.$createParagraphNode)());
                }
            }),
        }));
        baseOptions.push(...Array.from({ length: 3 }, (_, i) => i + 1).map((n) => new ComponentPickerOption(`Heading ${n}`, {
            icon: React.createElement("i", { className: `icon h${n}` }),
            keywords: ['heading', 'header', `h${n}`],
            onSelect: () => editor.update(() => {
                const selection = (0, lexical_1.$getSelection)();
                if ((0, lexical_1.$isRangeSelection)(selection)) {
                    (0, selection_1.$setBlocksType)(selection, () => 
                    // @ts-ignore Correct types, but since they're dynamic TS doesn't like it.
                    (0, rich_text_1.$createHeadingNode)(`h${n}`));
                }
            }),
        })));
        if (editorConfig.toggles.tables.enabled &&
            editorConfig.toggles.tables.display) {
            baseOptions.push(new ComponentPickerOption('Table', {
                icon: React.createElement("i", { className: "icon table" }),
                keywords: ['table', 'grid', 'spreadsheet', 'rows', 'columns'],
                onSelect: () => editor.dispatchCommand(ModalPlugin_1.OPEN_MODAL_COMMAND, 'table'),
            }));
            baseOptions.push(new ComponentPickerOption('Table (Experimental)', {
                icon: React.createElement("i", { className: "icon table" }),
                keywords: ['table', 'grid', 'spreadsheet', 'rows', 'columns'],
                onSelect: () => editor.dispatchCommand(ModalPlugin_1.OPEN_MODAL_COMMAND, 'newtable'),
            }));
        }
        baseOptions.push(new ComponentPickerOption('Numbered List', {
            icon: React.createElement("i", { className: "icon number" }),
            keywords: ['numbered list', 'ordered list', 'ol'],
            onSelect: () => editor.dispatchCommand(list_1.INSERT_ORDERED_LIST_COMMAND, undefined),
        }));
        baseOptions.push(new ComponentPickerOption('Bulleted List', {
            icon: React.createElement("i", { className: "icon bullet" }),
            keywords: ['bulleted list', 'unordered list', 'ul'],
            onSelect: () => editor.dispatchCommand(list_1.INSERT_UNORDERED_LIST_COMMAND, undefined),
        }));
        baseOptions.push(new ComponentPickerOption('Check List', {
            icon: React.createElement("i", { className: "icon check" }),
            keywords: ['check list', 'todo list'],
            onSelect: () => editor.dispatchCommand(list_1.INSERT_CHECK_LIST_COMMAND, undefined),
        }));
        baseOptions.push(new ComponentPickerOption('Quote', {
            icon: React.createElement("i", { className: "icon quote" }),
            keywords: ['block quote'],
            onSelect: () => editor.update(() => {
                const selection = (0, lexical_1.$getSelection)();
                if ((0, lexical_1.$isRangeSelection)(selection)) {
                    (0, selection_1.$setBlocksType)(selection, () => (0, rich_text_1.$createQuoteNode)());
                }
            }),
        }));
        baseOptions.push(new ComponentPickerOption('Code', {
            icon: React.createElement("i", { className: "icon code" }),
            keywords: ['javascript', 'python', 'js', 'codeblock'],
            onSelect: () => editor.update(() => {
                const selection = (0, lexical_1.$getSelection)();
                if ((0, lexical_1.$isRangeSelection)(selection)) {
                    if (selection.isCollapsed()) {
                        (0, selection_1.$setBlocksType)(selection, () => (0, code_1.$createCodeNode)());
                    }
                    else {
                        // Will this ever happen?
                        const textContent = selection.getTextContent();
                        const codeNode = (0, code_1.$createCodeNode)();
                        selection.insertNodes([codeNode]);
                        selection.insertRawText(textContent);
                    }
                }
            }),
        }));
        baseOptions.push(...(0, AutoEmbedPlugin_1.getEmbedConfigs)(editorConfig).map((embedConfig) => new ComponentPickerOption(`Embed ${embedConfig.contentName}`, {
            icon: embedConfig.icon,
            keywords: [...embedConfig.keywords, 'embed'],
            onSelect: () => editor.dispatchCommand(LexicalAutoEmbedPlugin_1.INSERT_EMBED_COMMAND, embedConfig.type),
        })));
        if (editorConfig.toggles.upload.enabled &&
            editorConfig.toggles.upload.display) {
            baseOptions.push(new ComponentPickerOption('Upload', {
                icon: React.createElement("i", { className: "icon image" }),
                keywords: ['image', 'photo', 'picture', 'file', 'upload'],
                onSelect: () => {
                    editor.dispatchCommand(ModalPlugin_1.OPEN_MODAL_COMMAND, 'upload');
                },
            }));
        }
        if (editorConfig.toggles.align.enabled &&
            editorConfig.toggles.align.display) {
            baseOptions.push(...['left', 'center', 'right', 'justify'].map((alignment) => new ComponentPickerOption(`Align ${alignment}`, {
                icon: React.createElement("i", { className: `icon ${alignment}-align` }),
                keywords: ['align', 'justify', alignment],
                onSelect: () => 
                // @ts-ignore Correct types, but since they're dynamic TS doesn't like it.
                editor.dispatchCommand(lexical_1.FORMAT_ELEMENT_COMMAND, alignment),
            })));
        }
        for (const feature of editorConfig.features) {
            if (feature.componentPicker &&
                feature.componentPicker.componentPickerOptions &&
                feature.componentPicker.componentPickerOptions.length > 0) {
                for (const componentPickerOption of feature.componentPicker
                    .componentPickerOptions) {
                    baseOptions.push(componentPickerOption(editor, editorConfig));
                }
            }
        }
        const dynamicOptions = getDynamicOptions();
        return queryString
            ? [
                ...dynamicOptions,
                ...baseOptions.filter((option) => {
                    return new RegExp(queryString, 'gi').exec(option.title) ||
                        option.keywords != null
                        ? option.keywords.some((keyword) => new RegExp(queryString, 'gi').exec(keyword))
                        : false;
                }),
            ]
            : baseOptions;
    }, [editor, getDynamicOptions, queryString]);
    const onSelectOption = (0, react_1.useCallback)((selectedOption, nodeToRemove, closeMenu, matchingString) => {
        editor.update(() => {
            if (nodeToRemove) {
                nodeToRemove.remove();
            }
            selectedOption.onSelect(matchingString);
            closeMenu();
        });
    }, [editor]);
    return (React.createElement(React.Fragment, null,
        React.createElement(LexicalTypeaheadMenuPlugin_1.LexicalTypeaheadMenuPlugin, { onQueryChange: setQueryString, onSelectOption: onSelectOption, triggerFn: checkForTriggerMatch, options: options, menuRenderFn: (anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) => anchorElementRef.current && options.length
                ? ReactDOM.createPortal(React.createElement("div", { className: "typeahead-popover component-picker-menu" },
                    React.createElement("ul", null, options.map((option, i) => (React.createElement(ComponentPickerMenuItem, { index: i, isSelected: selectedIndex === i, onClick: () => {
                            setHighlightedIndex(i);
                            selectOptionAndCleanUp(option);
                        }, onMouseEnter: () => {
                            setHighlightedIndex(i);
                        }, key: option.key, option: option }))))), anchorElementRef.current)
                : null })));
}
exports.default = ComponentPickerMenuPlugin;
//# sourceMappingURL=index.js.map