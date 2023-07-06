/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/// <reference types="react" />
import { DOMConversionMap, DOMExportOutput, EditorConfig, LexicalNode, SerializedLexicalNode, Spread, LexicalEditor, SerializedEditor, DecoratorNode } from 'lexical';
export interface RawImagePayload {
    value: {
        id: string;
    };
    relationTo: string;
}
export interface ImagePayload {
    rawImagePayload: RawImagePayload;
    caption?: LexicalEditor;
    showCaption?: boolean;
    captionsEnabled?: boolean;
}
export interface ExtraAttributes {
    widthOverride: undefined | number;
    heightOverride: undefined | number;
}
export type SerializedImageNode = Spread<{
    rawImagePayload: RawImagePayload;
    extraAttributes: ExtraAttributes;
    caption: SerializedEditor;
    showCaption: boolean;
    data?: any;
}, SerializedLexicalNode>;
export declare class ImageNode extends DecoratorNode<JSX.Element> {
    __rawImagePayload: RawImagePayload;
    __extraAttributes: ExtraAttributes;
    __showCaption: boolean;
    __caption: LexicalEditor;
    __captionsEnabled: boolean;
    static getType(): string;
    static clone(node: ImageNode): ImageNode;
    exportDOM(): DOMExportOutput;
    static importDOM(): DOMConversionMap | null;
    constructor(rawImagePayload: RawImagePayload, extraAttributes: ExtraAttributes, showCaption?: boolean, caption?: LexicalEditor, captionsEnabled?: boolean);
    static importJSON(serializedNode: SerializedImageNode): ImageNode;
    exportJSON(): SerializedImageNode;
    setWidthAndHeightOverride(width: undefined | number, height: undefined | number): void;
    setShowCaption(showCaption: boolean): void;
    createDOM(config: EditorConfig): HTMLElement;
    updateDOM(): false;
    decorate(): JSX.Element;
}
export declare function $createImageNode(rawImagePayload: RawImagePayload, extraAttributes: ExtraAttributes, showCaption: any, caption: any, captionsEnabled: any): ImageNode;
export declare function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode;
