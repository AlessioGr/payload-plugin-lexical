"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const LexicalHorizontalRuleNode_1 = require("@lexical/react/LexicalHorizontalRuleNode");
const lexical_1 = require("lexical");
const react_1 = require("react");
function HorizontalRulePlugin() {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => {
        return editor.registerCommand(LexicalHorizontalRuleNode_1.INSERT_HORIZONTAL_RULE_COMMAND, (type) => {
            const selection = (0, lexical_1.$getSelection)();
            if (!(0, lexical_1.$isRangeSelection)(selection)) {
                return false;
            }
            const focusNode = selection.focus.getNode();
            if (focusNode !== null) {
                const horizontalRuleNode = (0, LexicalHorizontalRuleNode_1.$createHorizontalRuleNode)();
                selection.insertParagraph();
                selection.focus
                    .getNode()
                    .getTopLevelElementOrThrow()
                    .insertBefore(horizontalRuleNode);
            }
            return true;
        }, lexical_1.COMMAND_PRIORITY_EDITOR);
    }, [editor]);
    return null;
}
exports.default = HorizontalRulePlugin;
//# sourceMappingURL=index.js.map