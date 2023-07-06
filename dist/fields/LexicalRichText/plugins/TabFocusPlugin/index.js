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
const lexical_1 = require("lexical");
const react_1 = require("react");
const COMMAND_PRIORITY_LOW = 1;
const TAB_TO_FOCUS_INTERVAL = 100;
let lastTabKeyDownTimestamp = 0;
let hasRegisteredKeyDownListener = false;
function registerKeyTimeStampTracker() {
    window.addEventListener('keydown', (event) => {
        // Tab
        if (event.keyCode === 9) {
            lastTabKeyDownTimestamp = event.timeStamp;
        }
    }, true);
}
function TabFocusPlugin() {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => {
        if (!hasRegisteredKeyDownListener) {
            registerKeyTimeStampTracker();
            hasRegisteredKeyDownListener = true;
        }
        return editor.registerCommand(lexical_1.FOCUS_COMMAND, (event) => {
            const selection = (0, lexical_1.$getSelection)();
            if ((0, lexical_1.$isRangeSelection)(selection)) {
                if (lastTabKeyDownTimestamp + TAB_TO_FOCUS_INTERVAL >
                    event.timeStamp) {
                    (0, lexical_1.$setSelection)(selection.clone());
                }
            }
            return false;
        }, COMMAND_PRIORITY_LOW);
    }, [editor]);
    return null;
}
exports.default = TabFocusPlugin;
//# sourceMappingURL=index.js.map