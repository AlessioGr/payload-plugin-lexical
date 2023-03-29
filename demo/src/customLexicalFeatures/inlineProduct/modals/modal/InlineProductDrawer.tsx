/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, {useState} from "react";
import {Drawer, formatDrawerSlug} from "payload/dist/admin/components/elements/Drawer";
import {Gutter} from "payload/dist/admin/components/elements/Gutter";
import "./index.scss";

import {InlineProductAttributes,} from "../../nodes/InlineProductNode";
import {useModal} from '@faceless-ui/modal';
import Button from 'payload/dist/admin/components/elements/Button';
import reduceFieldsToValues from "payload/dist/admin/components/forms/Form/reduceFieldsToValues";
import {Fields} from "payload/dist/admin/components/forms/Form/types";
import {getBaseFields} from './modalBaseFields';
import {useConfig} from "payload/dist/admin/components/utilities/Config";
import Form from "payload/dist/admin/components/forms/Form";
import FormSubmit from "payload/dist/admin/components/forms/Submit";
import fieldTypes from "payload/dist/admin/components/forms/field-types";
import RenderFields from "payload/dist/admin/components/forms/RenderFields";
import {useTranslation} from "react-i18next";
import X from "payload/dist/admin/components/icons/X";
import {TOGGLE_INLINE_PRODUCT_COMMAND} from '../../plugins/InlineProductPlugin';
import {useEditDepth} from 'payload/dist/admin/components/utilities/EditDepth';
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {useEditorConfigContext} from "../../../../../../src/fields/LexicalRichText/LexicalEditorComponent";
import {EditorConfig} from "../../../../../../src/types";


type Props = { };

const baseClass = 'inlineProduct-drawer';

export function InsertInlineProductDrawer(props: {
  editorConfig: EditorConfig;
}): JSX.Element {
  const { uuid} = useEditorConfigContext();

  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const {
    toggleModal,
    closeModal
  } = useModal();
  const editDepth = useEditDepth();

  const inlineProductDrawerSlug = formatDrawerSlug({
    slug: `inlineProduct`+uuid,
    depth: editDepth,
  });

  const config = useConfig();

  const [initialState, setInitialState] = useState<Fields>({});
  const { t } = useTranslation("fields");


  const [fieldSchema] = useState(() => {
    return [...getBaseFields(config)];
  });


  const onProductConfirm = (data) => {
      let attrs: InlineProductAttributes;


      if(data?.doc?.value){
        attrs = {
          display: data?.display,
          doc: data?.doc,
          customLabel: data?.customLabel
        };

      }else{
        attrs = {
          display: data?.display,
          customLabel: data?.customLabel,
          doc: {
            value: data?.doc,
            relationTo: "products",
          }
        };
      }


      activeEditor.dispatchCommand(TOGGLE_INLINE_PRODUCT_COMMAND, attrs);
      closeModal(inlineProductDrawerSlug);
    }

  return (

    <Drawer key={inlineProductDrawerSlug} slug={inlineProductDrawerSlug} className={baseClass}>
      <Gutter className={`${baseClass}__template`}>
        <header className={`${baseClass}__header`}>
          <h2 className={`${baseClass}__header-text`}>Add Inline Product</h2>
          <Button
            className={`${baseClass}__header-close`}
            buttonStyle="none"
            onClick={() => {
              closeModal(inlineProductDrawerSlug);
            }}
          >
            <X />
          </Button>
        </header>


        <Form onSubmit={(fields: Fields) => {
            const data = reduceFieldsToValues(fields, true);
            onProductConfirm(data);
           }}  initialState={initialState}>
          <RenderFields
            fieldTypes={fieldTypes}
            readOnly={false}
            fieldSchema={fieldSchema}
            forceRender
          />
          <FormSubmit>{t("general:submit")}</FormSubmit>
        </Form>
      </Gutter>
    </Drawer>

  );

}

