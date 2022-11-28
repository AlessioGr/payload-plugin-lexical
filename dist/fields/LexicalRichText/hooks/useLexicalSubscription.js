"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const react_1 = require("react");
const useLayoutEffect_1 = __importDefault(require("../shared/useLayoutEffect"));
/**
 * Shortcut to Lexical subscriptions when values are used for render.
 */
function useLexicalSubscription(subscription) {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const initializedSubscription = (0, react_1.useMemo)(() => subscription(editor), [editor, subscription]);
    const valueRef = (0, react_1.useRef)(initializedSubscription.initialValueFn());
    const [value, setValue] = (0, react_1.useState)(valueRef.current);
    (0, useLayoutEffect_1.default)(() => {
        const { initialValueFn, subscribe } = initializedSubscription;
        const currentValue = initialValueFn();
        if (valueRef.current !== currentValue) {
            valueRef.current = currentValue;
            setValue(currentValue);
        }
        return subscribe((newValue) => {
            valueRef.current = newValue;
            setValue(newValue);
        });
    }, [initializedSubscription, subscription]);
    return value;
}
exports.default = useLexicalSubscription;
//# sourceMappingURL=useLexicalSubscription.js.map