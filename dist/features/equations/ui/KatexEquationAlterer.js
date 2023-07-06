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
require("./KatexEquationAlterer.scss");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const React = __importStar(require("react"));
const react_1 = require("react");
const react_error_boundary_1 = require("react-error-boundary");
const Button_1 = __importDefault(require("payload/dist/admin/components/elements/Button"));
const KatexRenderer_1 = __importDefault(require("./KatexRenderer"));
function KatexEquationAlterer({ onConfirm, initialEquation = '', }) {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [equation, setEquation] = (0, react_1.useState)(initialEquation);
    const [inline, setInline] = (0, react_1.useState)(true);
    const onClick = (0, react_1.useCallback)(() => {
        onConfirm(equation, inline);
    }, [onConfirm, equation, inline]);
    const onCheckboxChange = (0, react_1.useCallback)(() => {
        setInline(!inline);
    }, [setInline, inline]);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "KatexEquationAlterer_defaultRow" },
            "Inline",
            React.createElement("input", { type: "checkbox", checked: inline, onChange: onCheckboxChange })),
        React.createElement("div", { className: "KatexEquationAlterer_defaultRow" }, "Equation "),
        React.createElement("div", { className: "KatexEquationAlterer_centerRow" }, inline ? (React.createElement("input", { onChange: (event) => {
                setEquation(event.target.value);
            }, value: equation, className: "KatexEquationAlterer_textArea" })) : (React.createElement("textarea", { onChange: (event) => {
                setEquation(event.target.value);
            }, value: equation, className: "KatexEquationAlterer_textArea" }))),
        React.createElement("div", { className: "KatexEquationAlterer_defaultRow" }, "Visualization "),
        React.createElement("div", { className: "KatexEquationAlterer_centerRow" },
            React.createElement(react_error_boundary_1.ErrorBoundary, { onError: (e) => editor._onError(e), fallback: null },
                React.createElement(KatexRenderer_1.default, { equation: equation, inline: false, onDoubleClick: () => null }))),
        React.createElement("div", { className: "KatexEquationAlterer_dialogActions" },
            React.createElement(Button_1.default, { onClick: onClick }, "Confirm"))));
}
exports.default = KatexEquationAlterer;
//# sourceMappingURL=KatexEquationAlterer.js.map