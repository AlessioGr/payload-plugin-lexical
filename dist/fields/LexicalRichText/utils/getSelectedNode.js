"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSelectedNode = void 0;
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
const selection_1 = require("@lexical/selection");
function getSelectedNode(selection) {
    const { anchor } = selection;
    const { focus } = selection;
    const anchorNode = selection.anchor.getNode();
    const focusNode = selection.focus.getNode();
    if (anchorNode === focusNode) {
        return anchorNode;
    }
    const isBackward = selection.isBackward();
    if (isBackward) {
        return (0, selection_1.$isAtNodeEnd)(focus) ? anchorNode : focusNode;
    }
    return (0, selection_1.$isAtNodeEnd)(anchor) ? anchorNode : focusNode;
}
exports.getSelectedNode = getSelectedNode;
//# sourceMappingURL=getSelectedNode.js.map