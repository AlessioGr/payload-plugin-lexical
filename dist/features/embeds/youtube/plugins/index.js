"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.INSERT_YOUTUBE_COMMAND = void 0;
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const YouTubeNode_1 = require("../nodes/YouTubeNode");
require("./index.scss");
exports.INSERT_YOUTUBE_COMMAND = (0, lexical_1.createCommand)('INSERT_YOUTUBE_COMMAND');
function YouTubePlugin() {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => {
        if (!editor.hasNodes([YouTubeNode_1.YouTubeNode])) {
            throw new Error('YouTubePlugin: YouTubeNode not registered on editor');
        }
        return editor.registerCommand(exports.INSERT_YOUTUBE_COMMAND, (payload) => {
            const youTubeNode = (0, YouTubeNode_1.$createYouTubeNode)(payload);
            (0, utils_1.$insertNodeToNearestRoot)(youTubeNode);
            return true;
        }, lexical_1.COMMAND_PRIORITY_EDITOR);
    }, [editor]);
    return null;
}
exports.default = YouTubePlugin;
//# sourceMappingURL=index.js.map