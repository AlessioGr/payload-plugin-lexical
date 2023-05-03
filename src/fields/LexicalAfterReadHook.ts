import { type FieldHook } from 'payload/types';

import { type SerializedEditorState, type SerializedLexicalNode } from 'lexical';
import { type Payload } from 'payload';

import {
  ImageNode,
  type RawImagePayload,
  type SerializedImageNode,
} from './LexicalRichText/nodes/ImageNode';
import { getJsonContentFromValue } from './LexicalRichText/PayloadLexicalRichTextFieldComponent';
import { type SerializedLinkNode } from '../features/linkplugin/nodes/LinkNodeModified';

type LexicalRichTextFieldAfterReadFieldHook = FieldHook<
  any,
  {
    jsonContent: SerializedEditorState;
    preview: string;
    characters: number;
    words: number;
  },
  any
>;

export const populateLexicalRelationships: LexicalRichTextFieldAfterReadFieldHook = async ({
  value,
  req,
}): Promise<{
    jsonContent: SerializedEditorState;
    preview: string;
    characters: number;
    words: number;
  }> => {
  const { payload } = req;
  if (value == null) {
    return value;
  }
  const jsonContent = getJsonContentFromValue(value);
  if (jsonContent && jsonContent.root && jsonContent.root.children) {
    const newChildren = [];
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
  locale: string,
) {
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
  locale: string,
) {
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
  locale: string,
): Promise<SerializedLexicalNode> {
  // Find replacements
  if (node.type === 'upload') {
    const { rawImagePayload } = node as SerializedImageNode;
    // const extraAttributes: ExtraAttributes = node["extraAttributes"];
    const uploadData = await loadUploadData(payload, rawImagePayload, locale);
    if (uploadData) {
      (node as SerializedImageNode).data = uploadData;
    }
  } else if (
    node.type === 'link'
    && (node as SerializedLinkNode).attributes.linkType
    && (node as SerializedLinkNode).attributes.linkType === 'internal'
  ) {
    const { attributes } = node as SerializedLinkNode;

    const foundDoc = await loadInternalLinkDocData(
      payload,
      attributes.doc.value,
      attributes.doc.relationTo,
      locale,
    );
    if (foundDoc) {
      (node as SerializedLinkNode).attributes.doc.data = foundDoc;
    }
  }

  // Run for its children
  if ((node.children != null) && node.children.length > 0) {
    const newChildren = [];
    for (const childNode of node.children) {
      newChildren.push(await traverseLexicalField(payload, childNode, locale));
    }
    node.children = newChildren;
  }

  return node;
}
