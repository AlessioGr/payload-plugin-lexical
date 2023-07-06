import { ElementNode, LexicalNode, RangeSelection } from 'lexical';
import { LinkAttributes, LinkNode, SerializedLinkNode } from './LinkNodeModified';
export type SerializedAutoLinkNode = SerializedLinkNode;
export declare class AutoLinkNode extends LinkNode {
    static getType(): string;
    static clone(node: AutoLinkNode): AutoLinkNode;
    static importJSON(serializedNode: SerializedAutoLinkNode): AutoLinkNode;
    static importDOM(): null;
    exportJSON(): SerializedAutoLinkNode;
    insertNewAfter(selection: RangeSelection, restoreSelection?: boolean): null | ElementNode;
}
export declare function $createAutoLinkNode({ attributes, }: {
    attributes?: LinkAttributes;
}): AutoLinkNode;
export declare function $isAutoLinkNode(node: LexicalNode | null | undefined): node is AutoLinkNode;
