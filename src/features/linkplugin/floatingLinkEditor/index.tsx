/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import "./index.scss";

// import { $isAutoLinkNode, $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  GridSelection,
  KEY_ESCAPE_COMMAND,
  LexicalEditor,
  NodeSelection,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import {Dispatch, useCallback, useEffect, useRef, useState} from 'react';
import * as React from "react";
import { createPortal } from "react-dom";

import { useModal } from "@faceless-ui/modal";
import { useTranslation } from "react-i18next";

import reduceFieldsToValues from "payload/dist/admin/components/forms/Form/reduceFieldsToValues";
import { Fields } from "payload/dist/admin/components/forms/Form/types";
import { Field } from "payload/dist/fields/config/types";
import { getBaseFields } from "payload/dist/admin/components/forms/field-types/RichText/elements/link/LinkDrawer/baseFields";
import { useConfig } from "payload/dist/admin/components/utilities/Config";
import buildStateFromSchema from "payload/dist/admin/components/forms/Form/buildStateFromSchema";
import { useAuth } from "payload/dist/admin/components/utilities/Auth";
import { useLocale } from "payload/dist/admin/components/utilities/Locale";
import { useEditDepth } from "payload/dist/admin/components/utilities/EditDepth";
import { formatDrawerSlug } from "payload/dist/admin/components/elements/Drawer";
import { getSelectedNode } from '../../../fields/LexicalRichText/utils/getSelectedNode';
import { $isLinkNode, LinkAttributes, TOGGLE_LINK_COMMAND } from '../nodes/LinkNodeModified';
import { LinkDrawer } from './LinkDrawer';
import { $isAutoLinkNode } from '../nodes/AutoLinkNodeModified';
import {useEditorConfigContext} from "../../../fields/LexicalRichText/LexicalEditorComponent";
import {
  setFloatingElemPositionForLinkEditor
} from "../../../fields/LexicalRichText/utils/setFloatingElemPositionForLinkEditor";

