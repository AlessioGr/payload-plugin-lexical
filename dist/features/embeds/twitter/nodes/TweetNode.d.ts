/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/// <reference types="react" />
import type { DOMConversionMap, DOMExportOutput, EditorConfig, ElementFormatType, LexicalEditor, LexicalNode, NodeKey, Spread } from 'lexical';
import { DecoratorBlockNode, SerializedDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';
export type SerializedTweetNode = Spread<{
    id: string;
}, SerializedDecoratorBlockNode>;
export declare class TweetNode extends DecoratorBlockNode {
    __id: string;
    static getType(): string;
    static clone(node: TweetNode): TweetNode;
    static importJSON(serializedNode: SerializedTweetNode): TweetNode;
    exportJSON(): SerializedTweetNode;
    static importDOM(): DOMConversionMap<HTMLDivElement> | null;
    exportDOM(): DOMExportOutput;
    constructor(id: string, format?: ElementFormatType, key?: NodeKey);
    getId(): string;
    getTextContent(_includeInert?: boolean | undefined, _includeDirectionless?: false | undefined): string;
    decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element;
    static isInline(): false;
}
export declare function $createTweetNode(tweetID: string): TweetNode;
export declare function $isTweetNode(node: TweetNode | LexicalNode | null | undefined): node is TweetNode;
