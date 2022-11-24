/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/// <reference types="react" />
import type { DOMConversionMap, DOMExportOutput, EditorConfig, LexicalEditor, LexicalNode, NodeKey, SerializedEditor, SerializedLexicalNode, Spread } from 'lexical';
import { DecoratorNode } from 'lexical';
export interface ImagePayload {
    altText: string;
    caption?: LexicalEditor;
    height?: number;
    key?: NodeKey;
    maxWidth?: number;
    showCaption?: boolean;
    src: string;
    width?: number;
    captionsEnabled?: boolean;
}
export interface RawImagePayload {
    type: string;
    value: {
        id: string;
    };
    relationTo: string;
}
export type SerializedImageNode = Spread<{
    altText: string;
    caption: SerializedEditor;
    height?: number;
    maxWidth: number;
    showCaption: boolean;
    src: string;
    width?: number;
    type: 'image';
    version: 1;
}, SerializedLexicalNode>;
export declare class ImageNode extends DecoratorNode<JSX.Element> {
    __src: string;
    __altText: string;
    __width: 'inherit' | number;
    __height: 'inherit' | number;
    __maxWidth: number;
    __showCaption: boolean;
    __caption: LexicalEditor;
    __captionsEnabled: boolean;
    static getType(): string;
    static clone(node: ImageNode): ImageNode;
    static importJSON(serializedNode: SerializedImageNode): ImageNode;
    exportDOM(): DOMExportOutput;
    static importDOM(): DOMConversionMap | null;
    constructor(src: string, altText: string, maxWidth: number, width?: 'inherit' | number, height?: 'inherit' | number, showCaption?: boolean, caption?: LexicalEditor, captionsEnabled?: boolean, key?: NodeKey);
    exportJSON(): SerializedImageNode;
    setWidthAndHeight(width: 'inherit' | number, height: 'inherit' | number): void;
    setShowCaption(showCaption: boolean): void;
    createDOM(config: EditorConfig): HTMLElement;
    updateDOM(): false;
    getSrc(): string;
    getAltText(): string;
    decorate(): JSX.Element;
}
export declare function $createImageNode({ altText, height, maxWidth, captionsEnabled, src, width, showCaption, caption, key, }: ImagePayload): ImageNode;
export declare function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode;
