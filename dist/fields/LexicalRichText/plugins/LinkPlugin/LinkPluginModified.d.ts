/** @module @lexical/link */
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { DOMConversionMap, EditorConfig, GridSelection, LexicalCommand, LexicalNode, NodeKey, NodeSelection, RangeSelection, SerializedElementNode } from 'lexical';
import { ElementNode, Spread } from 'lexical';
export type PayloadLinkData = {
    payloadType?: string;
    url: string;
    linkType: 'custom' | 'internal';
    newTab: boolean;
    doc: {
        value: string;
        relationTo: string;
    } | null;
    fields?: any;
};
export type LinkAttributes = {
    rel?: null | string;
    newTab?: boolean;
    doc?: {
        value: string;
        relationTo: string;
    } | null;
    linkType?: 'custom' | 'internal';
};
export type SerializedLinkNode = Spread<{
    type: 'link';
    url: string;
    version: 1;
}, Spread<LinkAttributes, SerializedElementNode>>;
/** @noInheritDoc */
export declare class LinkNode extends ElementNode {
    /** @internal */
    __url: string;
    /** @internal */
    __newTab: boolean;
    /** @internal */
    __doc: {
        value: string;
        relationTo: string;
    } | null;
    /** @internal */
    __linkType: 'custom' | 'internal';
    /** @internal */
    __rel: null | string;
    static getType(): string;
    static clone(node: LinkNode): LinkNode;
    constructor(url: string, attributes?: LinkAttributes, key?: NodeKey);
    createDOM(config: EditorConfig): HTMLAnchorElement;
    updateDOM(prevNode: LinkNode, anchor: HTMLAnchorElement, config: EditorConfig): boolean;
    static importDOM(): DOMConversionMap | null;
    static importJSON(serializedNode: SerializedLinkNode | SerializedAutoLinkNode): LinkNode;
    exportJSON(): SerializedLinkNode | SerializedAutoLinkNode;
    getURL(): string;
    setURL(url: string): void;
    isNewTab(): boolean;
    setNewTab(newTab: boolean): void;
    getDoc(): {
        value: string;
        relationTo: string;
    } | null;
    setDoc(doc: {
        value: string;
        relationTo: string;
    } | null): void;
    getLinkType(): 'custom' | 'internal';
    setLinkType(linkType: 'custom' | 'internal'): void;
    getRel(): null | string;
    setRel(rel: null | string): void;
    insertNewAfter(selection: RangeSelection): null | ElementNode;
    canInsertTextBefore(): false;
    canInsertTextAfter(): false;
    canBeEmpty(): false;
    isInline(): true;
    extractWithChild(child: LexicalNode, selection: RangeSelection | NodeSelection | GridSelection, destination: 'clone' | 'html'): boolean;
}
export declare function $createLinkNode(url: string, attributes?: LinkAttributes): LinkNode;
export declare function $isLinkNode(node: LexicalNode | null | undefined): node is LinkNode;
export type SerializedAutoLinkNode = Spread<{
    type: 'autolink';
    version: 1;
}, SerializedLinkNode>;
export declare class AutoLinkNode extends LinkNode {
    static getType(): string;
    static clone(node: AutoLinkNode): AutoLinkNode;
    static importJSON(serializedNode: SerializedAutoLinkNode): AutoLinkNode;
    static importDOM(): null;
    exportJSON(): SerializedAutoLinkNode;
    insertNewAfter(selection: RangeSelection): null | ElementNode;
}
export declare function $createAutoLinkNode(url: string, attributes?: LinkAttributes): AutoLinkNode;
export declare function $isAutoLinkNode(node: LexicalNode | null | undefined): node is AutoLinkNode;
export declare const TOGGLE_LINK_COMMAND: LexicalCommand<string | ({
    url: string;
} & LinkAttributes) | null>;
export declare function toggleLink(linkData: PayloadLinkData): void;
