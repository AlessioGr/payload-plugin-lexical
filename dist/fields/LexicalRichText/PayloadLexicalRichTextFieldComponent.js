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
exports.getJsonContentFromValue = exports.lexicalValidate = void 0;
const FieldDescription_1 = __importDefault(require("payload/dist/admin/components/forms/FieldDescription"));
const Label_1 = __importDefault(require("payload/dist/admin/components/forms/Label"));
const Error_1 = __importDefault(require("payload/dist/admin/components/forms/Error"));
const baseClass = 'lexicalRichTextEditor';
const html_1 = require("@lexical/html");
const forms_1 = require("payload/components/forms");
const LexicalEditorComponent_1 = require("./LexicalEditorComponent");
const react_1 = __importStar(require("react"));
const lexical_1 = require("lexical");
const defaultValue_1 = __importDefault(require("./settings/defaultValue"));
const deepEqual_1 = require("../../tools/deepEqual");
require("./payload.scss");
const markdown_1 = require("@lexical/markdown");
const react_error_boundary_1 = require("react-error-boundary");
function fallbackRender({ error, resetErrorBoundary }) {
    // Call resetErrorBoundary() to reset the error boundary and retry the render.
    return (react_1.default.createElement("div", { role: "alert" },
        react_1.default.createElement("p", null, "Something went wrong:"),
        react_1.default.createElement("pre", { style: { color: 'red' } }, error.message)));
}
const LexicalRichTextFieldComponent2 = (props) => {
    const { editorConfig, path: pathFromProps, required, validate = exports.lexicalValidate, defaultValue: defaultValueFromProps, // TODO: Accept different defaultValue
    name, label, admin: { readOnly, style, className, width, placeholder, // TODO: Accept different placeholder for richtext editor
    description, condition, hideGutter, } = {}, } = props;
    const path = pathFromProps || name;
    const memoizedValidate = (0, react_1.useCallback)((value, validationOptions) => {
        return (0, exports.lexicalValidate)(value, Object.assign(Object.assign({}, validationOptions), { required })); //TODO use "validate" here so people can customize their validate. Sadly that breaks for some reason (it uses no validate rather than lexical as default one if that's done)
    }, [validate, required]);
    const field = (0, forms_1.useField)({
        path: path,
        validate: memoizedValidate,
        condition,
    });
    // Here is what `useField` sends back
    const { showError, // whether the field should show as errored
    errorMessage, // the error message to show, if showError
    value = {
        jsonContent: defaultValue_1.default,
        preview: 'none',
        characters: 0,
        words: 0,
        comments: undefined,
    }, // the current value of the field from the form
    setValue, // method to set the field's value in form state
    initialValue, // TODO: the initial value that the field mounted with,
     } = field;
    const classes = [
        baseClass,
        'field-type',
        className,
        showError && 'error',
        readOnly && `${baseClass}--read-only`,
        !hideGutter && `${baseClass}--gutter`,
    ]
        .filter(Boolean)
        .join(' ');
    return (react_1.default.createElement("div", { className: classes, style: Object.assign(Object.assign({}, style), { width }) },
        react_1.default.createElement("div", { className: `${baseClass}__wrap` },
            react_1.default.createElement(Error_1.default, { showError: showError, message: errorMessage }),
            react_1.default.createElement(Label_1.default, { htmlFor: `field-${path.replace(/\./gi, '__')}`, label: label, required: required }),
            react_1.default.createElement(react_error_boundary_1.ErrorBoundary, { fallbackRender: fallbackRender, onReset: (details) => {
                    // Reset the state of your app so the error doesn't happen again
                } },
                react_1.default.createElement(LexicalEditorComponent_1.LexicalEditorComponent, { onChange: (editorState, editor, tags, commentStore) => {
                        var _a, _b, _c, _d;
                        const json = editorState.toJSON();
                        const valueJsonContent = getJsonContentFromValue(value);
                        if (!readOnly &&
                            valueJsonContent &&
                            !(0, deepEqual_1.deepEqual)(json, valueJsonContent)) {
                            const textContent = editor.getEditorState().read(() => {
                                return (0, lexical_1.$getRoot)().getTextContent();
                            });
                            const preview = (textContent === null || textContent === void 0 ? void 0 : textContent.length) > 100
                                ? `${textContent.slice(0, 100)}\u2026`
                                : textContent;
                            let html;
                            if ((_b = (_a = editorConfig === null || editorConfig === void 0 ? void 0 : editorConfig.output) === null || _a === void 0 ? void 0 : _a.html) === null || _b === void 0 ? void 0 : _b.enabled) {
                                html = editor.getEditorState().read(() => {
                                    return (0, html_1.$generateHtmlFromNodes)(editor, null);
                                });
                            }
                            let markdown;
                            if ((_d = (_c = editorConfig === null || editorConfig === void 0 ? void 0 : editorConfig.output) === null || _c === void 0 ? void 0 : _c.markdown) === null || _d === void 0 ? void 0 : _d.enabled) {
                                markdown = editor.getEditorState().read(() => {
                                    return (0, markdown_1.$convertToMarkdownString)();
                                });
                            }
                            setValue({
                                jsonContent: json,
                                preview: preview,
                                characters: textContent === null || textContent === void 0 ? void 0 : textContent.length,
                                words: textContent === null || textContent === void 0 ? void 0 : textContent.split(' ').length,
                                comments: commentStore.getComments(),
                                html: html,
                                markdown: markdown,
                            });
                        }
                    }, initialJSON: getJsonContentFromValue(value), editorConfig: editorConfig, initialComments: value === null || value === void 0 ? void 0 : value.comments, value: value, setValue: setValue }),
                react_1.default.createElement(FieldDescription_1.default, { value: value, description: description })))));
};
const lexicalValidate = (value, { t, required }) => {
    if (required) {
        const jsonContent = getJsonContentFromValue(value);
        if (jsonContent && !(0, deepEqual_1.deepEqual)(jsonContent, defaultValue_1.default)) {
            return true;
        }
        return t('validation:required');
    }
    return true;
};
exports.lexicalValidate = lexicalValidate;
function getJsonContentFromValue(value) {
    var _a;
    if (!(value === null || value === void 0 ? void 0 : value.jsonContent)) {
        return value;
    }
    if ((_a = value === null || value === void 0 ? void 0 : value.jsonContent) === null || _a === void 0 ? void 0 : _a.jsonContent) {
        return getJsonContentFromValue(value === null || value === void 0 ? void 0 : value.jsonContent);
    }
    return value === null || value === void 0 ? void 0 : value.jsonContent;
}
exports.getJsonContentFromValue = getJsonContentFromValue;
exports.default = (0, forms_1.withCondition)(LexicalRichTextFieldComponent2);
//# sourceMappingURL=PayloadLexicalRichTextFieldComponent.js.map