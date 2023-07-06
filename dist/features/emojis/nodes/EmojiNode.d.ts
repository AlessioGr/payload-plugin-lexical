/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { EditorConfig, LexicalNode, NodeKey, SerializedTextNode, Spread } from 'lexical';
import './index.scss';
import { TextNode } from 'lexical';
export type SerializedEmojiNode = Spread<{
    className: string;
}, SerializedTextNode>;
export declare class EmojiNode extends TextNode {
    __className: string;
    static getType(): string;
    static clone(node: EmojiNode): EmojiNode;
    constructor(className: string, text: string, key?: NodeKey);
    createDOM(config: EditorConfig): HTMLElement;
    updateDOM(prevNode: TextNode, dom: HTMLElement, config: EditorConfig): boolean;
    static importJSON(serializedNode: SerializedEmojiNode): EmojiNode;
    exportJSON(): SerializedEmojiNode;
    getClassName(): string;
}
export declare function $isEmojiNode(node: LexicalNode | null | undefined): node is EmojiNode;
export declare function $createEmojiNode(className: string, emojiText: string): EmojiNode;
