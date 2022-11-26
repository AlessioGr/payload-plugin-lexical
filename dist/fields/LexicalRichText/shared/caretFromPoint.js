"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
function caretFromPoint(x, y) {
    if (typeof document.caretRangeFromPoint !== 'undefined') {
        return document.caretRangeFromPoint(x, y);
        // @ts-ignore
    }
    if (document.caretPositionFromPoint !== 'undefined') {
        // @ts-ignore FF - no types
        return document.caretPositionFromPoint(x, y);
    }
    // Gracefully handle IE
    return null;
}
exports.default = caretFromPoint;
