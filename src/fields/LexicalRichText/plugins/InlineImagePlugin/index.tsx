/**
 * Some of the code below is copyright (c) Meta Platforms, Inc.
 * and affiliates and is based on examples found here
 * https://github.com/facebook/lexical/tree/main/packages/lexical-playground
 *  - in particular the ImagesPlugin
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import { useEffect } from 'react';

import { formatDrawerSlug } from 'payload/dist/admin/components/elements/Drawer/index';
import { useEditDepth } from 'payload/dist/admin/components/utilities/EditDepth/index';

import { useModal } from '@faceless-ui/modal';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $createRangeSelection,
  $getSelection,
  $insertNodes,
  $isNodeSelection,
  $isRootOrShadowRoot,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DRAGOVER_COMMAND,
  DRAGSTART_COMMAND,
  DROP_COMMAND,
  type LexicalCommand,
  type LexicalEditor,
  COMMAND_PRIORITY_NORMAL,
} from 'lexical';

import { useEditorConfigContext } from '../../EditorConfigProvider';
import {
  $createInlineImageNode,
  $isInlineImageNode,
  InlineImageNode,
} from '../../nodes/InlineImageNode';
import { CAN_USE_DOM } from '../../shared/canUseDOM';
import { InlineImageModal } from './InlineImageModal';
import { getPreferredSize } from './utils';

import type { InlineImageNodePayload } from '../../nodes/InlineImageNode/types';
import type { InlineImageModalPayload } from './types';

export type InsertInlineImagePayload = Readonly<InlineImageNodePayload>;

const getDOMSelection = (targetWindow: Window | null): Selection | null =>
  CAN_USE_DOM ? (targetWindow ?? window).getSelection() : null;

export const OPEN_INLINE_IMAGE_MODAL_COMMAND: LexicalCommand<null> = createCommand(
  'OPEN_INLINE_IMAGE_MODAL_COMMAND'
);

export const INSERT_INLINE_IMAGE_COMMAND: LexicalCommand<InlineImageNodePayload> = createCommand(
  'INSERT_INLINE_IMAGE_COMMAND'
);

export default function InlineImagePlugin({ collection }: { collection: string }): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const { uuid } = useEditorConfigContext();
  const editDepth = useEditDepth();

  const {
    toggleModal = () => {
      console.error('Error: useModal() from FacelessUI did not work correctly');
    },
    closeModal,
  } = useModal();

  const inlineImageDrawerSlug = formatDrawerSlug({
    slug: `lexicalRichText-inline-image-insert-${uuid}`,
    depth: editDepth,
  });

  useEffect(() => {
    if (!editor.hasNodes([InlineImageNode])) {
      throw new Error('InlineImagePlugin: InlineImageNode not registered on editor');
    }

    return mergeRegister(
      // TODO: possibly register this command with insert and edit options?
      editor.registerCommand<null>(
        OPEN_INLINE_IMAGE_MODAL_COMMAND,
        () => {
          if (inlineImageDrawerSlug != null) {
            toggleModal(inlineImageDrawerSlug);
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_NORMAL
      ),

      editor.registerCommand<InsertInlineImagePayload>(
        INSERT_INLINE_IMAGE_COMMAND,
        (payload: InlineImageNodePayload) => {
          const imageNode = $createInlineImageNode(payload);
          $insertNodes([imageNode]);
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),

      editor.registerCommand<DragEvent>(
        DRAGSTART_COMMAND,
        (event) => {
          return onDragStart(event);
        },
        COMMAND_PRIORITY_HIGH
      ),

      editor.registerCommand<DragEvent>(
        DRAGOVER_COMMAND,
        (event) => {
          return onDragover(event);
        },
        COMMAND_PRIORITY_LOW
      ),

      editor.registerCommand<DragEvent>(
        DROP_COMMAND,
        (event) => {
          return onDrop(event, editor);
        },
        COMMAND_PRIORITY_HIGH
      )
    );
  }, [editor]);

  const handleInsertImage = ({
    doc,
    altText,
    position,
    showCaption,
  }: InlineImageModalPayload): void => {
    const size = position === 'full' ? 'medium' : 'small';
    const imageSource = getPreferredSize(size, doc);
    if (imageSource != null) {
      const imagePayload: InlineImageNodePayload = {
        id: doc.id as string,
        collection,
        src: imageSource.url,
        position,
        altText,
        showCaption,
      };

      // We don't set width or height for SVG images
      if (imageSource.width != null) {
        imagePayload.width = imageSource.width;
      }

      if (imageSource.height != null) {
        imagePayload.height = imageSource.height;
      }

      editor.dispatchCommand(INSERT_INLINE_IMAGE_COMMAND, imagePayload);
    } else {
      console.error('Error: unable to find image source from document.');
    }
    closeModal(inlineImageDrawerSlug);
  };

  return (
    <InlineImageModal
      drawerSlug={inlineImageDrawerSlug}
      collection={collection}
      docID=""
      onSubmit={handleInsertImage}
    />
  );
}

const TRANSPARENT_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

let img;
if (typeof document !== 'undefined') {
  img = document?.createElement('img');
  img.src = TRANSPARENT_IMAGE;
}

function onDragStart(event: DragEvent): boolean {
  const node = getImageNodeInSelection();
  if (node == null) {
    return false;
  }
  const dataTransfer = event.dataTransfer;
  if (dataTransfer == null) {
    return false;
  }
  dataTransfer.setData('text/plain', '_');
  dataTransfer.setDragImage(img, 0, 0);
  dataTransfer.setData(
    'application/x-lexical-drag',
    JSON.stringify({
      data: {
        altText: node.__altText,
        caption: node.__caption,
        height: node.__height,
        key: node.getKey(),
        showCaption: node.__showCaption,
        src: node.__src,
        width: node.__width,
      },
      type: 'image',
    })
  );

  return true;
}

function onDragover(event: DragEvent): boolean {
  const node = getImageNodeInSelection();
  if (node == null) {
    return false;
  }
  if (!canDropImage(event)) {
    event.preventDefault();
  }
  return true;
}

function onDrop(event: DragEvent, editor: LexicalEditor): boolean {
  const node = getImageNodeInSelection();
  if (node == null) {
    return false;
  }
  const data = getDragImageData(event);
  if (data == null) {
    return false;
  }
  event.preventDefault();
  if (canDropImage(event)) {
    const range = getDragSelection(event);
    node.remove();
    const rangeSelection = $createRangeSelection();
    if (range !== null && range !== undefined) {
      rangeSelection.applyDOMRange(range);
    }
    $setSelection(rangeSelection);
    editor.dispatchCommand(INSERT_INLINE_IMAGE_COMMAND, data);
  }
  return true;
}

function getImageNodeInSelection(): InlineImageNode | null {
  const selection = $getSelection();
  if (!$isNodeSelection(selection)) {
    return null;
  }
  const nodes = selection.getNodes();
  const node = nodes[0];
  return $isInlineImageNode(node) ? node : null;
}

function getDragImageData(event: DragEvent): null | InsertInlineImagePayload {
  const dragData = event.dataTransfer?.getData('application/x-lexical-drag');
  if (dragData == null) {
    return null;
  }
  const { type, data } = JSON.parse(dragData);
  if (type !== 'image') {
    return null;
  }

  return data;
}

declare global {
  interface DragEvent {
    rangeOffset?: number;
    rangeParent?: Node;
  }
}

function canDropImage(event: DragEvent): boolean {
  const target = event.target;
  return !!(
    target != null &&
    target instanceof HTMLElement &&
    target.closest('code, span.editor-image') == null &&
    target.parentElement != null &&
    target.parentElement.closest('div.ContentEditable__root') != null
  );
}

function getDragSelection(event: DragEvent): Range | null | undefined {
  let range;
  const target = event.target as null | Element | Document;
  const targetWindow =
    target == null
      ? null
      : target.nodeType === 9
      ? (target as Document).defaultView
      : (target as Element).ownerDocument.defaultView;
  const domSelection = getDOMSelection(targetWindow);
  if (document.caretRangeFromPoint != null) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY);
  } else if (event.rangeParent != null && domSelection !== null) {
    domSelection.collapse(event.rangeParent, event.rangeOffset ?? 0);
    range = domSelection.getRangeAt(0);
  } else {
    throw Error('Cannot get the selection when dragging');
  }

  return range;
}
