import { getJsonContentFromValue } from './LexicalRichText/PayloadLexicalRichTextFieldComponent';
import payload from "payload";
import { FieldHook } from "payload/types";
import { RawImagePayload } from './LexicalRichText/nodes/ImageNode';
import {
    SerializedEditorState,
    SerializedLexicalNode,
  } from "lexical";



type LexicalRichTextFieldAfterReadFieldHook = FieldHook<any, {jsonContent: SerializedEditorState, preview: string, characters: number, words: number}, any>;

//I cannot put this in LexicalRichText/index as that causes an error => https://github.com/payloadcms/payload/issues/1518
export const populateLexicalRelationships: LexicalRichTextFieldAfterReadFieldHook = async ({value, req}): Promise<{jsonContent: SerializedEditorState, preview: string, characters: number, words: number}> =>  {
    if(!value) {
        return value;
    }
    const jsonContent = getJsonContentFromValue(value);
    if(jsonContent && jsonContent.root && jsonContent.root.children){
        const newChildren = [];
        for(let childNode of jsonContent.root.children){
            newChildren.push(await traverseLexicalField(childNode, ""));
        }
        jsonContent.root.children = newChildren;
     }
     value.jsonContent = {...jsonContent};

    return value;
};










async function loadUploadData(
  rawImagePayload: RawImagePayload,
  locale: string
) {
  const foundUpload = await payload.findByID({
    collection: rawImagePayload.relationTo, // required
    id: rawImagePayload.value.id, // required
    depth: 2,
    locale: locale,
  });

  return foundUpload;
}

async function loadInternalLinkDocData(
  value: string,
  relationTo: string,
  locale: string
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
  node: SerializedLexicalNode,
  locale: string
): Promise<SerializedLexicalNode> {
  //Find replacements
  if (node.type === "upload") {
    const rawImagePayload: RawImagePayload = node["rawImagePayload"];
    //const extraAttributes: ExtraAttributes = node["extraAttributes"];
    const uploadData = await loadUploadData(rawImagePayload, locale);
    if (uploadData) {
      node["data"] = uploadData;
    }
  } else if (
    node.type === "link" &&
    node["linkType"] &&
    node["linkType"] === "internal"
  ) {
    const doc: {
      value: string;
      relationTo: string;
    } = node["doc"];

    const foundDoc = await loadInternalLinkDocData(
      doc.value,
      doc.relationTo,
      locale
    );
    if (foundDoc) {
      node["doc"]["data"] = foundDoc;
    }
  }

  //Run for its children
  if (node["children"] && node["children"].length > 0) {
    let newChildren = [];
    for (let childNode of node["children"]) {
      newChildren.push(await traverseLexicalField(childNode, locale));
    }
    node["children"] = newChildren;
  }

  return node;
}
