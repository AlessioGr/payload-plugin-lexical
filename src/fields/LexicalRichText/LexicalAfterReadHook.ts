import type { Config as GeneratedTypes } from 'payload/dist/generated-types';
import type { FieldHook } from 'payload/types';

import { getJsonContentFromValue } from './FieldComponent';

import type { SerializedImageNode } from './nodes/ImageNode';
import type { SerializedInlineImageNode } from './nodes/InlineImageNode';
import type { SerializedLinkNode } from '../../features/linkplugin/nodes/LinkNodeModified';
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
  const jsonContent = getJsonContentFromValue(value);
  if (jsonContent?.root?.children != null) {
    const newChildren: SerializedLexicalNode[] = [];
    for (const childNode of jsonContent.root.children) {
      newChildren.push(await traverseLexicalField(payload, childNode, ''));
    }
    jsonContent.root.children = newChildren;
  }
  value.jsonContent = { ...jsonContent };

  return value;
};

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

// TODO: concurrency optimization? Promise.all and
// https://www.npmjs.com/package/p-map
export async function traverseLexicalField(
  payload: Payload,
  node: SerializedLexicalNode & { children?: SerializedLexicalNode[] },
  locale: string
): Promise<SerializedLexicalNode> {
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
  } else if (node.type === 'link') {
    const { attributes } = node as SerializedLinkNode;
    if (attributes?.doc?.value != null && attributes?.doc?.relationTo != null) {
      const relation = await loadRelated(
        payload,
        attributes.doc.value,
        attributes.doc.relationTo as keyof GeneratedTypes['collections'],
        1,
        locale
      );
      if (relation != null) {
        attributes.doc.data = relation;
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
  if (node.children != null && node.children.length > 0) {
    const newChildren: SerializedLexicalNode[] = [];
    for (const childNode of node.children) {
      newChildren.push(await traverseLexicalField(payload, childNode, locale));
    }
    node.children = newChildren;
  }

  return node;
}
