/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/// <reference types="react" />
import type { EditorConfig, ElementFormatType, LexicalEditor, LexicalNode, NodeKey, Spread } from 'lexical';
import { DecoratorBlockNode, SerializedDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';
export type SerializedFigmaNode = Spread<{
    documentID: string;
}, SerializedDecoratorBlockNode>;
export declare class FigmaNode extends DecoratorBlockNode {
    __id: string;
    static getType(): string;
    static clone(node: FigmaNode): FigmaNode;
    static importJSON(serializedNode: SerializedFigmaNode): FigmaNode;
    exportJSON(): SerializedFigmaNode;
    constructor(id: string, format?: ElementFormatType, key?: NodeKey);
    updateDOM(): false;
    getId(): string;
    getTextContent(_includeInert?: boolean | undefined, _includeDirectionless?: false | undefined): string;
    decorate(_editor: LexicalEditor, config: EditorConfig): JSX.Element;
    isInline(): false;
}
export declare function $createFigmaNode(documentID: string): FigmaNode;
export declare function $isFigmaNode(node: FigmaNode | LexicalNode | null | undefined): node is FigmaNode;
