import { getJsonContentFromValue } from './LexicalRichText/PayloadLexicalRichTextFieldComponent';
import { FieldHook } from 'payload/types';
import { RawImagePayload } from './LexicalRichText/nodes/ImageNode';
import { SerializedEditorState, SerializedLexicalNode } from 'lexical';
import { Payload } from 'payload';

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

export const populateLexicalRelationships: LexicalRichTextFieldAfterReadFieldHook =
  async ({
    value,
    req,
  }): Promise<{
    jsonContent: SerializedEditorState;
    preview: string;
    characters: number;
    words: number;
  }> => {
    const payload: Payload = req.payload;
    if (!value) {
      return value;
    }
    const jsonContent = getJsonContentFromValue(value);
    if (jsonContent && jsonContent.root && jsonContent.root.children) {
      const newChildren = [];
      for (let childNode of jsonContent.root.children) {
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
      locale: locale,
    });
  }catch(e){
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
  //TODO: Adjustable depth

  const foundDoc = await payload.findByID({
    collection: relationTo, // required
    id: value, // required
    depth: 2,
    locale: locale,
  });

  return foundDoc;
}
export async function traverseLexicalField(
  payload: Payload,
  node: SerializedLexicalNode,
  locale: string,
): Promise<SerializedLexicalNode> {
  //Find replacements
  if (node.type === 'upload') {
    const rawImagePayload: RawImagePayload = node['rawImagePayload'];
    //const extraAttributes: ExtraAttributes = node["extraAttributes"];
    const uploadData = await loadUploadData(payload, rawImagePayload, locale);
    if (uploadData) {
      node['data'] = uploadData;
    }
  } else if (
    node.type === 'link' &&
    node['linkType'] &&
    node['linkType'] === 'internal'
  ) {
    const doc: {
      value: string;
      relationTo: string;
    } = node['doc'];

    const foundDoc = await loadInternalLinkDocData(
      payload,
      doc.value,
      doc.relationTo,
      locale,
    );
    if (foundDoc) {
      node['doc']['data'] = foundDoc;
    }
  }

  //Run for its children
  if (node['children'] && node['children'].length > 0) {
    let newChildren = [];
    for (let childNode of node['children']) {
      newChildren.push(await traverseLexicalField(payload, childNode, locale));
    }
    node['children'] = newChildren;
  }

  return node;
}
