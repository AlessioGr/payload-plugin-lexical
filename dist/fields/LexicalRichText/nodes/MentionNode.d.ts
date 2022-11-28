/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { Spread } from 'lexical';
import { type DOMConversionMap, type DOMExportOutput, type EditorConfig, type LexicalNode, type NodeKey, type SerializedTextNode, TextNode } from 'lexical';
export type SerializedMentionNode = Spread<{
    mentionName: string;
    type: 'mention';
    version: 1;
}, SerializedTextNode>;
export declare class MentionNode extends TextNode {
    __mention: string;
    static getType(): string;
    static clone(node: MentionNode): MentionNode;
    static importJSON(serializedNode: SerializedMentionNode): MentionNode;
    constructor(mentionName: string, text?: string, key?: NodeKey);
    exportJSON(): SerializedMentionNode;
    createDOM(config: EditorConfig): HTMLElement;
    exportDOM(): DOMExportOutput;
    static importDOM(): DOMConversionMap | null;
    isTextEntity(): true;
}
export declare function $createMentionNode(mentionName: string): MentionNode;
export declare function $isMentionNode(node: LexicalNode | null | undefined): node is MentionNode;
