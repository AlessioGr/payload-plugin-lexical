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
export type SerializedYouTubeNode = Spread<{
    videoID: string;
}, SerializedDecoratorBlockNode>;
export declare class YouTubeNode extends DecoratorBlockNode {
    __id: string;
    static getType(): string;
    static clone(node: YouTubeNode): YouTubeNode;
    static importJSON(serializedNode: SerializedYouTubeNode): YouTubeNode;
    exportJSON(): SerializedYouTubeNode;
    constructor(id: string, format?: ElementFormatType, key?: NodeKey);
    exportDOM(): DOMExportOutput;
    static importDOM(): DOMConversionMap | null;
    updateDOM(): false;
    getId(): string;
    getTextContent(_includeInert?: boolean | undefined, _includeDirectionless?: false | undefined): string;
    decorate(_editor: LexicalEditor, config: EditorConfig): JSX.Element;
    isInline(): false;
}
export declare function $createYouTubeNode(videoID: string): YouTubeNode;
export declare function $isYouTubeNode(node: YouTubeNode | LexicalNode | null | undefined): node is YouTubeNode;
