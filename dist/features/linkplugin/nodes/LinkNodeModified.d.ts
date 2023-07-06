/** @module @lexical/link */
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { DOMConversionMap, EditorConfig, GridSelection, LexicalCommand, LexicalNode, NodeKey, NodeSelection, RangeSelection, SerializedElementNode, ElementNode, Spread } from 'lexical';
import { SerializedAutoLinkNode } from './AutoLinkNodeModified';
export type LinkAttributes = {
    url?: string;
    rel?: null | string;
    newTab?: boolean;
    sponsored?: boolean;
    nofollow?: boolean;
    doc?: {
        value: string;
        relationTo: string;
        data?: any;
    } | null;
    linkType?: 'custom' | 'internal';
};
export type SerializedLinkNode = Spread<{
    attributes: LinkAttributes;
}, SerializedElementNode>;
/** @noInheritDoc */
export declare class LinkNode extends ElementNode {
    __attributes: LinkAttributes;
    static getType(): string;
    static clone(node: LinkNode): LinkNode;
    constructor({ attributes, key, }: {
        attributes: LinkAttributes;
        key?: NodeKey;
    });
    createDOM(config: EditorConfig): HTMLAnchorElement;
    updateDOM(prevNode: LinkNode, anchor: HTMLAnchorElement, config: EditorConfig): boolean;
    static importDOM(): DOMConversionMap | null;
    static importJSON(serializedNode: SerializedLinkNode | SerializedAutoLinkNode): LinkNode;
    sanitizeUrl(url: string): string;
    exportJSON(): SerializedLinkNode | SerializedAutoLinkNode;
    getAttributes(): LinkAttributes;
    setAttributes(attributes: LinkAttributes): void;
    insertNewAfter(selection: RangeSelection, restoreSelection?: boolean): null | ElementNode;
    canInsertTextBefore(): false;
    canInsertTextAfter(): false;
    canBeEmpty(): false;
    isInline(): true;
    extractWithChild(child: LexicalNode, selection: RangeSelection | NodeSelection | GridSelection, destination: 'clone' | 'html'): boolean;
}
export declare function $createLinkNode({ attributes, }: {
    attributes?: LinkAttributes;
}): LinkNode;
export declare function $isLinkNode(node: LexicalNode | null | undefined): node is LinkNode;
export declare const TOGGLE_LINK_COMMAND: LexicalCommand<LinkAttributes | null>;
export declare function toggleLink(linkAttributes: LinkAttributes & {
    text?: string;
}): void;