function LinkEditor({
  editor,
  isLink,
  setIsLink,
  anchorElem,
}: {
  editor: LexicalEditor;
  isLink: boolean;
  setIsLink: Dispatch<boolean>;
  anchorElem: HTMLElement;
}): JSX.Element {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [isEditMode, setEditMode] = useState(false);
  const [lastSelection, setLastSelection] = useState<
    RangeSelection | GridSelection | NodeSelection | null
  >(null);
  const { uuid} = useEditorConfigContext();

  const customFieldSchema = false; /* fieldProps?.admin?.link?.fields */ // TODO: Field props
  const config = useConfig();

  const { user } = useAuth();
  const locale = useLocale();
  const { t } = useTranslation("fields");

  const [initialState, setInitialState] = useState<Fields>({});
  const [fieldSchema] = useState(() => {
    const fields: Field[] = [...getBaseFields(config)];

    if (customFieldSchema) {
      fields.push({
        name: "fields",
        type: "group",
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

    fields.push({
      name: 'sponsored',
      label: 'Sponsored',
      type: 'checkbox',
      admin: {
        condition: ({ linkType }) => {
          return linkType === 'custom';
        },
      },
    });

    fields.push({
      name: 'nofollow',
      label: 'Nofollow',
      type: 'checkbox',
      admin: {
        condition: ({ linkType }) => {
          return linkType === 'custom';
        },
      },
    });

    return fields;
  });

  const { toggleModal, isModalOpen, closeModal } = useModal();
  const editDepth = useEditDepth();

  const drawerSlug = formatDrawerSlug({
    slug: `rich-text-link-lexicalRichText`+uuid,
    depth: editDepth,
  });

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();

      // Initial state thingy


      // Initial state:
      let data: LinkAttributes & { text: string, fields: undefined } = {
        text: "",
        url: "",
        linkType: undefined,
        newTab: undefined,
        sponsored: undefined,
        nofollow: undefined,
        doc: undefined,
        fields: undefined,
      };

      if ($isLinkNode(parent)) {
        data = {
          ...parent.getAttributes(),
          text: parent.getTextContent(),
          fields: undefined
        };

        if (parent.getAttributes()?.linkType === "custom") {
          setLinkUrl(parent.getAttributes()?.url);
        } else {
          // internal
          setLinkUrl(
            `relation to ${parent.getAttributes()?.doc?.relationTo}: ${
              parent.getAttributes()?.doc?.value
            }`
          );
        }
      } else if ($isLinkNode(node)) {
        data = {
          ...node.getAttributes(),
          text: node.getTextContent(),
          fields: undefined
        };

        if (node.getAttributes()?.linkType === "custom") {
          setLinkUrl(node.getAttributes()?.url);
        } else {
          // internal
          setLinkUrl(
            `relation to ${node.getAttributes()?.doc?.relationTo}: ${
              node.getAttributes()?.doc?.value
            }`
          );
        }
      } else {
        setLinkUrl("");
      }

      buildStateFromSchema({
        fieldSchema,
        data,
        user,
        operation: "create",
        locale,
        t,
      }).then((state) => {
        setInitialState(state);
      });
    }

    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const { activeElement } = document;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();

    if (
      selection !== null &&
      nativeSelection !== null &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode) &&
      editor.isEditable()
    ) {
      const domRect: DOMRect | undefined =
          nativeSelection.focusNode?.parentElement?.getBoundingClientRect();
      if (domRect) {
        domRect.y += 40;
        setFloatingElemPositionForLinkEditor(domRect, editorElem, anchorElem);
      }
      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== 'link-input') {
      if (rootElement !== null) {
        setFloatingElemPositionForLinkEditor(null, editorElem, anchorElem);
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

    window.addEventListener("resize", update);

    if (scrollerElem) {
      scrollerElem.addEventListener("scroll", update);
    }

    return () => {
      window.removeEventListener("resize", update);

      if (scrollerElem) {
        scrollerElem.removeEventListener("scroll", update);
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
        COMMAND_PRIORITY_LOW
      ),
        editor.registerCommand(
            KEY_ESCAPE_COMMAND,
            () => {
              if (isLink) {
                setIsLink(false);
                return true;
              }
              return false;
            },
            COMMAND_PRIORITY_HIGH,
        ),
    );
  }, [editor, updateLinkEditor, setIsLink, isLink]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);

  return (
    <div ref={editorRef} className="link-editor">
      {!isLink ? null : (isEditMode && isModalOpen(drawerSlug)) ? (
        <LinkDrawer // TODO: Might aswell import from payload/dist/admin/components/forms/field-types/RichText/elements/link/LinkDrawer/index.tsx instead?
          drawerSlug={drawerSlug}
          fieldSchema={fieldSchema}
          initialState={initialState}
          handleClose={() => {
            setEditMode(false);
            closeModal(drawerSlug);
          }}
          handleModalSubmit={(fields: Fields) => {
            // setLinkUrl(sanitizeUrl(fields.url.value));

            setEditMode(false);
            closeModal(drawerSlug);

            const data = reduceFieldsToValues(fields, true);

            const newNode: LinkAttributes = {
              newTab: data.newTab,
              sponsored: data.sponsored,
              nofollow: data.nofollow,
              url: data.linkType === "custom" ? data.url : undefined,
              linkType: data.linkType,
              doc: data.linkType === "internal" ? data.doc : undefined,
            };

            /*if (customFieldSchema) {
              newNode.fields += data.fields;
            }*/ //TODO

            editor.dispatchCommand(TOGGLE_LINK_COMMAND, newNode);
          }}
        />
      ) : (
          <div className="link-input">
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">
              {linkUrl}
            </a>
            <div
                className="link-edit"
                role="button"
                tabIndex={0}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setEditMode(true);
                  toggleModal(drawerSlug);
                }}
            />
          </div>
      )}
    </div>
  );
}

function useFloatingLinkEditorToolbar(
  editor: LexicalEditor,
  anchorElem: HTMLElement
): JSX.Element | null {
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isLink, setIsLink] = useState(false);

  const updateToolbar = useCallback(async () => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const linkParent = $findMatchingParent(node, $isLinkNode);
      const autoLinkParent = $findMatchingParent(node, $isAutoLinkNode);
      if (linkParent != null || autoLinkParent != null) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          setActiveEditor(newEditor);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [editor, updateToolbar]);

  return createPortal(
        <LinkEditor editor={activeEditor} anchorElem={anchorElem} isLink={isLink} setIsLink={setIsLink} />,
        anchorElem
      );
}

export default function FloatingLinkEditorPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  return useFloatingLinkEditorToolbar(editor, anchorElem);
}
