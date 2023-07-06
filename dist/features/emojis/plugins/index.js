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
const EmojiNode_1 = require("../nodes/EmojiNode");
const emojis = new Map([
    [':)', ['emoji happysmile', '🙂']],
    [':D', ['emoji veryhappysmile', '😀']],
    [':(', ['emoji unhappysmile', '🙁']],
    ['<3', ['emoji heart', '❤']],
    ['🙂', ['emoji happysmile', '🙂']],
    ['😀', ['emoji veryhappysmile', '😀']],
    ['🙁', ['emoji unhappysmile', '🙁']],
    ['❤', ['emoji heart', '❤']],
]);
function findAndTransformEmoji(node) {
    const text = node.getTextContent();
    for (let i = 0; i < text.length; i++) {
        const emojiData = emojis.get(text[i]) || emojis.get(text.slice(i, i + 2));
        if (emojiData !== undefined) {
            const [emojiStyle, emojiText] = emojiData;
            let targetNode;
            if (i === 0) {
                [targetNode] = node.splitText(i + 2);
            }
            else {
                [, targetNode] = node.splitText(i, i + 2);
            }
            const emojiNode = (0, EmojiNode_1.$createEmojiNode)(emojiStyle, emojiText);
            targetNode.replace(emojiNode);
            return emojiNode;
        }
    }
    return null;
}
function textNodeTransform(node) {
    let targetNode = node;
    while (targetNode !== null) {
        if (!targetNode.isSimpleText()) {
            return;
        }
        targetNode = findAndTransformEmoji(targetNode);
    }
}
function useEmojis(editor) {
    (0, react_1.useEffect)(() => {
        if (!editor.hasNodes([EmojiNode_1.EmojiNode])) {
            throw new Error('EmojisPlugin: EmojiNode not registered on editor');
        }
        return editor.registerNodeTransform(lexical_1.TextNode, textNodeTransform);
    }, [editor]);
}
function EmojisPlugin() {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    useEmojis(editor);
    return null;
}
exports.default = EmojisPlugin;
//# sourceMappingURL=index.js.map