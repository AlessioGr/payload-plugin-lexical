"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.INSERT_TWEET_COMMAND = void 0;
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const TweetNode_1 = require("../nodes/TweetNode");
require("./index.scss");
exports.INSERT_TWEET_COMMAND = (0, lexical_1.createCommand)('INSERT_TWEET_COMMAND');
function TwitterPlugin() {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => {
        if (!editor.hasNodes([TweetNode_1.TweetNode])) {
            throw new Error('TwitterPlugin: TweetNode not registered on editor');
        }
        return editor.registerCommand(exports.INSERT_TWEET_COMMAND, (payload) => {
            const tweetNode = (0, TweetNode_1.$createTweetNode)(payload);
            (0, utils_1.$insertNodeToNearestRoot)(tweetNode);
            return true;
        }, lexical_1.COMMAND_PRIORITY_EDITOR);
    }, [editor]);
    return null;
}
exports.default = TwitterPlugin;
//# sourceMappingURL=index.js.map