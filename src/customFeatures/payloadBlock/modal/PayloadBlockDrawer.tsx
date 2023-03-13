/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  LexicalEditor,
} from "lexical";
import { useState, useEffect } from "react";
import { Drawer, formatDrawerSlug } from "payload/dist/admin/components/elements/Drawer";
import { Gutter } from "payload/dist/admin/components/elements/Gutter";
import "./index.scss";


import { useModal } from '@faceless-ui/modal';
import React from 'react';
import Button from 'payload/dist/admin/components/elements/Button';
import reduceFieldsToValues from "payload/dist/admin/components/forms/Form/reduceFieldsToValues";
import { Fields } from "payload/dist/admin/components/forms/Form/types";
import { Block, Field } from "payload/dist/fields/config/types";
import { useConfig } from "payload/dist/admin/components/utilities/Config";
import Form from "payload/dist/admin/components/forms/Form";
import FormSubmit from "payload/dist/admin/components/forms/Submit";
import fieldTypes from "payload/dist/admin/components/forms/field-types";
import RenderFields from "payload/dist/admin/components/forms/RenderFields";
import { useTranslation } from "react-i18next";
import X from "payload/dist/admin/components/icons/X";

import { useEditDepth } from 'payload/dist/admin/components/utilities/EditDepth';
import {EditorConfig} from "../../../../plugin-lexical/types";
import {PayloadBlockAttributes} from "../nodes/PayloadBlockNode";
import {TOGGLE_PAYLOAD_BLOCK_COMMAND} from "../plugins/PayloadBlockPlugin";

type Props = {};

const baseClass = 'payloadBlock-modal';

export function InsertPayloadBlockDialog(props: {
  activeEditor: LexicalEditor;
  editorConfig: EditorConfig;
}): JSX.Element {

  const {
    toggleModal,
    closeModal
  } = useModal();

  const editDepth = useEditDepth();

  const drawerSlug = formatDrawerSlug({
      slug: `payloadBlock`, // TODO: Add uuid for the slug?
      depth: editDepth,
  });
  const config = useConfig();

  const [initialState, setInitialState] = useState<Fields>({});
  const { t } = useTranslation("fields");


  const [block, setBlock] = useState<{ block: Block, fieldSchema: Field[] }>(null);

  useEffect(() => {

    async function loadBlock() {
      console.log("Importing block...")
      const blockImport = await (await import(`../../../../../blocks/ImageAndTextBlock`)).default;

      setBlock({
        block: blockImport,
        fieldSchema: blockImport.fields
      });
    }

    loadBlock();
  }, []);





  const onProductConfirm = (data) => {
    let attrs: PayloadBlockAttributes = {
      block: null,
      values: null
    };


    console.log("Received data", data)

    attrs.block = block.block;
    attrs.values = data;


    props.activeEditor.dispatchCommand(TOGGLE_PAYLOAD_BLOCK_COMMAND, attrs);
    closeModal(drawerSlug);
  }

  return (

    <Drawer  key={drawerSlug}  slug={drawerSlug} className={baseClass}>
      <Gutter className={`${baseClass}__template`}>
        {block ? (
          <><header className={`${baseClass}__header`}>
            <h2 className={`${baseClass}__header-text`}>Add {block.block.slug} Block</h2>
            <Button
              className={`${baseClass}__header-close`}
              buttonStyle="none"
              onClick={() => {
                closeModal(drawerSlug);
              }}
            >
              <X />
            </Button>
          </header>
          <Form onSubmit={(fields: Fields) => {
            const data = reduceFieldsToValues(fields, true);
            onProductConfirm(data);
          }} initialState={initialState}>
              <RenderFields
                fieldTypes={fieldTypes}
                readOnly={false}
                fieldSchema={block.fieldSchema}
                forceRender />
              <FormSubmit>{t("general:submit")}</FormSubmit>
            </Form></>
        ) : (
          <p>Loading...</p>
        )}

      </Gutter>
    </Drawer>

  );

}

