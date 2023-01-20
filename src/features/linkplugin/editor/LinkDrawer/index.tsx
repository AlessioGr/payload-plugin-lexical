import React from "react";
import { useTranslation } from "react-i18next";
import { Drawer } from "payload/dist/admin/components/elements/Drawer";
import Button from "payload/dist/admin/components/elements/Button";
import X from "payload/dist/admin/components/icons/X";
import Form from "payload/dist/admin/components/forms/Form";
import FormSubmit from "payload/dist/admin/components/forms/Submit";
import { Props } from "./types";
import fieldTypes from "payload/dist/admin/components/forms/field-types";
import RenderFields from "payload/dist/admin/components/forms/RenderFields";

import "./index.scss";
import { Gutter } from "payload/dist/admin/components/elements/Gutter";

const baseClass = "rich-text-link-edit-modal";

export const LinkDrawer: React.FC<Props> = ({
  handleClose,
  handleModalSubmit,
  initialState,
  fieldSchema,
  drawerSlug,
}) => {
  const { t } = useTranslation("fields");

  return (
    <Drawer slug={drawerSlug} formatSlug={false} className={baseClass}>
      <Gutter className={`${baseClass}__template`}>
        <header className={`${baseClass}__header`}>
          <h2 className={`${baseClass}__header-text`}>{t("editLink")}</h2>
          <Button
            className={`${baseClass}__header-close`}
            buttonStyle="none"
            onClick={handleClose}
          >
            <X />
          </Button>
        </header>
        <Form onSubmit={handleModalSubmit} initialState={initialState}>
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
};
