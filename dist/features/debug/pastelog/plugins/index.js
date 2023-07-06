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
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const lexical_1 = require("lexical");
const React = __importStar(require("react"));
const react_1 = require("react");
function PasteLogPlugin() {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [isActive, setIsActive] = (0, react_1.useState)(false);
    const [lastClipboardData, setLastClipboardData] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (isActive) {
            return editor.registerCommand(lexical_1.PASTE_COMMAND, (e) => {
                const { clipboardData } = e;
                const allData = [];
                if (clipboardData && clipboardData.types) {
                    clipboardData.types.forEach((type) => {
                        allData.push(type.toUpperCase(), clipboardData.getData(type));
                    });
                }
                setLastClipboardData(allData.join('\n\n'));
                return false;
            }, lexical_1.COMMAND_PRIORITY_NORMAL);
        }
    }, [editor, isActive]);
    return (React.createElement(React.Fragment, null,
        React.createElement("button", { id: "paste-log-button", className: `editor-dev-button ${isActive ? 'active' : ''}`, onClick: (event) => {
                event.preventDefault();
                setIsActive(!isActive);
            }, title: isActive ? 'Disable paste log' : 'Enable paste log' }),
        isActive && lastClipboardData !== null ? (React.createElement("pre", null, lastClipboardData)) : null));
}
exports.default = PasteLogPlugin;
//# sourceMappingURL=index.js.map