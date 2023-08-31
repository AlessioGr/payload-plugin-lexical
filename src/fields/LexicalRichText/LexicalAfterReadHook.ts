import type { Config as GeneratedTypes } from 'payload/generated-types';
import type { FieldHook } from 'payload/types';

import { getJsonContentFromValue } from './FieldComponent';

import type { SerializedImageNode } from './nodes/ImageNode';
import type { SerializedInlineImageNode } from './nodes/InlineImageNode';
import type { SerializedEditorState, SerializedLexicalNode } from 'lexical';
import type { Payload } from 'payload';

// TODO - types and error handling?
// TODO - is depth working?

type LexicalRichTextFieldAfterReadFieldHook = FieldHook<
  any,
  {
    jsonContent: SerializedEditorState;
    preview: string;
    characters: number;
    words: number;
  } | null,
  any
>;

export const populateLexicalRelationships: LexicalRichTextFieldAfterReadFieldHook = async ({
  data,
  value,
  req,
}): Promise<null | {
  jsonContent: SerializedEditorState;
  preview: string;
  characters: number;
  words: number;
}> => {
  const { payload } = req;

  if (value == null) {
    return null;
  }

  // console.log(`populateLexicalRelationships called for: ${data?.id} ${data?.title}`);

  // NOTE: we're modifying the props on jsonContent and
  // so not sure that the newChildren clone was needed here.
  const jsonContent = getJsonContentFromValue(value);
  if (jsonContent?.root?.children != null) {
    for (const childNode of jsonContent.root.children) {
      await traverseLexicalField(payload, childNode, '');
    }
  }

  return value;
};

// Note: see the comments in LexicalBeforeChangeHook.tsx
// Internal links are processed there.
// In this afterRead hook we only process complete document
// relationships.
export async function traverseLexicalField(
  payload: Payload,
  node: SerializedLexicalNode & { children?: SerializedLexicalNode[] },
  locale: string
): Promise<void> {
  // Find replacements
  if (node.type === 'upload') {
    const { rawImagePayload } = node as SerializedImageNode;
    // const extraAttributes: ExtraAttributes = node["extraAttributes"];
    if (rawImagePayload?.relationTo != null && rawImagePayload?.value?.id != null) {
      const relation = await loadRelated(
        payload,
        rawImagePayload.value.id,
        rawImagePayload.relationTo as keyof GeneratedTypes['collections'],
        1,
        locale
      );
      if (relation != null) {
        (node as SerializedImageNode).data = relation;
      }
    }
  } else if (node.type === 'inline-image') {
    const { doc } = node as SerializedInlineImageNode;
    if (doc?.value != null && doc?.relationTo != null) {
      const relation = await loadRelated(
        payload,
        doc.value,
        doc.relationTo as keyof GeneratedTypes['collections'],
        1,
        locale
      );
      if (relation != null) {
        (node as SerializedInlineImageNode).doc.data = relation;
      }
    }
  }

  // Run for its children
  // NOTE: we're modifying the props on jsonContent and
  // so not sure that the newChildren clone was needed here.
  if (node.children != null && node.children.length > 0) {
    for (const childNode of node.children) {
      await traverseLexicalField(payload, childNode, locale);
    }
  }
}

async function loadRelated<T extends keyof GeneratedTypes['collections']>(
  payload: Payload,
  value: string,
  relationTo: T,
  depth: number,
  locale: string
): Promise<Partial<GeneratedTypes['collections'][T]> | null> {
  // TODO: Adjustable depth
  try {
    const relatedDoc = await payload.findByID({
      collection: relationTo, // required
      id: value, // required
      depth,
      locale,
    });
    return relatedDoc;
  } catch (e) {
    console.error(e);
    return null;
  }
}
