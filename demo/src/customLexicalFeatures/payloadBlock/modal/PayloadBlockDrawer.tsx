/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect } from 'react';
import {
  Drawer,
  formatDrawerSlug,
} from 'payload/dist/admin/components/elements/Drawer';
import { Gutter } from 'payload/dist/admin/components/elements/Gutter';
import './index.scss';

import { useModal } from '@faceless-ui/modal';
import React from 'react';
import Button from 'payload/dist/admin/components/elements/Button';
import reduceFieldsToValues from 'payload/dist/admin/components/forms/Form/reduceFieldsToValues';
import { Fields } from 'payload/dist/admin/components/forms/Form/types';
import { Block, Field } from 'payload/dist/fields/config/types';
import { useConfig } from 'payload/dist/admin/components/utilities/Config';
import Form from 'payload/dist/admin/components/forms/Form';
import FormSubmit from 'payload/dist/admin/components/forms/Submit';
import fieldTypes from 'payload/dist/admin/components/forms/field-types';
import RenderFields from 'payload/dist/admin/components/forms/RenderFields';
import { useTranslation } from 'react-i18next';
import X from 'payload/dist/admin/components/icons/X';

import { useEditDepth } from 'payload/dist/admin/components/utilities/EditDepth';
import { PayloadBlockAttributes } from '../nodes/PayloadBlockNode';
import { TOGGLE_PAYLOAD_BLOCK_COMMAND } from '../plugins/PayloadBlockPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEditorConfigContext } from '../../../../../src/fields/LexicalRichText/LexicalEditorComponent';
import type { EditorConfig } from '../../../../../src/types';

type Props = {};

const baseClass = 'payloadBlock-modal';

export function InsertPayloadBlockDialog(props: {
  editorConfig: EditorConfig;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const { toggleModal, closeModal } = useModal();
  const { uuid } = useEditorConfigContext();

  const editDepth = useEditDepth();

  const drawerSlug = formatDrawerSlug({
    slug: `payloadBlock` + uuid,
    depth: editDepth,
  });
  const config = useConfig();

  const [initialState, setInitialState] = useState<Fields>({});
  const { t } = useTranslation('fields');

  const [block, setBlock] = useState<{ block: Block; fieldSchema: Field[] }>(
    null,
  );

  useEffect(() => {
    async function loadBlock() {
      console.log('Importing block...');
      const blockImport = await (
        await import(`../../../../../blocks/InsertYourBlockHere`)
      ).default;

      setBlock({
        block: blockImport,
        fieldSchema: blockImport.fields,
      });
    }

    loadBlock();
  }, []);

  const onProductConfirm = (data) => {
    let attrs: PayloadBlockAttributes = {
      block: null,
      values: null,
    };

    console.log('Received data', data);

    attrs.block = block.block;
    attrs.values = data;

    activeEditor.dispatchCommand(TOGGLE_PAYLOAD_BLOCK_COMMAND, attrs);
    closeModal(drawerSlug);
  };

  return (
    <Drawer
      key={drawerSlug}
      slug={drawerSlug}
      className={baseClass}
      title={`Add ${block?.block?.slug ?? 'unknown'} Block`}>
      {block ? (
        <>
          <Form
            onSubmit={(fields: Fields) => {
              const data = reduceFieldsToValues(fields, true);
              onProductConfirm(data);
            }}
            initialState={initialState}>
            <RenderFields
              fieldTypes={fieldTypes}
              readOnly={false}
              fieldSchema={block.fieldSchema}
              forceRender
            />
            <FormSubmit>{t('general:submit')}</FormSubmit>
          </Form>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Drawer>
  );
}
