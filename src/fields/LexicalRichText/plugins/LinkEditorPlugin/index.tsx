/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import './index.scss';

// import { $isAutoLinkNode, $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_LOW,
  GridSelection,
  LexicalEditor,
  NodeSelection,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { createPortal } from 'react-dom';

import { Modal, useModal } from '@faceless-ui/modal';
import { useTranslation } from 'react-i18next';
import { $isAutoLinkNode, $isLinkNode, TOGGLE_LINK_COMMAND } from '../LinkPlugin/LinkPluginModified';
import type { PayloadLinkData } from '../LinkPlugin/LinkPluginModified';
import LinkPreview from '../../ui/LinkPreview';
import { getSelectedNode } from '../../utils/getSelectedNode';
import { sanitizeUrl } from '../../utils/url';
import { setFloatingElemPosition } from '../../utils/setFloatingElemPosition';
import MinimalTemplate from 'payload/dist/admin/components/templates/Minimal'
import Button from 'payload/dist/admin/components/elements/Button'
import './modal.scss';
import RenderFields from 'payload/dist/admin/components/forms/RenderFields';
import fieldTypes from 'payload/dist/admin/components/forms/field-types';
import FormSubmit from 'payload/dist/admin/components/forms/Submit';
import Form from 'payload/dist/admin/components/forms/Form';
import reduceFieldsToValues from 'payload/dist/admin/components/forms/Form/reduceFieldsToValues'
import { Fields } from 'payload/dist/admin/components/forms/Form/types';
import { Field } from 'payload/dist/fields/config/types';
import {getBaseFields} from 'payload/dist/admin/components/forms/field-types/RichText/elements/link/Modal/baseFields'
import { useConfig } from 'payload/dist/admin/components/utilities/Config';
import buildStateFromSchema from 'payload/dist/admin/components/forms/Form/buildStateFromSchema';
import { useAuth } from 'payload/dist/admin/components/utilities/Auth';
import { useLocale } from 'payload/dist/admin/components/utilities/Locale';

function LinkEditor({
  editor,
  anchorElem,
}: {
  editor: LexicalEditor;
  anchorElem: HTMLElement;
}): JSX.Element {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [isEditMode, setEditMode] = useState(false);
  const [lastSelection, setLastSelection] = useState<
    RangeSelection | GridSelection | NodeSelection | null
  >(null);

  const customFieldSchema = false/* fieldProps?.admin?.link?.fields */; // TODO: Field props
  const config = useConfig();

  const { user } = useAuth();
  const locale = useLocale();
  const { t } = useTranslation('fields');

  const [initialState, setInitialState] = useState<Fields>({});
  const [fieldSchema] = useState(() => {
    const fields: Field[] = [
      ...getBaseFields(config),
    ];

    if (customFieldSchema) {
      fields.push({
        name: 'fields',
        type: 'group',
        admin: {
          style: {
            margin: 0,
            padding: 0,
            borderTop: 0,
            borderBottom: 0,
          },
        },
        fields: customFieldSchema,
      });
    }

    return fields;
  });

  const {
    toggleModal,
    isModalOpen,
  } = useModal();
  const modalSlug = 'lexicalRichText-edit-link';
  const baseModalClass = 'rich-text-link-edit-modal';

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();


      // Initial state thingy

      // Initial state:
      const data: {
        text: string,
        url: string,
        linkType?: 'custom'|'internal',
        newTab?: boolean,
        doc?: { value: string, relationTo: string }|null,
        fields: unknown
      } = {
        text: '',
        url: '',
        linkType: undefined,
        newTab: undefined,
        doc: undefined,
        fields: undefined,
      };


      if ($isLinkNode(parent)) {
        data.text = parent.getTextContent();
        data.url = parent.getURL();
        data.newTab = parent.isNewTab();
        data.linkType = parent.getLinkType();
        data.doc = parent.getDoc();
        if (parent.getLinkType() === 'custom') {
          setLinkUrl(parent.getURL());
        } else { // internal
          setLinkUrl(`relation to ${parent.getDoc()?.relationTo}: ${parent.getDoc()?.value}`);
        }
      } else if ($isLinkNode(node)) {
        data.text = node.getTextContent();
        data.url = node.getURL();
        data.newTab = node.isNewTab();
        data.linkType = node.getLinkType();
        data.doc = node.getDoc();
        if (node.getLinkType() === 'custom') {
          setLinkUrl(node.getURL());
        } else { // internal
          setLinkUrl(`relation to ${node.getDoc()?.relationTo}: ${node.getDoc()?.value}`);
        }
      } else {
        setLinkUrl('');
      }

      buildStateFromSchema({ fieldSchema, data, user, operation: 'create', locale, t }).then(
        (state) => {
          setInitialState(state);
        },
      );
    }

    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const { activeElement } = document;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();

    if (
      selection !== null
      && nativeSelection !== null
      && rootElement !== null
      && rootElement.contains(nativeSelection.anchorNode)
      && editor.isEditable()
    ) {
      const domRange = nativeSelection.getRangeAt(0);
      let rect;
      if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild as HTMLElement;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }

      setFloatingElemPosition(rect, editorElem, anchorElem);
      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== 'link-input') {
      if (rootElement !== null) {
        setFloatingElemPosition(null, editorElem, anchorElem);
      }
      setLastSelection(null);
      setEditMode(false);
      setLinkUrl('');
    }

    return true;
  }, [anchorElem, editor]);

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        updateLinkEditor();
      });
    };

    window.addEventListener('resize', update);

    if (scrollerElem) {
      scrollerElem.addEventListener('scroll', update);
    }

    return () => {
      window.removeEventListener('resize', update);

      if (scrollerElem) {
        scrollerElem.removeEventListener('scroll', update);
      }
    };
  }, [anchorElem.parentElement, editor, updateLinkEditor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);


  return (
    <div
      ref={editorRef}
      className="link-editor"
    >
      {isEditMode && isModalOpen(modalSlug) ? (
        <Modal
          className={baseModalClass}
          slug={modalSlug}
        >
          <EditLinkModal
            editor={editor}
            setEditMode={setEditMode}
            modalSlug={modalSlug}
            fieldSchema={fieldSchema}
            initialState={initialState}
            handleModalSubmit={(fields: Fields) => {
              console.log('Submit! fields:', fields);
              // setLinkUrl(sanitizeUrl(fields.url.value));

              setEditMode(false);
              toggleModal(modalSlug);


              const data = reduceFieldsToValues(fields, true);

              /* const newLink = {
                type: 'link',
                linkType: data.linkType,
                url: data.linkType === 'custom' ? data.url : undefined,
                doc: data.linkType === 'internal' ? data.doc : undefined,
                newTab: data.newTab,
                fields: data.fields,
                children: [],
              }; */


              const newNode: PayloadLinkData = {
                newTab: data.newTab,
                url: data.linkType === 'custom' ? data.url : undefined,
                linkType: data.linkType,
                doc: data.linkType === 'internal' ? data.doc : undefined,
                payloadType: 'payload',
              };

              if (customFieldSchema) {
                newNode.fields = data.fields;
              }

              editor.dispatchCommand(
                TOGGLE_LINK_COMMAND,
                newNode,
              );
            }}
          />
        </Modal>
      ) : (
        <React.Fragment>
          <div className="link-input">
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {linkUrl}
            </a>
            <div
              className="link-edit"
              role="button"
              tabIndex={0}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setEditMode(true);
                toggleModal(modalSlug);
              }}
            />
          </div>
          <LinkPreview url={linkUrl} />
        </React.Fragment>
      )}
    </div>
  );
}

