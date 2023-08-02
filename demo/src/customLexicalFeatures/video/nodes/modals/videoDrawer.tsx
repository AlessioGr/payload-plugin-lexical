/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { Drawer, formatDrawerSlug } from 'payload/dist/admin/components/elements/Drawer';
import './index.scss';

import { useModal } from '@faceless-ui/modal';
import reduceFieldsToValues from 'payload/dist/admin/components/forms/Form/reduceFieldsToValues';
import { Fields } from 'payload/dist/admin/components/forms/Form/types';
import { getBaseFields } from './modalBaseFields';
import { useConfig } from 'payload/dist/admin/components/utilities/Config';
import Form from 'payload/dist/admin/components/forms/Form';
import FormSubmit from 'payload/dist/admin/components/forms/Submit';
import fieldTypes from 'payload/dist/admin/components/forms/field-types';
import RenderFields from 'payload/dist/admin/components/forms/RenderFields';
import { useTranslation } from 'react-i18next';
import { useEditDepth } from 'payload/dist/admin/components/utilities/EditDepth';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEditorConfigContext } from '../../../../../../src/fields/LexicalRichText/EditorConfigProvider';
import { EditorConfig } from '../../../../../../src/types';
import { VideoAttributes } from '../VideoNode';
import { TOGGLE_VIDEO_COMMAND } from '../../plugins/VideoPlugin';

const baseClass = 'video-drawer';

const initialFormData = {
  source: 'youtube',
};

export function VideoDrawer(props: { editorConfig: EditorConfig }): JSX.Element {
  const { uuid } = useEditorConfigContext();

  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const { toggleModal, closeModal } = useModal();
  const editDepth = useEditDepth();

  const videoDrawerSlug = formatDrawerSlug({
    slug: `video` + uuid,
    depth: editDepth,
  });

  const config = useConfig();

  const [initialState, setInitialState] = useState<Fields>({});
  const { t } = useTranslation('fields');

  const [fieldSchema] = useState(() => {
    return [...getBaseFields(config)];
  });

  const onVideoConfirm = (data) => {
    let attrs: VideoAttributes = data;

    activeEditor.dispatchCommand(TOGGLE_VIDEO_COMMAND, attrs);
    closeModal(videoDrawerSlug);
  };

  return (
    <Drawer key={videoDrawerSlug} slug={videoDrawerSlug} className={baseClass} title="Add Video">
      <Form
        onSubmit={(fields: Fields) => {
          const data = reduceFieldsToValues(fields, true);
          onVideoConfirm(data);
        }}
        initialState={initialState}
        initialData={initialFormData}
      >
        <RenderFields
          fieldTypes={fieldTypes}
          readOnly={false}
          fieldSchema={fieldSchema}
          forceRender
        />
        <FormSubmit>{t('general:submit')}</FormSubmit>
      </Form>
    </Drawer>
  );
}
