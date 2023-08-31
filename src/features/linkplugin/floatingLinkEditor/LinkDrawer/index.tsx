import React from 'react';
import { useTranslation } from 'react-i18next';

import { Drawer } from 'payload/dist/admin/components/elements/Drawer/index';
import fieldTypes from 'payload/dist/admin/components/forms/field-types/index';
import Form from 'payload/dist/admin/components/forms/Form/index';
import RenderFields from 'payload/dist/admin/components/forms/RenderFields/index';
import FormSubmit from 'payload/dist/admin/components/forms/Submit/index';

import { type Props } from './types';

import './index.scss';

const baseClass = 'rich-text-link-edit-modal';

export const LinkDrawer: React.FC<Props> = ({
  handleClose,
  handleModalSubmit,
  initialState,
  fieldSchema,
  drawerSlug,
}) => {
  const { t } = useTranslation('fields');

  return (
    <Drawer slug={drawerSlug} className={baseClass} title={t('editLink') ?? ''}>
      <Form onSubmit={handleModalSubmit} initialState={initialState}>
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
};
