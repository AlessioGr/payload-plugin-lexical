"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
function warnOnlyOnce(message) {
    if (process.env.NODE_ENV === 'production') {
        // return if not dev
        return;
    }
    let run = false;
    return () => {
        if (!run) {
            console.warn(message);
        }
        run = true;
    };
}
exports.default = warnOnlyOnce;
//# sourceMappingURL=warnOnlyOnce.js.map