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
        const range = document.caretRangeFromPoint(x, y);
        if (range === null) {
            return null;
        }
        return {
            node: range.startContainer,
            offset: range.startOffset,
        };
        // @ts-ignore
    }
    if (document.caretPositionFromPoint !== 'undefined') {
        // @ts-ignore FF - no types
        const range = document.caretPositionFromPoint(x, y);
        if (range === null) {
            return null;
        }
        return {
            node: range.offsetNode,
            offset: range.offset,
        };
    }
    // Gracefully handle IE
    return null;
}
exports.default = caretFromPoint;
//# sourceMappingURL=caretFromPoint.js.map