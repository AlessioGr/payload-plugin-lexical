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
Object.defineProperty(exports, "__esModule", { value: true });
require("./EquationEditor.scss");
const React = __importStar(require("react"));
const react_1 = require("react");
function EquationEditor({ equation, setEquation, inline }, forwardedRef) {
    const onChange = (event) => {
        setEquation(event.target.value);
    };
    return inline && forwardedRef instanceof HTMLInputElement ? (React.createElement("span", { className: "EquationEditor_inputBackground" },
        React.createElement("span", { className: "EquationEditor_dollarSign" }, "$"),
        React.createElement("input", { className: "EquationEditor_inlineEditor", value: equation, onChange: onChange, autoFocus: true, ref: forwardedRef }),
        React.createElement("span", { className: "EquationEditor_dollarSign" }, "$"))) : (React.createElement("div", { className: "EquationEditor_inputBackground" },
        React.createElement("span", { className: "EquationEditor_dollarSign" }, '$$\n'),
        React.createElement("textarea", { className: "EquationEditor_blockEditor", value: equation, onChange: onChange, ref: forwardedRef }),
        React.createElement("span", { className: "EquationEditor_dollarSign" }, '\n$$')));
}
exports.default = (0, react_1.forwardRef)(EquationEditor);
//# sourceMappingURL=EquationEditor.js.map