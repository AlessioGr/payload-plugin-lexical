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
exports.useSharedHistoryContext = exports.SharedHistoryContext = void 0;
const LexicalHistoryPlugin_1 = require("@lexical/react/LexicalHistoryPlugin");
const React = __importStar(require("react"));
const react_1 = require("react");
const Context = (0, react_1.createContext)({});
const SharedHistoryContext = ({ children, }) => {
    const historyContext = (0, react_1.useMemo)(() => ({ historyState: (0, LexicalHistoryPlugin_1.createEmptyHistoryState)() }), []);
    return React.createElement(Context.Provider, { value: historyContext }, children);
};
exports.SharedHistoryContext = SharedHistoryContext;
const useSharedHistoryContext = () => {
    return (0, react_1.useContext)(Context);
};
exports.useSharedHistoryContext = useSharedHistoryContext;
//# sourceMappingURL=SharedHistoryContext.js.map