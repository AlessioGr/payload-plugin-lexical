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
const code_1 = require("@lexical/code");
const list_1 = require("@lexical/list");
const LexicalAutoEmbedPlugin_1 = require("@lexical/react/LexicalAutoEmbedPlugin");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const LexicalDecoratorBlockNode_1 = require("@lexical/react/LexicalDecoratorBlockNode");
const LexicalHorizontalRuleNode_1 = require("@lexical/react/LexicalHorizontalRuleNode");
const rich_text_1 = require("@lexical/rich-text");
const selection_1 = require("@lexical/selection");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const React = __importStar(require("react"));
const modal_1 = require("@faceless-ui/modal");
const LinkPluginModified_1 = require("../LinkPlugin/LinkPluginModified");
const environment_1 = require("../../shared/environment");
const ColorPicker_1 = __importDefault(require("../../ui/ColorPicker"));
const DropDown_1 = __importStar(require("../../ui/DropDown"));
const getSelectedNode_1 = require("../../utils/getSelectedNode");
const url_1 = require("../../utils/url");
const AutoEmbedPlugin_1 = require("../AutoEmbedPlugin");
const CollapsiblePlugin_1 = require("../CollapsiblePlugin");
const EquationsPlugin_1 = require("../EquationsPlugin");
const TablePlugin_1 = require("../TablePlugin");
const UploadUI_1 = require("../UploadPlugin/UploadUI");
const blockTypeToBlockName = {
    bullet: 'Bulleted List',
    check: 'Check List',
    code: 'Code Block',
    h1: 'Heading 1',
    h2: 'Heading 2',
    h3: 'Heading 3',
    h4: 'Heading 4',
    h5: 'Heading 5',
    h6: 'Heading 6',
    number: 'Numbered List',
    paragraph: 'Normal',
    quote: 'Quote',
};
function getCodeLanguageOptions() {
    const options = [];
    Object.entries(code_1.CODE_LANGUAGE_FRIENDLY_NAME_MAP).forEach(([lang, friendlyName]) => {
        options.push([lang, friendlyName]);
    });
    return options;
}
const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();
const FONT_FAMILY_OPTIONS = [
    ['Arial', 'Arial'],
    ['Courier New', 'Courier New'],
    ['Georgia', 'Georgia'],
    ['Times New Roman', 'Times New Roman'],
    ['Trebuchet MS', 'Trebuchet MS'],
    ['Verdana', 'Verdana'],
];
const FONT_SIZE_OPTIONS = [
    ['10px', '10px'],
    ['11px', '11px'],
    ['12px', '12px'],
    ['13px', '13px'],
    ['14px', '14px'],
    ['15px', '15px'],
    ['16px', '16px'],
    ['17px', '17px'],
    ['18px', '18px'],
    ['19px', '19px'],
    ['20px', '20px'],
];
function dropDownActiveClass(active) {
    if (active)
        return 'active dropdown-item-active';
    return '';
}
function BlockFormatDropDown({ editor, blockType, disabled = false, }) {
    const formatParagraph = () => {
        if (blockType !== 'paragraph') {
            editor.update(() => {
                const selection = (0, lexical_1.$getSelection)();
                if ((0, lexical_1.$isRangeSelection)(selection)
                    || (0, lexical_1.DEPRECATED_$isGridSelection)(selection)) {
                    (0, selection_1.$wrapNodes)(selection, () => (0, lexical_1.$createParagraphNode)());
                }
            });
        }
    };
    const formatHeading = (headingSize) => {
        if (blockType !== headingSize) {
            editor.update(() => {
                const selection = (0, lexical_1.$getSelection)();
                if ((0, lexical_1.$isRangeSelection)(selection)
                    || (0, lexical_1.DEPRECATED_$isGridSelection)(selection)) {
                    (0, selection_1.$wrapNodes)(selection, () => (0, rich_text_1.$createHeadingNode)(headingSize));
                }
            });
        }
    };
    const formatBulletList = () => {
        if (blockType !== 'bullet') {
            editor.dispatchCommand(list_1.INSERT_UNORDERED_LIST_COMMAND, undefined);
        }
        else {
            editor.dispatchCommand(list_1.REMOVE_LIST_COMMAND, undefined);
        }
    };
    const formatCheckList = () => {
        if (blockType !== 'check') {
            editor.dispatchCommand(list_1.INSERT_CHECK_LIST_COMMAND, undefined);
        }
        else {
            editor.dispatchCommand(list_1.REMOVE_LIST_COMMAND, undefined);
        }
    };
    const formatNumberedList = () => {
        if (blockType !== 'number') {
            editor.dispatchCommand(list_1.INSERT_ORDERED_LIST_COMMAND, undefined);
        }
        else {
            editor.dispatchCommand(list_1.REMOVE_LIST_COMMAND, undefined);
        }
    };
    const formatQuote = () => {
        if (blockType !== 'quote') {
            editor.update(() => {
                const selection = (0, lexical_1.$getSelection)();
                if ((0, lexical_1.$isRangeSelection)(selection)
                    || (0, lexical_1.DEPRECATED_$isGridSelection)(selection)) {
                    (0, selection_1.$wrapNodes)(selection, () => (0, rich_text_1.$createQuoteNode)());
                }
            });
        }
    };
    const formatCode = () => {
        if (blockType !== 'code') {
            editor.update(() => {
                const selection = (0, lexical_1.$getSelection)();
                if ((0, lexical_1.$isRangeSelection)(selection)
                    || (0, lexical_1.DEPRECATED_$isGridSelection)(selection)) {
                    if (selection.isCollapsed()) {
                        (0, selection_1.$wrapNodes)(selection, () => (0, code_1.$createCodeNode)());
                    }
                    else {
                        const textContent = selection.getTextContent();
                        const codeNode = (0, code_1.$createCodeNode)();
                        selection.insertNodes([codeNode]);
                        selection.insertRawText(textContent);
                    }
                }
            });
        }
    };
    return (React.createElement(DropDown_1.default, { disabled: disabled, buttonClassName: "toolbar-item block-controls", buttonIconClassName: `icon block-type ${blockType}`, buttonLabel: blockTypeToBlockName[blockType], buttonAriaLabel: "Formatting options for text style" },
        React.createElement(DropDown_1.DropDownItem, { className: `item ${dropDownActiveClass(blockType === 'paragraph')}`, onClick: formatParagraph },
            React.createElement("i", { className: "icon paragraph" }),
            React.createElement("span", { className: "text" }, "Normal")),
        React.createElement(DropDown_1.DropDownItem, { className: `item ${dropDownActiveClass(blockType === 'h1')}`, onClick: () => formatHeading('h1') },
            React.createElement("i", { className: "icon h1" }),
            React.createElement("span", { className: "text" }, "Heading 1")),
        React.createElement(DropDown_1.DropDownItem, { className: `item ${dropDownActiveClass(blockType === 'h2')}`, onClick: () => formatHeading('h2') },
            React.createElement("i", { className: "icon h2" }),
            React.createElement("span", { className: "text" }, "Heading 2")),
        React.createElement(DropDown_1.DropDownItem, { className: `item ${dropDownActiveClass(blockType === 'h3')}`, onClick: () => formatHeading('h3') },
            React.createElement("i", { className: "icon h3" }),
            React.createElement("span", { className: "text" }, "Heading 3")),
        React.createElement(DropDown_1.DropDownItem, { className: `item ${dropDownActiveClass(blockType === 'bullet')}`, onClick: formatBulletList },
            React.createElement("i", { className: "icon bullet-list" }),
            React.createElement("span", { className: "text" }, "Bullet List")),
        React.createElement(DropDown_1.DropDownItem, { className: `item ${dropDownActiveClass(blockType === 'number')}`, onClick: formatNumberedList },
            React.createElement("i", { className: "icon numbered-list" }),
            React.createElement("span", { className: "text" }, "Numbered List")),
        React.createElement(DropDown_1.DropDownItem, { className: `item ${dropDownActiveClass(blockType === 'check')}`, onClick: formatCheckList },
            React.createElement("i", { className: "icon check-list" }),
            React.createElement("span", { className: "text" }, "Check List")),
        React.createElement(DropDown_1.DropDownItem, { className: `item ${dropDownActiveClass(blockType === 'quote')}`, onClick: formatQuote },
            React.createElement("i", { className: "icon quote" }),
            React.createElement("span", { className: "text" }, "Quote")),
        React.createElement(DropDown_1.DropDownItem, { className: `item ${dropDownActiveClass(blockType === 'code')}`, onClick: formatCode },
            React.createElement("i", { className: "icon code" }),
            React.createElement("span", { className: "text" }, "Code Block"))));
}
function Divider() {
    return React.createElement("div", { className: "divider" });
}
function FontDropDown({ editor, value, styleText, disabled = false, }) {
    const handleClick = (0, react_1.useCallback)((option) => {
        editor.update(() => {
            const selection = (0, lexical_1.$getSelection)();
            if ((0, lexical_1.$isRangeSelection)(selection)) {
                (0, selection_1.$patchStyleText)(selection, {
                    [styleText]: option,
                });
            }
        });
    }, [editor, styleText]);
    const buttonAriaLabel = styleText === 'font-family'
        ? 'Formatting options for font family'
        : 'Formatting options for font size';
    return (React.createElement(DropDown_1.default, { disabled: disabled, buttonClassName: `toolbar-item ${styleText}`, buttonLabel: value, buttonIconClassName: styleText === 'font-family' ? 'icon block-type font-family' : '', buttonAriaLabel: buttonAriaLabel }, (styleText === 'font-family' ? FONT_FAMILY_OPTIONS : FONT_SIZE_OPTIONS).map(([option, text]) => (React.createElement(DropDown_1.DropDownItem, { className: `item ${dropDownActiveClass(value === option)} ${styleText === 'font-size' ? 'fontsize-item' : ''}`, onClick: () => handleClick(option), key: option },
        React.createElement("span", { className: "text" }, text))))));
}
function ToolbarPlugin() {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [activeEditor, setActiveEditor] = (0, react_1.useState)(editor);
    const [blockType, setBlockType] = (0, react_1.useState)('paragraph');
    const [selectedElementKey, setSelectedElementKey] = (0, react_1.useState)(null);
    const [fontSize, setFontSize] = (0, react_1.useState)('15px');
    const [fontColor, setFontColor] = (0, react_1.useState)('#000');
    const [bgColor, setBgColor] = (0, react_1.useState)('#fff');
    const [fontFamily, setFontFamily] = (0, react_1.useState)('Arial');
    const [isLink, setIsLink] = (0, react_1.useState)(false);
    const [isBold, setIsBold] = (0, react_1.useState)(false);
    const [isItalic, setIsItalic] = (0, react_1.useState)(false);
    const [isUnderline, setIsUnderline] = (0, react_1.useState)(false);
    const [isStrikethrough, setIsStrikethrough] = (0, react_1.useState)(false);
    const [isSubscript, setIsSubscript] = (0, react_1.useState)(false);
    const [isSuperscript, setIsSuperscript] = (0, react_1.useState)(false);
    const [isCode, setIsCode] = (0, react_1.useState)(false);
    const [canUndo, setCanUndo] = (0, react_1.useState)(false);
    const [canRedo, setCanRedo] = (0, react_1.useState)(false);
    const [isRTL, setIsRTL] = (0, react_1.useState)(false);
    const [codeLanguage, setCodeLanguage] = (0, react_1.useState)('');
    const [isEditable, setIsEditable] = (0, react_1.useState)(() => editor.isEditable());
    const { toggleModal = () => { console.log("Error: useModal() from FacelessUI did not work correctly"); }, isModalOpen = () => false } = (0, modal_1.useModal)();
    const updateToolbar = (0, react_1.useCallback)(() => {
        const selection = (0, lexical_1.$getSelection)();
        if ((0, lexical_1.$isRangeSelection)(selection)) {
            const anchorNode = selection.anchor.getNode();
            let element = anchorNode.getKey() === 'root'
                ? anchorNode
                : (0, utils_1.$findMatchingParent)(anchorNode, (e) => {
                    const parent = e.getParent();
                    return parent !== null && (0, lexical_1.$isRootOrShadowRoot)(parent);
                });
            if (element === null) {
                element = anchorNode.getTopLevelElementOrThrow();
            }
            const elementKey = element.getKey();
            const elementDOM = activeEditor.getElementByKey(elementKey);
            // Update text format
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));
            setIsSubscript(selection.hasFormat('subscript'));
            setIsSuperscript(selection.hasFormat('superscript'));
            setIsCode(selection.hasFormat('code'));
            setIsRTL((0, selection_1.$isParentElementRTL)(selection));
            // Update links
            const node = (0, getSelectedNode_1.getSelectedNode)(selection);
            const parent = node.getParent();
            if ((0, LinkPluginModified_1.$isLinkNode)(parent) || (0, LinkPluginModified_1.$isLinkNode)(node)) {
                setIsLink(true);
            }
            else {
                setIsLink(false);
            }
            if (elementDOM !== null) {
                setSelectedElementKey(elementKey);
                if ((0, list_1.$isListNode)(element)) {
                    const parentList = (0, utils_1.$getNearestNodeOfType)(anchorNode, list_1.ListNode);
                    const type = parentList
                        ? parentList.getListType()
                        : element.getListType();
                    setBlockType(type);
                }
                else {
                    const type = (0, rich_text_1.$isHeadingNode)(element)
                        ? element.getTag()
                        : element.getType();
                    if (type in blockTypeToBlockName) {
                        setBlockType(type);
                    }
                    if ((0, code_1.$isCodeNode)(element)) {
                        const language = element.getLanguage();
                        setCodeLanguage(language ? code_1.CODE_LANGUAGE_MAP[language] || language : '');
                        return;
                    }
                }
            }
            // Handle buttons
            setFontSize((0, selection_1.$getSelectionStyleValueForProperty)(selection, 'font-size', '15px'));
            setFontColor((0, selection_1.$getSelectionStyleValueForProperty)(selection, 'color', '#000'));
            setBgColor((0, selection_1.$getSelectionStyleValueForProperty)(selection, 'background-color', '#fff'));
            setFontFamily((0, selection_1.$getSelectionStyleValueForProperty)(selection, 'font-family', 'Arial'));
        }
    }, [activeEditor]);
    (0, react_1.useEffect)(() => {
        return editor.registerCommand(lexical_1.SELECTION_CHANGE_COMMAND, (_payload, newEditor) => {
            updateToolbar();
            setActiveEditor(newEditor);
            return false;
        }, lexical_1.COMMAND_PRIORITY_CRITICAL);
    }, [editor, updateToolbar]);
    (0, react_1.useEffect)(() => {
        return (0, utils_1.mergeRegister)(editor.registerEditableListener((editable) => {
            setIsEditable(editable);
        }), activeEditor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateToolbar();
            });
        }), activeEditor.registerCommand(lexical_1.CAN_UNDO_COMMAND, (payload) => {
            setCanUndo(payload);
            return false;
        }, lexical_1.COMMAND_PRIORITY_CRITICAL), activeEditor.registerCommand(lexical_1.CAN_REDO_COMMAND, (payload) => {
            setCanRedo(payload);
            return false;
        }, lexical_1.COMMAND_PRIORITY_CRITICAL));
    }, [activeEditor, editor, updateToolbar]);
    const applyStyleText = (0, react_1.useCallback)((styles) => {
        activeEditor.update(() => {
            const selection = (0, lexical_1.$getSelection)();
            if ((0, lexical_1.$isRangeSelection)(selection)) {
                (0, selection_1.$patchStyleText)(selection, styles);
            }
        });
    }, [activeEditor]);
    const clearFormatting = (0, react_1.useCallback)(() => {
        activeEditor.update(() => {
            const selection = (0, lexical_1.$getSelection)();
            if ((0, lexical_1.$isRangeSelection)(selection)) {
                (0, selection_1.$selectAll)(selection);
                selection.getNodes().forEach((node) => {
                    if ((0, lexical_1.$isTextNode)(node)) {
                        node.setFormat(0);
                        node.setStyle('');
                        (0, utils_1.$getNearestBlockElementAncestorOrThrow)(node).setFormat('');
                    }
                    if ((0, LexicalDecoratorBlockNode_1.$isDecoratorBlockNode)(node)) {
                        node.setFormat('');
                    }
                });
            }
        });
    }, [activeEditor]);
    const onFontColorSelect = (0, react_1.useCallback)((value) => {
        applyStyleText({ color: value });
    }, [applyStyleText]);
    const onBgColorSelect = (0, react_1.useCallback)((value) => {
        applyStyleText({ 'background-color': value });
    }, [applyStyleText]);
    const insertLink = (0, react_1.useCallback)(() => {
        if (!isLink) {
            editor.dispatchCommand(LinkPluginModified_1.TOGGLE_LINK_COMMAND, (0, url_1.sanitizeUrl)('https://'));
        }
        else {
            editor.dispatchCommand(LinkPluginModified_1.TOGGLE_LINK_COMMAND, null);
        }
    }, [editor, isLink]);
    const onCodeLanguageSelect = (0, react_1.useCallback)((value) => {
        activeEditor.update(() => {
            if (selectedElementKey !== null) {
                const node = (0, lexical_1.$getNodeByKey)(selectedElementKey);
                if ((0, code_1.$isCodeNode)(node)) {
                    node.setLanguage(value);
                }
            }
        });
    }, [activeEditor, selectedElementKey]);
    return (React.createElement("div", { className: "toolbar" },
        React.createElement("button", { type: "button", disabled: !canUndo || !isEditable, onClick: (event) => {
                event.preventDefault();
                activeEditor.dispatchCommand(lexical_1.UNDO_COMMAND, undefined);
            }, title: environment_1.IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)', className: "toolbar-item spaced", "aria-label": "Undo" },
            React.createElement("i", { className: "format undo" })),
        React.createElement("button", { type: "button", disabled: !canRedo || !isEditable, onClick: (event) => {
                event.preventDefault();
                activeEditor.dispatchCommand(lexical_1.REDO_COMMAND, undefined);
            }, title: environment_1.IS_APPLE ? 'Redo (⌘Y)' : 'Redo (Ctrl+Y)', className: "toolbar-item", "aria-label": "Redo" },
            React.createElement("i", { className: "format redo" })),
        React.createElement(Divider, null),
        blockType in blockTypeToBlockName && activeEditor === editor && (React.createElement(React.Fragment, null,
            React.createElement(BlockFormatDropDown, { disabled: !isEditable, blockType: blockType, editor: editor }),
            React.createElement(Divider, null))),
        blockType === 'code' ? (React.createElement(React.Fragment, null,
            React.createElement(DropDown_1.default, { disabled: !isEditable, buttonClassName: "toolbar-item code-language", buttonLabel: (0, code_1.getLanguageFriendlyName)(codeLanguage), buttonAriaLabel: "Select language" }, CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
                return (React.createElement(DropDown_1.DropDownItem, { className: `item ${dropDownActiveClass(value === codeLanguage)}`, onClick: () => onCodeLanguageSelect(value), key: value },
                    React.createElement("span", { className: "text" }, name)));
            })))) : (React.createElement(React.Fragment, null,
            React.createElement(FontDropDown, { disabled: !isEditable, styleText: "font-family", value: fontFamily, editor: editor }),
            React.createElement(FontDropDown, { disabled: !isEditable, styleText: "font-size", value: fontSize, editor: editor }),
            React.createElement(Divider, null),
            React.createElement("button", { type: "button", disabled: !isEditable, onClick: (event) => {
                    event.preventDefault();
                    activeEditor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, 'bold');
                }, className: `toolbar-item spaced ${isBold ? 'active' : ''}`, title: environment_1.IS_APPLE ? 'Bold (⌘B)' : 'Bold (Ctrl+B)', "aria-label": `Format text as bold. Shortcut: ${environment_1.IS_APPLE ? '⌘B' : 'Ctrl+B'}` },
                React.createElement("i", { className: "format bold" })),
            React.createElement("button", { type: "button", disabled: !isEditable, onClick: (event) => {
                    event.preventDefault();
                    activeEditor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, 'italic');
                }, className: `toolbar-item spaced ${isItalic ? 'active' : ''}`, title: environment_1.IS_APPLE ? 'Italic (⌘I)' : 'Italic (Ctrl+I)', "aria-label": `Format text as italics. Shortcut: ${environment_1.IS_APPLE ? '⌘I' : 'Ctrl+I'}` },
                React.createElement("i", { className: "format italic" })),
            React.createElement("button", { type: "button", disabled: !isEditable, onClick: (event) => {
                    event.preventDefault();
                    activeEditor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, 'underline');
                }, className: `toolbar-item spaced ${isUnderline ? 'active' : ''}`, title: environment_1.IS_APPLE ? 'Underline (⌘U)' : 'Underline (Ctrl+U)', "aria-label": `Format text to underlined. Shortcut: ${environment_1.IS_APPLE ? '⌘U' : 'Ctrl+U'}` },
                React.createElement("i", { className: "format underline" })),
            React.createElement("button", { type: "button", disabled: !isEditable, onClick: (event) => {
                    event.preventDefault();
                    activeEditor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, 'code');
                }, className: `toolbar-item spaced ${isCode ? 'active' : ''}`, title: "Insert code block", "aria-label": "Insert code block" },
                React.createElement("i", { className: "format code" })),
            React.createElement("button", { type: "button", disabled: !isEditable, onClick: (event) => {
                    event.preventDefault();
                    insertLink();
                }, className: `toolbar-item spaced ${isLink ? 'active' : ''}`, "aria-label": "Insert link", title: "Insert link" },
                React.createElement("i", { className: "format link" })),
            React.createElement(ColorPicker_1.default, { disabled: !isEditable, buttonClassName: "toolbar-item color-picker", buttonAriaLabel: "Formatting text color", buttonIconClassName: "icon font-color", color: fontColor, onChange: onFontColorSelect, title: "text color" }),
            React.createElement(ColorPicker_1.default, { disabled: !isEditable, buttonClassName: "toolbar-item color-picker", buttonAriaLabel: "Formatting background color", buttonIconClassName: "icon bg-color", color: bgColor, onChange: onBgColorSelect, title: "bg color" }),
            React.createElement(DropDown_1.default, { disabled: !isEditable, buttonClassName: "toolbar-item spaced", buttonLabel: "", buttonAriaLabel: "Formatting options for additional text styles", buttonIconClassName: "icon dropdown-more" },
                React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                        activeEditor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, 'strikethrough');
                    }, className: `item ${dropDownActiveClass(isStrikethrough)}`, title: "Strikethrough", "aria-label": "Format text with a strikethrough" },
                    React.createElement("i", { className: "icon strikethrough" }),
                    React.createElement("span", { className: "text" }, "Strikethrough")),
                React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                        activeEditor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, 'subscript');
                    }, className: `item ${dropDownActiveClass(isSubscript)}`, title: "Subscript", "aria-label": "Format text with a subscript" },
                    React.createElement("i", { className: "icon subscript" }),
                    React.createElement("span", { className: "text" }, "Subscript")),
                React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                        activeEditor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, 'superscript');
                    }, className: `item ${dropDownActiveClass(isSuperscript)}`, title: "Superscript", "aria-label": "Format text with a superscript" },
                    React.createElement("i", { className: "icon superscript" }),
                    React.createElement("span", { className: "text" }, "Superscript")),
                React.createElement(DropDown_1.DropDownItem, { onClick: clearFormatting, className: "item", title: "Clear text formatting", "aria-label": "Clear all text formatting" },
                    React.createElement("i", { className: "icon clear" }),
                    React.createElement("span", { className: "text" }, "Clear Formatting"))),
            React.createElement(Divider, null),
            React.createElement(DropDown_1.default, { disabled: !isEditable, buttonClassName: "toolbar-item spaced", buttonLabel: "Insert", buttonAriaLabel: "Insert specialized editor node", buttonIconClassName: "icon plus" },
                React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                        activeEditor.dispatchCommand(LexicalHorizontalRuleNode_1.INSERT_HORIZONTAL_RULE_COMMAND, undefined);
                    }, className: "item" },
                    React.createElement("i", { className: "icon horizontal-rule" }),
                    React.createElement("span", { className: "text" }, "Horizontal Rule")),
                React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                        toggleModal('lexicalRichText-add-upload');
                    }, className: "item" },
                    React.createElement("i", { className: "icon image" }),
                    React.createElement("span", { className: "text" }, "Upload")),
                React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                        toggleModal('lexicalRichText-add-equation');
                    }, className: "item" },
                    React.createElement("i", { className: "icon equation" }),
                    React.createElement("span", { className: "text" }, "Equation")),
                React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                        editor.dispatchCommand(CollapsiblePlugin_1.INSERT_COLLAPSIBLE_COMMAND, undefined);
                    }, className: "item" },
                    React.createElement("i", { className: "icon caret-right" }),
                    React.createElement("span", { className: "text" }, "Collapsible container")),
                AutoEmbedPlugin_1.EmbedConfigs.map((embedConfig) => (React.createElement(DropDown_1.DropDownItem, { key: embedConfig.type, onClick: () => {
                        activeEditor.dispatchCommand(LexicalAutoEmbedPlugin_1.INSERT_EMBED_COMMAND, embedConfig.type);
                    }, className: "item" },
                    embedConfig.icon,
                    React.createElement("span", { className: "text" }, embedConfig.contentName))))))),
        React.createElement(Divider, null),
        React.createElement(DropDown_1.default, { disabled: !isEditable, buttonLabel: "Align", buttonIconClassName: "icon left-align", buttonClassName: "toolbar-item spaced alignment", buttonAriaLabel: "Formatting options for text alignment" },
            React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                    activeEditor.dispatchCommand(lexical_1.FORMAT_ELEMENT_COMMAND, 'left');
                }, className: "item" },
                React.createElement("i", { className: "icon left-align" }),
                React.createElement("span", { className: "text" }, "Left Align")),
            React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                    activeEditor.dispatchCommand(lexical_1.FORMAT_ELEMENT_COMMAND, 'center');
                }, className: "item" },
                React.createElement("i", { className: "icon center-align" }),
                React.createElement("span", { className: "text" }, "Center Align")),
            React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                    activeEditor.dispatchCommand(lexical_1.FORMAT_ELEMENT_COMMAND, 'right');
                }, className: "item" },
                React.createElement("i", { className: "icon right-align" }),
                React.createElement("span", { className: "text" }, "Right Align")),
            React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                    activeEditor.dispatchCommand(lexical_1.FORMAT_ELEMENT_COMMAND, 'justify');
                }, className: "item" },
                React.createElement("i", { className: "icon justify-align" }),
                React.createElement("span", { className: "text" }, "Justify Align")),
            React.createElement(Divider, null),
            React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                    activeEditor.dispatchCommand(lexical_1.OUTDENT_CONTENT_COMMAND, undefined);
                }, className: "item" },
                React.createElement("i", { className: `icon ${isRTL ? 'indent' : 'outdent'}` }),
                React.createElement("span", { className: "text" }, "Outdent")),
            React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                    activeEditor.dispatchCommand(lexical_1.INDENT_CONTENT_COMMAND, undefined);
                }, className: "item" },
                React.createElement("i", { className: `icon ${isRTL ? 'outdent' : 'indent'}` }),
                React.createElement("span", { className: "text" }, "Indent"))),
        isModalOpen('lexicalRichText-add-upload') && (React.createElement(modal_1.Modal, { className: "rich-text-upload-modal", slug: "lexicalRichText-add-upload" },
            React.createElement(UploadUI_1.UploadModal, { activeEditor: activeEditor }))),
        isModalOpen('lexicalRichText-add-table') && (React.createElement(modal_1.Modal, { className: "rich-text-table-modal", slug: "lexicalRichText-add-table" },
            React.createElement(TablePlugin_1.InsertTableDialog, { activeEditor: activeEditor, onClose: () => { } }))),
        isModalOpen('lexicalRichText-add-equation') && (React.createElement(modal_1.Modal, { className: "rich-text-equation-modal", slug: "lexicalRichText-add-equation" },
            React.createElement(EquationsPlugin_1.InsertEquationDialog, { activeEditor: activeEditor })))));
}
exports.default = ToolbarPlugin;
//# sourceMappingURL=index.js.map