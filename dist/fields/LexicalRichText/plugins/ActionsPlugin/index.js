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
const file_1 = require("@lexical/file");
const markdown_1 = require("@lexical/markdown");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const utils_1 = require("@lexical/utils");
const yjs_1 = require("@lexical/yjs");
const lexical_1 = require("lexical");
const React = __importStar(require("react"));
const react_1 = require("react");
const useModal_1 = __importDefault(require("../../hooks/useModal"));
const Button_1 = __importDefault(require("payload/dist/admin/components/elements/Button"));
const MarkdownTransformers_1 = require("../MarkdownTransformers");
const SpeechToTextPlugin_1 = require("../SpeechToTextPlugin");
async function sendEditorState(editor) {
    const stringifiedEditorState = JSON.stringify(editor.getEditorState());
    try {
        await fetch('http://localhost:1235/setEditorState', {
            body: stringifiedEditorState,
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json',
            },
            method: 'POST',
        });
    }
    catch {
        // NO-OP
    }
}
async function validateEditorState(editor) {
    const stringifiedEditorState = JSON.stringify(editor.getEditorState());
    let response = null;
    try {
        response = await fetch('http://localhost:1235/validateEditorState', {
            body: stringifiedEditorState,
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json',
            },
            method: 'POST',
        });
    }
    catch {
        // NO-OP
    }
    if (response !== null && response.status === 403) {
        throw new Error('Editor state validation failed! Server did not accept changes.');
    }
}
function ActionsPlugin({ isRichText, }) {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [isEditable, setIsEditable] = (0, react_1.useState)(() => editor.isEditable());
    const [isSpeechToText, setIsSpeechToText] = (0, react_1.useState)(false);
    const [connected, setConnected] = (0, react_1.useState)(false);
    const [isEditorEmpty, setIsEditorEmpty] = (0, react_1.useState)(true);
    const [modal, showModal] = (0, useModal_1.default)();
    (0, react_1.useEffect)(() => {
        return (0, utils_1.mergeRegister)(editor.registerEditableListener((editable) => {
            setIsEditable(editable);
        }), editor.registerCommand(yjs_1.CONNECTED_COMMAND, (payload) => {
            const isConnected = payload;
            setConnected(isConnected);
            return false;
        }, lexical_1.COMMAND_PRIORITY_EDITOR));
    }, [editor]);
    (0, react_1.useEffect)(() => {
        return editor.registerUpdateListener(({ dirtyElements, prevEditorState, tags }) => {
            // If we are in read only mode, send the editor state
            // to server and ask for validation if possible.
            if (!isEditable
                && dirtyElements.size > 0
                && !tags.has('historic')
                && !tags.has('collaboration')) {
                validateEditorState(editor);
            }
            editor.getEditorState().read(() => {
                const root = (0, lexical_1.$getRoot)();
                const children = root.getChildren();
                if (children.length > 1) {
                    setIsEditorEmpty(false);
                }
                else if ((0, lexical_1.$isParagraphNode)(children[0])) {
                    const paragraphChildren = children[0].getChildren();
                    setIsEditorEmpty(paragraphChildren.length === 0);
                }
                else {
                    setIsEditorEmpty(false);
                }
            });
        });
    }, [editor, isEditable]);
    const handleMarkdownToggle = (0, react_1.useCallback)(() => {
        editor.update(() => {
            const root = (0, lexical_1.$getRoot)();
            const firstChild = root.getFirstChild();
            if ((0, code_1.$isCodeNode)(firstChild) && firstChild.getLanguage() === 'markdown') {
                (0, markdown_1.$convertFromMarkdownString)(firstChild.getTextContent(), MarkdownTransformers_1.PLAYGROUND_TRANSFORMERS);
            }
            else {
                const markdown = (0, markdown_1.$convertToMarkdownString)(MarkdownTransformers_1.PLAYGROUND_TRANSFORMERS);
                root
                    .clear()
                    .append((0, code_1.$createCodeNode)('markdown').append((0, lexical_1.$createTextNode)(markdown)));
            }
            root.selectEnd();
        });
    }, [editor]);
    return (React.createElement("div", { className: "actions" },
        (0, SpeechToTextPlugin_1.isSUPPORT_SPEECH_RECOGNITION)() && (React.createElement("button", { onClick: (event) => {
                event.preventDefault();
                editor.dispatchCommand(SpeechToTextPlugin_1.SPEECH_TO_TEXT_COMMAND, !isSpeechToText);
                setIsSpeechToText(!isSpeechToText);
            }, className: `action-button action-button-mic ${isSpeechToText ? 'active' : ''}`, title: "Speech To Text", "aria-label": `${isSpeechToText ? 'Enable' : 'Disable'} speech to text` },
            React.createElement("i", { className: "mic" }))),
        React.createElement("button", { className: "action-button import", onClick: (event) => {
                event.preventDefault();
                (0, file_1.importFile)(editor);
            }, title: "Import", "aria-label": "Import editor state from JSON" },
            React.createElement("i", { className: "import" })),
        React.createElement("button", { className: "action-button export", onClick: (event) => {
                event.preventDefault();
                (0, file_1.exportFile)(editor, {
                    fileName: `Playground ${new Date().toISOString()}`,
                    source: 'Playground',
                });
            }, title: "Export", "aria-label": "Export editor state to JSON" },
            React.createElement("i", { className: "export" })),
        React.createElement("button", { className: "action-button clear", disabled: isEditorEmpty, onClick: (event) => {
                event.preventDefault();
                showModal('Clear editor', (onClose) => (React.createElement(ShowClearDialog, { editor: editor, onClose: onClose })));
            }, title: "Clear", "aria-label": "Clear editor contents" },
            React.createElement("i", { className: "clear" })),
        React.createElement("button", { className: `action-button ${!isEditable ? 'unlock' : 'lock'}`, onClick: (event) => {
                event.preventDefault();
                // Send latest editor state to commenting validation server
                if (isEditable) {
                    sendEditorState(editor);
                }
                editor.setEditable(!editor.isEditable());
            }, title: "Read-Only Mode", "aria-label": `${!isEditable ? 'Unlock' : 'Lock'} read-only mode` },
            React.createElement("i", { className: !isEditable ? 'unlock' : 'lock' })),
        React.createElement("button", { className: "action-button", onClick: (event) => {
                event.preventDefault();
                handleMarkdownToggle();
            }, title: "Convert From Markdown", "aria-label": "Convert from markdown" },
            React.createElement("i", { className: "markdown" })),
        modal));
}
exports.default = ActionsPlugin;
function ShowClearDialog({ editor, onClose, }) {
    return (React.createElement(React.Fragment, null,
        "Are you sure you want to clear the editor?",
        React.createElement("div", { className: "Modal__content" },
            React.createElement(Button_1.default, { onClick: () => {
                    editor.dispatchCommand(lexical_1.CLEAR_EDITOR_COMMAND, undefined);
                    editor.focus();
                    onClose();
                } }, "Clear"),
            ' ',
            React.createElement(Button_1.default, { onClick: () => {
                    editor.focus();
                    onClose();
                } }, "Cancel"))));
}
