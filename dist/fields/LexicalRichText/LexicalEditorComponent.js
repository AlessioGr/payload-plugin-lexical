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
exports.useEditorConfigContext = exports.EditorConfigContext = exports.LexicalEditorComponent = void 0;
const LexicalComposer_1 = require("@lexical/react/LexicalComposer");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const React = __importStar(require("react"));
const react_1 = require("react");
const SharedAutocompleteContext_1 = require("./context/SharedAutocompleteContext");
const SharedHistoryContext_1 = require("./context/SharedHistoryContext");
const LexicalRichText_1 = require("./LexicalRichText");
const PlaygroundNodes_1 = __importDefault(require("./nodes/PlaygroundNodes"));
const CommentPlugin_1 = require("./plugins/CommentPlugin");
const TablePlugin_1 = require("./plugins/TablePlugin");
const PlaygroundEditorTheme_1 = __importDefault(require("./themes/PlaygroundEditorTheme"));
require("./index.scss");
const LexicalEditor = (props) => {
    const { onChange, initialJSON, editorConfig, initialComments, value, setValue, } = props;
    const initialConfig = {
        editorState: initialJSON != null ? JSON.stringify(initialJSON) : undefined,
        namespace: 'Playground',
        nodes: [...(0, PlaygroundNodes_1.default)(editorConfig)],
        onError: (error) => {
            throw error;
        },
        theme: PlaygroundEditorTheme_1.default,
    };
    return (React.createElement(LexicalComposer_1.LexicalComposer, { initialConfig: initialConfig },
        React.createElement(exports.EditorConfigContext, { editorConfig: editorConfig },
            React.createElement(SharedHistoryContext_1.SharedHistoryContext, null,
                React.createElement(TablePlugin_1.TableContext, null,
                    React.createElement(SharedAutocompleteContext_1.SharedAutocompleteContext, null,
                        React.createElement(CommentPlugin_1.CommentsContext, { initialComments: initialComments },
                            React.createElement("div", { className: "editor-shell" },
                                React.createElement(LexicalRichText_1.Editor, { onChange: onChange, initialJSON: initialJSON, editorConfig: editorConfig, initialComments: initialComments, value: value, setValue: setValue })),
                            editorConfig.features.map((feature) => {
                                if (feature.plugins && feature.plugins.length > 0) {
                                    return feature.plugins.map((plugin) => {
                                        if (plugin.position === 'outside') {
                                            return plugin.component;
                                        }
                                    });
                                }
                            }))))))));
};
const LexicalEditorComponent = (props) => {
    const { onChange, initialJSON, editorConfig, initialComments, value, setValue, } = props;
    return (
    //<SettingsContext>
    React.createElement(LexicalEditor, { onChange: onChange, initialJSON: initialJSON, editorConfig: editorConfig, initialComments: initialComments, value: value, setValue: setValue })
    //</SettingsContext>
    );
};
exports.LexicalEditorComponent = LexicalEditorComponent;
const Context = (0, react_1.createContext)({});
function generateQuickGuid() {
    return (Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15));
}
const EditorConfigContext = ({ children, editorConfig, }) => {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    let editorContextShape;
    if (!editorConfig) {
        throw new Error('editorConfig is required');
    }
    else {
        let uuid = (editorContextShape = (0, react_1.useMemo)(() => ({ editorConfig: editorConfig, uuid: '' + generateQuickGuid() }), [editor]));
    }
    return (React.createElement(Context.Provider, { value: editorContextShape }, children));
};
exports.EditorConfigContext = EditorConfigContext;
const useEditorConfigContext = () => {
    return (0, react_1.useContext)(Context);
};
exports.useEditorConfigContext = useEditorConfigContext;
//# sourceMappingURL=LexicalEditorComponent.js.map