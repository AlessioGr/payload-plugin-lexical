import type { Position } from '../../nodes/InlineImageNode/types';

export interface InlineImageModalPayload {
  doc: Record<string, unknown>;
  collectionSlug: string;
  altText: string;
  position: Position;
  showCaption: boolean;
}
