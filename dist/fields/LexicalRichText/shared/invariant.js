"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
// invariant(condition, message) will refine types based on "condition", and
// if "condition" is false will throw an error. This function is special-cased
// in flow itself, so we can't name it anything else.
function invariant(cond, message, ...args) {
    if (cond) {
        return;
    }
    throw new Error('Internal Lexical error: invariant() is meant to be replaced at compile '
        + 'time. There is no runtime version.');
}
exports.default = invariant;
