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
exports.ReadOnlyModeFeature = void 0;
const React = __importStar(require("react"));
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const react_1 = require("react");
const utils_1 = require("@lexical/utils");
function sendEditorState(editor) {
    return __awaiter(this, void 0, void 0, function* () {
        const stringifiedEditorState = JSON.stringify(editor.getEditorState());
        try {
            yield fetch('http://localhost:1235/setEditorState', {
                body: stringifiedEditorState,
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json',
                },
                method: 'POST',
            });
        }
        catch (_a) {
            // NO-OP
        }
    });
}
function validateEditorState(editor) {
    return __awaiter(this, void 0, void 0, function* () {
        const stringifiedEditorState = JSON.stringify(editor.getEditorState());
        let response = null;
        try {
            response = yield fetch('http://localhost:1235/validateEditorState', {
                body: stringifiedEditorState,
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json',
                },
                method: 'POST',
            });
        }
        catch (_a) {
            // NO-OP
        }
        if (response !== null && response.status === 403) {
            throw new Error('Editor state validation failed! Server did not accept changes.');
        }
    });
}
function ReadOnlyModeAction() {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [isEditable, setIsEditable] = (0, react_1.useState)(() => editor.isEditable());
    (0, react_1.useEffect)(() => {
        return (0, utils_1.mergeRegister)(editor.registerEditableListener((editable) => {
            setIsEditable(editable);
        }));
    }, [editor]);
    (0, react_1.useEffect)(() => {
        return editor.registerUpdateListener(({ dirtyElements, prevEditorState, tags }) => {
            // If we are in read only mode, send the editor state
            // to server and ask for validation if possible.
            if (!isEditable &&
                dirtyElements.size > 0 &&
                !tags.has('historic') &&
                !tags.has('collaboration')) {
                validateEditorState(editor);
            }
        });
    }, [editor, isEditable]);
    return (React.createElement("button", { className: `action-button ${!isEditable ? 'unlock' : 'lock'}`, onClick: (event) => {
            event.preventDefault();
            // Send latest editor state to commenting validation server
            if (isEditable) {
                sendEditorState(editor);
            }
            editor.setEditable(!editor.isEditable());
        }, title: "Read-Only Mode", "aria-label": `${!isEditable ? 'Unlock' : 'Lock'} read-only mode` },
        React.createElement("i", { className: !isEditable ? 'unlock' : 'lock' })));
}
function ReadOnlyModeFeature(props) {
    return {
        actions: [React.createElement(ReadOnlyModeAction, { key: "readonly" })],
    };
}
exports.ReadOnlyModeFeature = ReadOnlyModeFeature;
//# sourceMappingURL=ReadOnlyModeFeature.js.map