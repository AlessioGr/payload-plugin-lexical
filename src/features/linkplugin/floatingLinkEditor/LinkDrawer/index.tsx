import React from 'react';
import { useTranslation } from 'react-i18next';

import { Drawer } from 'payload/components/elements';
import fieldTypes from 'payload/distadmin/components/forms/field-types/index';
import Form from 'payload/distadmin/components/forms/Form/index';
import RenderFields from 'payload/distadmin/components/forms/RenderFields/index';
import FormSubmit from 'payload/distadmin/components/forms/Submit/index';

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
