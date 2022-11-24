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
const useLexicalSubscription_1 = __importDefault(require("./useLexicalSubscription"));
function subscription(editor) {
    return {
        initialValueFn: () => editor.isEditable(),
        subscribe: (callback) => {
            return editor.registerEditableListener(callback);
        },
    };
}
function useLexicalEditable() {
    return (0, useLexicalSubscription_1.default)(subscription);
}
exports.default = useLexicalEditable;
