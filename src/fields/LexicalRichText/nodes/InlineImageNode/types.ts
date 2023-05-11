import type { LexicalEditor, NodeKey } from 'lexical';

export type Position = 'left' | 'right' | 'full' | undefined;

export interface InlineImageNodePayload {
  id: string;
  collection: string;
  src: string;
  altText: string;
  position?: Position;
  height?: number | string;
  width?: number | string;
  key?: NodeKey;
  showCaption?: boolean;
  caption?: LexicalEditor;
}
