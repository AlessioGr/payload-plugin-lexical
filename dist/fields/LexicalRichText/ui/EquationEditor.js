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
require("./EquationEditor.scss");
const React = __importStar(require("react"));
function EquationEditor({ equation, setEquation, inline, inputRef, }) {
    const onChange = (event) => {
        setEquation(event.target.value);
    };
    const props = {
        equation,
        inputRef,
        onChange,
    };
    return inline ? (React.createElement(InlineEquationEditor, { ...props, inputRef: inputRef })) : (React.createElement(BlockEquationEditor, { ...props, inputRef: inputRef }));
}
exports.default = EquationEditor;
function InlineEquationEditor({ equation, onChange, inputRef, }) {
    return (React.createElement("span", { className: "EquationEditor_inputBackground" },
        React.createElement("span", { className: "EquationEditor_dollarSign" }, "$"),
        React.createElement("input", { className: "EquationEditor_inlineEditor", value: equation, onChange: onChange, autoFocus: true, ref: inputRef }),
        React.createElement("span", { className: "EquationEditor_dollarSign" }, "$")));
}
function BlockEquationEditor({ equation, onChange, inputRef, }) {
    return (React.createElement("div", { className: "EquationEditor_inputBackground" },
        React.createElement("span", { className: "EquationEditor_dollarSign" }, '$$\n'),
        React.createElement("textarea", { className: "EquationEditor_blockEditor", value: equation, onChange: onChange, ref: inputRef }),
        React.createElement("span", { className: "EquationEditor_dollarSign" }, '\n$$')));
}
