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

// A little dangerous - if there was any possibility of this
// being set, and then not 'unset' all afterRead hooks
// would be blocked.
let hookInitiator: string | undefined;
// let traverseCount = 0;

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

  // When draft revisions are enabled - we'll get an 'afterRead' hook for
  // each revision although data.id will be undefined.
  if (data?.id == null) {
    return value;
  }

  // set the hook initiator in a global value above
  if (hookInitiator == null && data?.id != null) {
    hookInitiator = data.id;
    // console.log('Intiator set to: ', hookInitiator);
  }

  // block any other afterRead hooks - preventing
  // infinite recursion of internal link resolution
  if (hookInitiator != null && data?.id != null) {
    if (hookInitiator !== data.id) {
      // console.log(`Non-initiator was blocked: ${data.id} ${data.title}`);
      return value;
    }
  }

  // NOTE: we're modifying the props on jsonContent and
  // so not sure that the newChildren clone was needed here.
  const jsonContent = getJsonContentFromValue(value);
  if (jsonContent?.root?.children != null) {
    for (const childNode of jsonContent.root.children) {
      await traverseLexicalField(payload, childNode, '');
    }
  }

  // if we made it this far our hook initiator completed
  // so unset the guard
  hookInitiator = undefined;
  // console.log('Hook initiator unset');

  return value;
};

export async function traverseLexicalField(
  payload: Payload,
  node: SerializedLexicalNode & { children?: SerializedLexicalNode[] },
  locale: string
): Promise<void> {
  // Find replacements
  // traverseCount += 1;
  // console.log('Traverse count: ', traverseCount);
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
