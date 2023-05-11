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
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';

import { formatDrawerSlug } from 'payload/dist/admin/components/elements/Drawer';
import { useEditDepth } from 'payload/dist/admin/components/utilities/EditDepth';

import { useModal } from '@faceless-ui/modal';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import cx from 'classnames';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DRAGSTART_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';

import { $isInlineImageNode } from './InlineImageNode';
import FloatingLinkEditorPlugin from '../../../../features/linkplugin/floatingLinkEditor/index';
import LinkPlugin from '../../../../features/linkplugin/plugins/link/';
import { useSharedHistoryContext } from '../../context/SharedHistoryContext';
import { useEditorConfigContext } from '../../EditorConfigProvider';
import FloatingTextFormatToolbarPlugin from '../../plugins/FloatingTextFormatToolbarPlugin/index';
import { InlineImageModal } from '../../plugins/InlineImagePlugin/InlineImageModal';
import { getPreferredSize } from '../../plugins/InlineImagePlugin/utils';
import ContentEditable from '../../ui/ContentEditable';
import Placeholder from '../../ui/Placeholder';

import type { InlineImageNode } from './InlineImageNode';
import type { Position, InlineImageNodePayload } from './types';
import type { InlineImageModalPayload } from '../../plugins/InlineImagePlugin/types';
import type { GridSelection, LexicalEditor, NodeKey, NodeSelection, RangeSelection } from 'lexical';

import './InlineImageNodeComponent.css';

const imageCache = new Set();

async function useSuspenseImage(src: string): Promise<void> {
  if (!imageCache.has(src)) {
    await new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageCache.add(src);
        resolve(null);
      };
    });
  }
}

function LazyImage({
  id,
  collection,
  src,
  position,
  altText,
  className,
  imageRef,
  width,
  height,
}: {
  id: string;
  collection: string;
  src: string;
  position: Position;
  altText: string;
  className?: string;
  height?: number | string;
  width?: number | string;
  imageRef: { current: null | HTMLImageElement };
}): JSX.Element {
  void useSuspenseImage(src);
  return (
    <img
      className={className}
      src={src}
      alt={altText}
      ref={imageRef}
      width={width}
      height={height}
      data-id={id}
      data-collection={collection}
      data-position={position}
      style={{
        display: 'block',
      }}
      draggable="false"
    />
  );
}

