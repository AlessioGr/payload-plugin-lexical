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
const React = __importStar(require("react"));
const react_1 = require("react");
const SettingsContext_1 = require("./context/SettingsContext");
const Switch_1 = __importDefault(require("./ui/Switch"));
function Settings() {
    const { setOption, settings: { measureTypingPerf, isRichText, isMaxLength, isCharLimit, isCharLimitUtf8, isAutocomplete, showTreeView, showNestedEditorTreeView, disableBeforeInput, showTableOfContents, }, } = (0, SettingsContext_1.useSettings)();
    const [showSettings, setShowSettings] = (0, react_1.useState)(false);
    return (React.createElement(React.Fragment, null,
        React.createElement("button", { id: "options-button", className: `editor-dev-button ${showSettings ? 'active' : ''}`, onClick: (event) => {
                event.preventDefault();
                setShowSettings(!showSettings);
            } }),
        showSettings ? (React.createElement("div", { className: "switches" },
            React.createElement(Switch_1.default, { onClick: () => setOption('measureTypingPerf', !measureTypingPerf), checked: measureTypingPerf, text: "Measure Perf" }),
            React.createElement(Switch_1.default, { onClick: () => setOption('showTreeView', !showTreeView), checked: showTreeView, text: "Debug View" }),
            React.createElement(Switch_1.default, { onClick: () => setOption('showNestedEditorTreeView', !showNestedEditorTreeView), checked: showNestedEditorTreeView, text: "Nested Editors Debug View" }),
            React.createElement(Switch_1.default, { onClick: () => {
                    setOption('isRichText', !isRichText);
                }, checked: isRichText, text: "Rich Text" }),
            React.createElement(Switch_1.default, { onClick: () => setOption('isCharLimit', !isCharLimit), checked: isCharLimit, text: "Char Limit" }),
            React.createElement(Switch_1.default, { onClick: () => setOption('isCharLimitUtf8', !isCharLimitUtf8), checked: isCharLimitUtf8, text: "Char Limit (UTF-8)" }),
            React.createElement(Switch_1.default, { onClick: () => setOption('isMaxLength', !isMaxLength), checked: isMaxLength, text: "Max Length" }),
            React.createElement(Switch_1.default, { onClick: () => setOption('isAutocomplete', !isAutocomplete), checked: isAutocomplete, text: "Autocomplete" }),
            React.createElement(Switch_1.default, { onClick: () => {
                    setOption('disableBeforeInput', !disableBeforeInput);
                    setTimeout(() => window.location.reload(), 500);
                }, checked: disableBeforeInput, text: "Legacy Events" }),
            React.createElement(Switch_1.default, { onClick: () => {
                    setOption('showTableOfContents', !showTableOfContents);
                }, checked: showTableOfContents, text: "Table Of Contents" }))) : null));
}
exports.default = Settings;
