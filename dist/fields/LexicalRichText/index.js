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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LexicalRichTextFieldComponent = exports.LexicalRichTextCell = exports.traverseLexicalField = exports.populateLexicalRelationships2 = void 0;
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
const payload_1 = __importDefault(require("payload"));
const populateLexicalRelationships2 = ({ value, req }) => __awaiter(void 0, void 0, void 0, function* () {
    if (value.root.children) {
        const newChildren = [];
        for (let childNode of value.root.children) {
            newChildren.push(yield traverseLexicalField(childNode, ""));
        }
        value.root.children = newChildren;
    }
    return value;
});
exports.populateLexicalRelationships2 = populateLexicalRelationships2;
function traverseLexicalField(node, locale) {
    return __awaiter(this, void 0, void 0, function* () {
        //Find replacements
        if (node.type === 'upload') {
            const rawImagePayload = node["rawImagePayload"];
            //const extraAttributes: ExtraAttributes = node["extraAttributes"];
            const uploadData = yield loadUploadData(rawImagePayload, locale);
            if (uploadData) {
                node["data"] = uploadData;
            }
        }
        else if (node.type === 'link' && node["linkType"] && node["linkType"] === 'internal') {
            const doc = node["doc"];
            const foundDoc = yield loadInternalLinkDocData(doc.value, doc.relationTo, locale);
            if (foundDoc) {
                node["doc"]["data"] = foundDoc;
            }
        }
        //Run for its children
        if (node["children"] && node["children"].length > 0) {
            let newChildren = [];
            for (let childNode of node["children"]) {
                newChildren.push(yield traverseLexicalField(childNode, locale));
            }
            node["children"] = newChildren;
        }
        return node;
    });
}
exports.traverseLexicalField = traverseLexicalField;
function loadUploadData(rawImagePayload, locale) {
    return __awaiter(this, void 0, void 0, function* () {
        const foundUpload = yield payload_1.default.findByID({
            collection: rawImagePayload.relationTo,
            id: rawImagePayload.value.id,
            depth: 2,
            locale: locale,
        });
        return foundUpload;
    });
}
function loadInternalLinkDocData(value, relationTo, locale) {
    return __awaiter(this, void 0, void 0, function* () {
        const foundDoc = yield payload_1.default.findByID({
            collection: relationTo,
            id: value,
            depth: 2,
            locale: locale,
        });
        return foundDoc;
    });
}
const LexicalRichTextCell = (props) => {
    const { field, colIndex, collection, cellData, rowData } = props;
    console.log("Props", props);
    const data = cellData;
    const initialConfig = {
        namespace: 'Playground',
        nodes: [...PlaygroundNodes_1.default],
        theme: PlaygroundEditorTheme_1.default,
    };
    let textToShow;
    try {
        const editor = (0, headless_1.createHeadlessEditor)(initialConfig);
        editor.setEditorState(editor.parseEditorState(data));
        const textContent = editor.getEditorState().read(() => {
            return (0, lexical_1.$getRoot)().getTextContent();
        });
        textToShow = (textContent === null || textContent === void 0 ? void 0 : textContent.length) > 100 ? `${textContent.slice(0, 100)}\u2026` : textContent;
    }
    catch (e) {
        textToShow = "Error: " + e.text;
    }
    return (react_1.default.createElement("span", null, textToShow));
};
exports.LexicalRichTextCell = LexicalRichTextCell;
const LexicalRichTextFieldComponent = (props) => {
    return (react_1.default.createElement(react_1.Suspense, { fallback: react_1.default.createElement(Loading_1.default, null) },
        react_1.default.createElement(LexicalRichTextFieldComponent2, Object.assign({}, props))));
};
exports.LexicalRichTextFieldComponent = LexicalRichTextFieldComponent;
const LexicalRichTextFieldComponent2 = (props) => {
    let readOnly = false;
    const { path, editorConfig } = props;
    console.log("path", path);
    //const { value, setValue } = useField<Props>({ path });
    const field = (0, forms_1.useField)({
        path: path, // required
        // validate: myValidateFunc, // optional
        // disableFormData?: false, // if true, the field's data will be ignored
        // condition?: myConditionHere, // optional, used to skip validation if condition fails
    });
    // Here is what `useField` sends back
    const { showError, // whether the field should show as errored
    errorMessage, // the error message to show, if showError
    value, // the current value of the field from the form
    formSubmitted, // if the form has been submitted
    formProcessing, // if the form is currently processing
    setValue, // method to set the field's value in form state
    initialValue, // the initial value that the field mounted with
     } = field;
    //console.log("Value", value)
    return (react_1.default.createElement(LexicalEditorComponent_1.LexicalEditorComponent, { onChange: (editorState, editor) => {
            const json = editorState.toJSON();
            if (!readOnly && /* json !== defaultValue && */ json !== value) {
                setValue(json);
            }
        }, initialJSON: value }));
};
//# sourceMappingURL=index.js.map