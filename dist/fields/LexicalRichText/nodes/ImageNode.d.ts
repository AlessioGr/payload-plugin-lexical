/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { DOMConversionMap, DOMExportOutput, EditorConfig, LexicalNode, SerializedLexicalNode, Spread } from 'lexical';
import { DecoratorNode } from 'lexical';
export interface RawImagePayload {
    value: {
        id: string;
    };
    relationTo: string;
}
export interface ExtraAttributes {
    widthOverride: undefined | number;
    heightOverride: undefined | number;
}
export type SerializedImageNode = Spread<{
    rawImagePayload: RawImagePayload;
    extraAttributes: ExtraAttributes;
    type: 'upload';
    version: 1;
}, SerializedLexicalNode>;
export declare class ImageNode extends DecoratorNode<JSX.Element> {
    __rawImagePayload: RawImagePayload;
    __extraAttributes: ExtraAttributes;
    static getType(): string;
    static clone(node: ImageNode): ImageNode;
    static importJSON(serializedNode: SerializedImageNode): ImageNode;
    exportDOM(): DOMExportOutput;
    static importDOM(): DOMConversionMap | null;
    constructor(rawImagePayload: RawImagePayload, extraAttributes: ExtraAttributes);
    exportJSON(): SerializedImageNode;
    setWidthAndHeightOverride(width: undefined | number, height: undefined | number): void;
    createDOM(config: EditorConfig): HTMLElement;
    updateDOM(): false;
    decorate(): JSX.Element;
}
export declare function $createImageNode(rawImagePayload: RawImagePayload, extraAttributes: ExtraAttributes): ImageNode;
export declare function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode;