export default function InlineImageComponent({
  id,
  collection,
  src,
  position,
  altText,
  width,
  height,
  showCaption,
  caption,
  nodeKey,
}: {
  id: string;
  collection: string;
  src: string;
  position: Position;
  altText: string;
  height?: number | string;
  width?: number | string;
  showCaption: boolean;
  caption: LexicalEditor;
  nodeKey: NodeKey;
}): JSX.Element {
  const { uuid, editorConfig } = useEditorConfigContext();
  const [editor] = useLexicalComposerContext();
  const { historyState } = useSharedHistoryContext();
  const editDepth = useEditDepth();
  const imageRef = useRef<null | HTMLImageElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [selection, setSelection] = useState<RangeSelection | NodeSelection | GridSelection | null>(
    null
  );
  const editorState = editor.getEditorState();
  const activeEditorRef = useRef<LexicalEditor | null>(null);
  const node = editorState.read(() => $getNodeByKey(nodeKey) as InlineImageNode);

  const {
    toggleModal = () => {
      console.error('Error: useModal() from FacelessUI did not work correctly');
    },
    closeModal,
  } = useModal();

  // NOTE: set the slug suffix to the document ID so that
  // each image in the editor gets its own slug and modal
  const inlineImageDrawerSlug = formatDrawerSlug({
    slug: `lexicalRichText-inline-image-update-${id}`,
    depth: editDepth,
  });

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload;
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if ($isInlineImageNode(node)) {
          node?.remove();
        }
        setSelected(false);
      }
      return false;
    },
    [isSelected, nodeKey, setSelected]
  );

  const onEnter = useCallback(
    (event: KeyboardEvent) => {
      const latestSelection = $getSelection();
      const buttonElem = buttonRef.current;
      if (
        isSelected &&
        $isNodeSelection(latestSelection) &&
        latestSelection.getNodes().length === 1
      ) {
        if (showCaption) {
          // Move focus into nested editor
          $setSelection(null);
          event.preventDefault();
          caption.focus();
          return true;
        } else if (buttonElem !== null && buttonElem !== document.activeElement) {
          event.preventDefault();
          buttonElem.focus();
          return true;
        }
      }
      return false;
    },
    [caption, isSelected, showCaption]
  );

  const onEscape = useCallback(
    (event: KeyboardEvent) => {
      if (activeEditorRef.current === caption || buttonRef.current === event.target) {
        $setSelection(null);
        editor.update(() => {
          setSelected(true);
          const parentRootElement = editor.getRootElement();
          if (parentRootElement !== null) {
            parentRootElement.focus();
          }
        });
        return true;
      }
      return false;
    },
    [caption, editor, setSelected]
  );

  useEffect(() => {
    let isMounted = true;
    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        if (isMounted) {
          setSelection(editorState.read(() => $getSelection()));
        }
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor;
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (payload) => {
          const event = payload;
          if (event.target === imageRef.current) {
            if (event.shiftKey) {
              setSelected(!isSelected);
            } else {
              clearSelection();
              setSelected(true);
            }
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          if (event.target === imageRef.current) {
            // TODO This is just a temporary workaround for FF to behave like other browsers.
            // Ideally, this handles drag & drop too (and all browsers).
            event.preventDefault();
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(KEY_DELETE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ENTER_COMMAND, onEnter, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ESCAPE_COMMAND, onEscape, COMMAND_PRIORITY_LOW)
    );
    return () => {
      isMounted = false;
      unregister();
    };
  }, [clearSelection, editor, isSelected, nodeKey, onDelete, onEnter, onEscape, setSelected]);

  const draggable = isSelected && $isNodeSelection(selection);
  const isFocused = isSelected;

  const handleToggleModal = (): void => {
    if (id != null) {
      toggleModal(inlineImageDrawerSlug);
    }
  };

  const handleUpdateImage = ({
    doc,
    altText,
    position,
    showCaption,
  }: InlineImageModalPayload): void => {
    closeModal(inlineImageDrawerSlug);
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

      editor.update(() => {
        node.update(imagePayload);
      });
    } else {
      console.error('Error: unable to find image source from document.');
    }
  };

  const classNames = cx(
    'InlineImageNode__container',
    { focused: isFocused },
    { draggable: $isNodeSelection(selection) }
  );

  return (
    <Suspense fallback={null}>
      <>
        <div draggable={draggable} className={classNames}>
          <button
            type="button"
            className="image-edit-button"
            ref={buttonRef}
            onClick={handleToggleModal}
          >
            Edit
          </button>
          <LazyImage
            id={id}
            collection={collection}
            // className={
            //   isFocused ? `focused ${$isNodeSelection(selection) ? 'draggable' : ''}` : undefined
            // }
            src={src}
            position={position}
            altText={altText}
            imageRef={imageRef}
            width={width}
            height={height}
          />
          {showCaption && (
            <div className="InlineImageNode__caption_container">
              <LexicalNestedComposer initialEditor={caption}>
                <AutoFocusPlugin />
                <LinkPlugin />
                <FloatingLinkEditorPlugin />
                <FloatingTextFormatToolbarPlugin editorConfig={editorConfig} />
                <HistoryPlugin externalHistoryState={historyState} />
                <RichTextPlugin
                  contentEditable={<ContentEditable className="InlineImageNode__contentEditable" />}
                  placeholder={
                    <Placeholder className="InlineImageNode__placeholder">
                      Enter a caption...
                    </Placeholder>
                  }
                  ErrorBoundary={LexicalErrorBoundary}
                />
              </LexicalNestedComposer>
            </div>
          )}
        </div>

        {id != null && id.length > 0 && (
          <InlineImageModal
            drawerSlug={inlineImageDrawerSlug}
            onSubmit={handleUpdateImage}
            collection={collection}
            docID={id}
            altText={altText}
            position={position}
            showCaption={showCaption}
          />
        )}
      </>
    </Suspense>
  );
}