function useFloatingLinkEditorToolbar(
  editor: LexicalEditor,
  anchorElem: HTMLElement,
): JSX.Element | null {
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isLink, setIsLink] = useState(false);

  const updateToolbar = useCallback(async () => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const linkParent = $findMatchingParent(node, $isLinkNode);
      const autoLinkParent = $findMatchingParent(node, $isAutoLinkNode);
      if (linkParent != null && autoLinkParent == null) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, []);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, updateToolbar]);

  return isLink
    ? createPortal(
      <LinkEditor
        editor={activeEditor}
        anchorElem={anchorElem}
      />,
      anchorElem,
    )
    : null;
}

export default function FloatingLinkEditorPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  return useFloatingLinkEditorToolbar(editor, anchorElem);
}


export function EditLinkModal({
  editor,
  setEditMode,
  modalSlug,
  handleModalSubmit,
  initialState,
  fieldSchema,
}: {
  editor: LexicalEditor;
  setEditMode;
  modalSlug: string;
  handleModalSubmit;
  initialState;
  fieldSchema;
}): JSX.Element {
  const baseModalClass = 'rich-text-link-edit-modal';
  const {
    toggleModal,
  } = useModal();

  const inputRef = useRef<HTMLInputElement>(null);
  if (inputRef.current) {
    inputRef.current.focus();
  }

  console.log('ISTATE', initialState);

  return (
    <React.Fragment>
      <MinimalTemplate className={`${baseModalClass}__template`}>
        <header className={`${baseModalClass}__header`}>
          <h3>
            Edit Link
          </h3>
          <Button
            icon="x"
            round
            buttonStyle="icon-label"
            iconStyle="with-border"
            onClick={() => {
              setEditMode(false);
              toggleModal(modalSlug);
            }}
          />
        </header>
        {/* Add functionality here
        <input
          ref={inputRef}
          className="link-input"
          value={linkUrl}
          onChange={(event) => {
            setLinkUrl(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              if (lastSelection !== null) {
                if (linkUrl !== '') {
                  editor.dispatchCommand(
                    TOGGLE_LINK_COMMAND,
                    sanitizeUrl(linkUrl),
                  );
                }
                setEditMode(false);
              }
            } else if (event.key === 'Escape') {
              event.preventDefault();
              setEditMode(false);
            }
          }}/> */ }
        <Form
          onSubmit={handleModalSubmit}
          initialState={initialState}
        >
          <RenderFields
            fieldTypes={fieldTypes}
            readOnly={false}
            fieldSchema={fieldSchema}
            forceRender
          />
          <FormSubmit>
            Confirm
          </FormSubmit>
        </Form>
      </MinimalTemplate>
    </React.Fragment>
  );
}
