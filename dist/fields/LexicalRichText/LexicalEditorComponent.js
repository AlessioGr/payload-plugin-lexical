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
exports.LexicalEditorComponent = void 0;
const LexicalComposer_1 = require("@lexical/react/LexicalComposer");
const React = __importStar(require("react"));
const SettingsContext_1 = require("./context/SettingsContext");
const SharedAutocompleteContext_1 = require("./context/SharedAutocompleteContext");
const SharedHistoryContext_1 = require("./context/SharedHistoryContext");
const LexicalRichText_1 = require("./LexicalRichText");
const PlaygroundNodes_1 = __importDefault(require("./nodes/PlaygroundNodes"));
const PasteLogPlugin_1 = __importDefault(require("./plugins/PasteLogPlugin"));
const TablePlugin_1 = require("./plugins/TablePlugin");
const TestRecorderPlugin_1 = __importDefault(require("./plugins/TestRecorderPlugin"));
const TypingPerfPlugin_1 = __importDefault(require("./plugins/TypingPerfPlugin"));
const Settings_1 = __importDefault(require("./Settings"));
const PlaygroundEditorTheme_1 = __importDefault(require("./themes/PlaygroundEditorTheme"));
const LexicalEditor = (props) => {
    const { onChange, initialJSON, } = props;
    const { settings: { measureTypingPerf }, } = (0, SettingsContext_1.useSettings)();
    const initialConfig = {
        editorState: initialJSON != null ? JSON.stringify(initialJSON) : undefined,
        namespace: 'Playground',
        nodes: [...PlaygroundNodes_1.default],
        onError: (error) => {
            throw error;
        },
        theme: PlaygroundEditorTheme_1.default,
    };
    // TODO: When should {true ? <PasteLogPlugin /> : null} be enabled? Do we need it?
    return (React.createElement(LexicalComposer_1.LexicalComposer, { initialConfig: initialConfig },
        React.createElement(SharedHistoryContext_1.SharedHistoryContext, null,
            React.createElement(TablePlugin_1.TableContext, null,
                React.createElement(SharedAutocompleteContext_1.SharedAutocompleteContext, null,
                    React.createElement("div", { className: "editor-shell" },
                        React.createElement(LexicalRichText_1.Editor, { onChange: onChange, initialJSON: initialJSON })),
                    React.createElement(Settings_1.default, null),
                    true ? React.createElement(PasteLogPlugin_1.default, null) : null,
                    true ? React.createElement(TestRecorderPlugin_1.default, null) : null,
                    measureTypingPerf ? React.createElement(TypingPerfPlugin_1.default, null) : null)))));
};
const LexicalEditorComponent = (props) => {
    const { onChange, initialJSON, } = props;
    return (React.createElement(SettingsContext_1.SettingsContext, null,
        React.createElement(LexicalEditor, { onChange: onChange, initialJSON: initialJSON })));
};
exports.LexicalEditorComponent = LexicalEditorComponent;
