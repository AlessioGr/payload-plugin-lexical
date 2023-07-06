import { FieldHook } from 'payload/types';
import { SerializedEditorState, SerializedLexicalNode } from 'lexical';
import { Payload } from 'payload';
type LexicalRichTextFieldAfterReadFieldHook = FieldHook<any, {
    jsonContent: SerializedEditorState;
    preview: string;
    characters: number;
    words: number;
}, any>;
export declare const populateLexicalRelationships: LexicalRichTextFieldAfterReadFieldHook;
export declare function traverseLexicalField(payload: Payload, node: SerializedLexicalNode & {
    children?: SerializedLexicalNode[];
}, locale: string): Promise<SerializedLexicalNode>;
export {};
