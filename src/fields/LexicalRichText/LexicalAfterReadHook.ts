import { type Config as GeneratedTypes } from 'payload/dist/generated-types';
import { type FieldHook } from 'payload/types';

import { type SerializedEditorState, type SerializedLexicalNode } from 'lexical';
import { type Payload } from 'payload';

import { getJsonContentFromValue } from './FieldComponent';
import { ImageNode, type RawImagePayload, type SerializedImageNode } from './nodes/ImageNode';
import { type SerializedLinkNode } from '../../features/linkplugin/nodes/LinkNodeModified';

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
): Promise<any> {
  let uploadData;
  try {
    uploadData = await payload.findByID({
      collection: rawImagePayload.relationTo, // required
      id: rawImagePayload.value.id, // required
      depth: 2,
      locale,
    });
  } catch (e) {
    console.warn(e);
    return null;
  }

  return uploadData;
}

async function loadInternalLinkDocData(
  payload: Payload,
  value: string,
  relationTo: string,
  locale: string
): Promise<GeneratedTypes> {
  // TODO: Adjustable depth

  const foundDoc = await payload.findByID({
    collection: relationTo, // required
    id: value, // required
    depth: 2,
    locale,
  });

  return foundDoc;
}
export async function traverseLexicalField(
  payload: Payload,
  node: SerializedLexicalNode & { children?: SerializedLexicalNode[] },
  locale: string
): Promise<SerializedLexicalNode> {
  // Find replacements
  if (node.type === 'upload') {
    const { rawImagePayload } = node as SerializedImageNode;
    // const extraAttributes: ExtraAttributes = node["extraAttributes"];
    const uploadData = await loadUploadData(payload, rawImagePayload, locale);
    if (uploadData != null) {
      (node as SerializedImageNode).data = uploadData;
    }
  } else if (
    node.type === 'link' &&
    (node as SerializedLinkNode).attributes.linkType != null &&
    (node as SerializedLinkNode).attributes.linkType === 'internal'
  ) {
    const { attributes } = node as SerializedLinkNode;
    const foundDoc = await loadInternalLinkDocData(
      payload,
      attributes?.doc?.value ?? '',
      attributes?.doc?.relationTo ?? '',
      locale
    );
    if (foundDoc != null && attributes?.doc?.data != null) {
      // TODO: not sure about this
      attributes.doc.data = foundDoc;
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
