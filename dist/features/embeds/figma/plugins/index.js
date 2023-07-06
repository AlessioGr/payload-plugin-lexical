"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.INSERT_FIGMA_COMMAND = void 0;
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const FigmaNode_1 = require("../nodes/FigmaNode");
require("./index.scss");
exports.INSERT_FIGMA_COMMAND = (0, lexical_1.createCommand)('INSERT_FIGMA_COMMAND');
function FigmaPlugin() {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => {
        if (!editor.hasNodes([FigmaNode_1.FigmaNode])) {
            throw new Error('FigmaPlugin: FigmaNode not registered on editor');
        }
        return editor.registerCommand(exports.INSERT_FIGMA_COMMAND, (payload) => {
            const figmaNode = (0, FigmaNode_1.$createFigmaNode)(payload);
            (0, utils_1.$insertNodeToNearestRoot)(figmaNode);
            return true;
        }, lexical_1.COMMAND_PRIORITY_EDITOR);
    }, [editor]);
    return null;
}
exports.default = FigmaPlugin;
//# sourceMappingURL=index.js.map