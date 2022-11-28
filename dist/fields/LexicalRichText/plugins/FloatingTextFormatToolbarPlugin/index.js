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
require("./index.scss");
const code_1 = require("@lexical/code");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const React = __importStar(require("react"));
const react_dom_1 = require("react-dom");
const LinkPluginModified_1 = require("../LinkPlugin/LinkPluginModified");
const getDOMRangeRect_1 = require("../../utils/getDOMRangeRect");
const getSelectedNode_1 = require("../../utils/getSelectedNode");
const setFloatingElemPosition_1 = require("../../utils/setFloatingElemPosition");
function TextFormatFloatingToolbar({ editor, anchorElem, isLink, isBold, isItalic, isUnderline, isCode, isStrikethrough, isSubscript, isSuperscript, }) {
    const popupCharStylesEditorRef = (0, react_1.useRef)(null);
    const insertLink = (0, react_1.useCallback)(() => {
        if (!isLink) {
            editor.dispatchCommand(LinkPluginModified_1.TOGGLE_LINK_COMMAND, 'https://');
        }
        else {
            editor.dispatchCommand(LinkPluginModified_1.TOGGLE_LINK_COMMAND, null);
        }
    }, [editor, isLink]);
    const updateTextFormatFloatingToolbar = (0, react_1.useCallback)(() => {
        const selection = (0, lexical_1.$getSelection)();
        const popupCharStylesEditorElem = popupCharStylesEditorRef.current;
        const nativeSelection = window.getSelection();
        if (popupCharStylesEditorElem === null) {
            return;
        }
        const rootElement = editor.getRootElement();
        if (selection !== null
            && nativeSelection !== null
            && !nativeSelection.isCollapsed
            && rootElement !== null
            && rootElement.contains(nativeSelection.anchorNode)) {
            const rangeRect = (0, getDOMRangeRect_1.getDOMRangeRect)(nativeSelection, rootElement);
            (0, setFloatingElemPosition_1.setFloatingElemPosition)(rangeRect, popupCharStylesEditorElem, anchorElem);
        }
    }, [editor, anchorElem]);
    (0, react_1.useEffect)(() => {
        const scrollerElem = anchorElem.parentElement;
        const update = () => {
            editor.getEditorState().read(() => {
                updateTextFormatFloatingToolbar();
            });
        };
        window.addEventListener('resize', update);
        if (scrollerElem) {
            scrollerElem.addEventListener('scroll', update);
        }
        return () => {
            window.removeEventListener('resize', update);
            if (scrollerElem) {
                scrollerElem.removeEventListener('scroll', update);
            }
        };
    }, [editor, updateTextFormatFloatingToolbar, anchorElem]);
    (0, react_1.useEffect)(() => {
        editor.getEditorState().read(() => {
            updateTextFormatFloatingToolbar();
        });
        return (0, utils_1.mergeRegister)(editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateTextFormatFloatingToolbar();
            });
        }), editor.registerCommand(lexical_1.SELECTION_CHANGE_COMMAND, () => {
            updateTextFormatFloatingToolbar();
            return false;
        }, lexical_1.COMMAND_PRIORITY_LOW));
    }, [editor, updateTextFormatFloatingToolbar]);
    return (React.createElement("div", { ref: popupCharStylesEditorRef, className: "floating-text-format-popup" }, editor.isEditable() && (React.createElement(React.Fragment, null,
        React.createElement("button", { onClick: (event) => {
                event.preventDefault();
                editor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, 'bold');
            }, className: `popup-item spaced ${isBold ? 'active' : ''}`, "aria-label": "Format text as bold" },
            React.createElement("i", { className: "format bold" })),
        React.createElement("button", { onClick: (event) => {
                event.preventDefault();
                editor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, 'italic');
            }, className: `popup-item spaced ${isItalic ? 'active' : ''}`, "aria-label": "Format text as italics" },
            React.createElement("i", { className: "format italic" })),
        React.createElement("button", { onClick: (event) => {
                event.preventDefault();
                editor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, 'underline');
            }, className: `popup-item spaced ${isUnderline ? 'active' : ''}`, "aria-label": "Format text to underlined" },
            React.createElement("i", { className: "format underline" })),
        React.createElement("button", { onClick: (event) => {
                event.preventDefault();
                editor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, 'strikethrough');
            }, className: `popup-item spaced ${isStrikethrough ? 'active' : ''}`, "aria-label": "Format text with a strikethrough" },
            React.createElement("i", { className: "format strikethrough" })),
        React.createElement("button", { onClick: (event) => {
                event.preventDefault();
                editor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, 'subscript');
            }, className: `popup-item spaced ${isSubscript ? 'active' : ''}`, title: "Subscript", "aria-label": "Format Subscript" },
            React.createElement("i", { className: "format subscript" })),
        React.createElement("button", { onClick: (event) => {
                event.preventDefault();
                editor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, 'superscript');
            }, className: `popup-item spaced ${isSuperscript ? 'active' : ''}`, title: "Superscript", "aria-label": "Format Superscript" },
            React.createElement("i", { className: "format superscript" })),
        React.createElement("button", { onClick: (event) => {
                event.preventDefault();
                editor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, 'code');
            }, className: `popup-item spaced ${isCode ? 'active' : ''}`, "aria-label": "Insert code block" },
            React.createElement("i", { className: "format code" })),
        React.createElement("button", { onClick: (event) => {
                event.preventDefault();
                insertLink();
            }, className: `popup-item spaced ${isLink ? 'active' : ''}`, "aria-label": "Insert link" },
            React.createElement("i", { className: "format link" }))))));
}
function useFloatingTextFormatToolbar(editor, anchorElem) {
    const [isText, setIsText] = (0, react_1.useState)(false);
    const [isLink, setIsLink] = (0, react_1.useState)(false);
    const [isBold, setIsBold] = (0, react_1.useState)(false);
    const [isItalic, setIsItalic] = (0, react_1.useState)(false);
    const [isUnderline, setIsUnderline] = (0, react_1.useState)(false);
    const [isStrikethrough, setIsStrikethrough] = (0, react_1.useState)(false);
    const [isSubscript, setIsSubscript] = (0, react_1.useState)(false);
    const [isSuperscript, setIsSuperscript] = (0, react_1.useState)(false);
    const [isCode, setIsCode] = (0, react_1.useState)(false);
    const updatePopup = (0, react_1.useCallback)(() => {
        editor.getEditorState().read(() => {
            // Should not to pop up the floating toolbar when using IME input
            if (editor.isComposing()) {
                return;
            }
            const selection = (0, lexical_1.$getSelection)();
            const nativeSelection = window.getSelection();
            const rootElement = editor.getRootElement();
            if (nativeSelection !== null
                && (!(0, lexical_1.$isRangeSelection)(selection)
                    || rootElement === null
                    || !rootElement.contains(nativeSelection.anchorNode))) {
                setIsText(false);
                return;
            }
            if (!(0, lexical_1.$isRangeSelection)(selection)) {
                return;
            }
            const node = (0, getSelectedNode_1.getSelectedNode)(selection);
            // Update text format
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));
            setIsSubscript(selection.hasFormat('subscript'));
            setIsSuperscript(selection.hasFormat('superscript'));
            setIsCode(selection.hasFormat('code'));
            // Update links
            const parent = node.getParent();
            if ((0, LinkPluginModified_1.$isLinkNode)(parent) || (0, LinkPluginModified_1.$isLinkNode)(node)) {
                setIsLink(true);
            }
            else {
                setIsLink(false);
            }
            if (!(0, code_1.$isCodeHighlightNode)(selection.anchor.getNode())
                && selection.getTextContent() !== '') {
                setIsText((0, lexical_1.$isTextNode)(node));
            }
            else {
                setIsText(false);
            }
        });
    }, [editor]);
    (0, react_1.useEffect)(() => {
        document.addEventListener('selectionchange', updatePopup);
        return () => {
            document.removeEventListener('selectionchange', updatePopup);
        };
    }, [updatePopup]);
    (0, react_1.useEffect)(() => {
        return (0, utils_1.mergeRegister)(editor.registerUpdateListener(() => {
            updatePopup();
        }), editor.registerRootListener(() => {
            if (editor.getRootElement() === null) {
                setIsText(false);
            }
        }));
    }, [editor, updatePopup]);
    if (!isText || isLink) {
        return null;
    }
    return (0, react_dom_1.createPortal)(React.createElement(TextFormatFloatingToolbar, { editor: editor, anchorElem: anchorElem, isLink: isLink, isBold: isBold, isItalic: isItalic, isStrikethrough: isStrikethrough, isSubscript: isSubscript, isSuperscript: isSuperscript, isUnderline: isUnderline, isCode: isCode }), anchorElem);
}
function FloatingTextFormatToolbarPlugin({ anchorElem = document.body, }) {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    return useFloatingTextFormatToolbar(editor, anchorElem);
}
exports.default = FloatingTextFormatToolbarPlugin;
//# sourceMappingURL=index.js.map