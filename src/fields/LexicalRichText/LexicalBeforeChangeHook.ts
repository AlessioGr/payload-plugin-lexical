import type { Config as GeneratedTypes } from 'payload/dist/generated-types';
import type { FieldHook } from 'payload/types';

import { getJsonContentFromValue } from './FieldComponent';

import type { SerializedInlineImageNode } from './nodes/InlineImageNode';
import type { SerializedLinkNode } from '../../features/linkplugin/nodes/LinkNodeModified';
import type { SerializedEditorState, SerializedLexicalNode } from 'lexical';
import type { Payload } from 'payload';

type LexicalRichTextFieldBeforeChangeFieldHook = FieldHook<
  any,
  {
    jsonContent: SerializedEditorState;
    preview: string;
    characters: number;
    words: number;
  } | null,
  any
>;

export const updateLexicalRelationships: LexicalRichTextFieldBeforeChangeFieldHook = async ({
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

// Note: Any internal links, and any node that has a nested lexical
// editor is handled here so that internal links can have their
// title and slug populated and stored within the main document.
// The LexicalAfterReadHook.tsx is still used to attached
// relationship documents dynamically on read/request (and
// of course NOT stored along with the parent document).
export async function traverseLexicalField(
  payload: Payload,
  node: SerializedLexicalNode & { children?: SerializedLexicalNode[] },
  locale: string
): Promise<void> {
  // TODO: if Upload captions are needed - add them here.
  if (node.type === 'inline-image') {
    const { caption } = node as SerializedInlineImageNode;
    if (caption?.editorState?.root?.children != null) {
      for (const childNode of caption.editorState.root.children) {
        await traverseLexicalField(payload, childNode, locale);
      }
    }
  } else if (
    node.type === 'link' &&
    (node as SerializedLinkNode).attributes.linkType != null &&
    (node as SerializedLinkNode).attributes.linkType === 'internal'
  ) {
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
        // TODO: revisit
        // I think these are the only properties we need to build a
        // link on the client - id, title, and slug. The collection slug is
        // already part of attributes?.doc?.relationTo
        // and so this should be everything that's needed - whether building
        // a complete URL, or a framework router link
        const { id, title, slug } = relation;
        attributes.doc.data = { id, title, slug };
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
