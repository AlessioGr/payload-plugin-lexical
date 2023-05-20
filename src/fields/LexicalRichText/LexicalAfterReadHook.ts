import type { Config as GeneratedTypes } from 'payload/dist/generated-types';
import type { FieldHook } from 'payload/types';

import { getJsonContentFromValue } from './FieldComponent';

import type { RawImagePayload, SerializedImageNode } from './nodes/ImageNode';
import type { SerializedInlineImageNode } from './nodes/InlineImageNode';
import type { SerializedLinkNode } from '../../features/linkplugin/nodes/LinkNodeModified';
import type { SerializedEditorState, SerializedLexicalNode } from 'lexical';
import type { Payload } from 'payload';

// TODO - types and error handling?

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

async function loadUploadData(
  payload: Payload,
  rawImagePayload: RawImagePayload,
  locale: string
): Promise<GeneratedTypes | null> {
  // TODO: Adjustable depth
  try {
    const doc = await payload.findByID({
      collection: rawImagePayload.relationTo, // required
      id: rawImagePayload.value.id, // required
      depth: 2,
      locale,
    });
    return doc;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function loadInternalLinkDocData(
  payload: Payload,
  value: string,
  relationTo: string,
  locale: string
): Promise<GeneratedTypes | null> {
  // TODO: Adjustable depth
  try {
    const doc = await payload.findByID({
      collection: relationTo, // required
      id: value, // required
      depth: 2,
      locale,
    });
    return doc;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function loadInlineImageData(
  payload: Payload,
  value: string,
  relationTo: string,
  locale: string
): Promise<GeneratedTypes | null> {
  // TODO: Adjustable depth
  try {
    const doc = await payload.findByID({
      collection: relationTo, // required
      id: value, // required
      depth: 2,
      locale,
    });
    return doc;
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
      const data = await loadUploadData(payload, rawImagePayload, locale);
      if (data != null) {
        (node as SerializedImageNode).data = data;
      }
    }
  } else if (
    node.type === 'link' &&
    (node as SerializedLinkNode).attributes.linkType != null &&
    (node as SerializedLinkNode).attributes.linkType === 'internal'
  ) {
    const { attributes } = node as SerializedLinkNode;
    if (attributes?.doc?.value != null && attributes?.doc?.relationTo != null) {
      const data = await loadInternalLinkDocData(
        payload,
        attributes.doc.value,
        attributes.doc.relationTo,
        locale
      );
      if (data != null && attributes?.doc?.data != null) {
        // TODO: not sure about this
        attributes.doc.data = data;
      }
    }
  } else if (node.type === 'inline-image') {
    const { doc } = node as SerializedInlineImageNode;
    if (doc?.value != null && doc?.relationTo != null) {
      const data = await loadInlineImageData(payload, doc.value, doc.relationTo, locale);
      if (data != null) {
        (node as SerializedInlineImageNode).doc.data = data;
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
