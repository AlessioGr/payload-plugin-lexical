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
const katex_1 = __importDefault(require("katex"));
const React = __importStar(require("react"));
const react_1 = require("react");
function KatexRenderer({ equation, inline, onDoubleClick, }) {
    const katexElementRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const katexElement = katexElementRef.current;
        if (katexElement !== null) {
            katex_1.default.render(equation, katexElement, {
                displayMode: !inline,
                errorColor: '#cc0000',
                output: 'html',
                strict: 'warn',
                throwOnError: false,
                trust: false,
            });
        }
    }, [equation, inline]);
    return (
    // We use an empty image tag either side to ensure Android doesn't try and compose from the
    // inner text from Katex. There didn't seem to be any other way of making this work,
    // without having a physical space.
    React.createElement(React.Fragment, null,
        React.createElement("img", { src: "#", alt: "" }),
        React.createElement("span", { role: "button", tabIndex: -1, onDoubleClick: onDoubleClick, ref: katexElementRef }),
        React.createElement("img", { src: "#", alt: "" })));
}
exports.default = KatexRenderer;
//# sourceMappingURL=KatexRenderer.js.map