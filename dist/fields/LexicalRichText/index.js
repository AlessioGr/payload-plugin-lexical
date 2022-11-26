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
exports.LexicalRichTextField = exports.LexicalRichTextCell = exports.populateLexicalRelationships = void 0;
const react_1 = __importStar(require("react"));
const lexical_1 = require("lexical");
const LexicalEditorComponent_1 = require("./LexicalEditorComponent");
require("./index.scss");
const Loading_1 = __importDefault(require("payload/dist/admin/components/elements/Loading"));
const baseClass = 'lexicalRichTextEditor';
const forms_1 = require("payload/components/forms");
const PlaygroundNodes_1 = __importDefault(require("./nodes/PlaygroundNodes"));
const PlaygroundEditorTheme_1 = __importDefault(require("./themes/PlaygroundEditorTheme"));
const headless_1 = require("@lexical/headless");
function populateLexicalRelationships() {
}
exports.populateLexicalRelationships = populateLexicalRelationships;
const LexicalRichTextCell = (props) => {
    const { field, colIndex, collection, cellData, rowData } = props;
    console.log("Props", props);
    const data = cellData;
    const initialConfig = {
        namespace: 'Playground',
        nodes: [...PlaygroundNodes_1.default],
        theme: PlaygroundEditorTheme_1.default,
    };
    const editor = (0, headless_1.createHeadlessEditor)(initialConfig);
    editor.setEditorState(editor.parseEditorState(data));
    const textContent = editor.getEditorState().read(() => {
        return (0, lexical_1.$getRoot)().getTextContent();
    });
    const textToShow = (textContent === null || textContent === void 0 ? void 0 : textContent.length) > 100 ? `${textContent.slice(0, 100)}\u2026` : textContent;
    return (react_1.default.createElement("span", null, textToShow));
};
exports.LexicalRichTextCell = LexicalRichTextCell;
const LexicalRichTextField = (props) => {
    return (react_1.default.createElement(react_1.Suspense, { fallback: react_1.default.createElement(Loading_1.default, null) },
        react_1.default.createElement(LexicalRichText2, { ...props })));
};
exports.LexicalRichTextField = LexicalRichTextField;
const LexicalRichText2 = (props) => {
    let readOnly = false;
    const { path } = props;
    const { value, setValue } = (0, forms_1.useField)({ path });
    console.log("Value", value);
    return (react_1.default.createElement(LexicalEditorComponent_1.LexicalEditorComponent, { onChange: (editorState, editor) => {
            const json = editorState.toJSON();
            // @ts-ignore TODO
            if (!readOnly && /* json !== defaultValue && */ json !== value) {
                setValue(json);
            }
        }, initialJSON: value }));
};
