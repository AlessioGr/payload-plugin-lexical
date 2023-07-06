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
exports.useSharedAutocompleteContext = exports.SharedAutocompleteContext = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const Context = (0, react_1.createContext)([
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    (_cb) => () => { },
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
    (_newSuggestion) => { },
]);
const SharedAutocompleteContext = ({ children, }) => {
    const context = (0, react_1.useMemo)(() => {
        let suggestion = null;
        const listeners = new Set();
        return [
            (cb) => {
                cb(suggestion);
                listeners.add(cb);
                return () => {
                    listeners.delete(cb);
                };
            },
            (newSuggestion) => {
                suggestion = newSuggestion;
                // eslint-disable-next-line no-restricted-syntax
                for (const listener of listeners) {
                    listener(newSuggestion);
                }
            },
        ];
    }, []);
    return React.createElement(Context.Provider, { value: context }, children);
};
exports.SharedAutocompleteContext = SharedAutocompleteContext;
const useSharedAutocompleteContext = () => {
    const [subscribe, publish] = (0, react_1.useContext)(Context);
    const [suggestion, setSuggestion] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        return subscribe((newSuggestion) => {
            setSuggestion(newSuggestion);
        });
    }, [subscribe]);
    return [suggestion, publish];
};
exports.useSharedAutocompleteContext = useSharedAutocompleteContext;
//# sourceMappingURL=SharedAutocompleteContext.js.map