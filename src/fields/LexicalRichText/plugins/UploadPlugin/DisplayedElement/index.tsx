import { useModal } from '@faceless-ui/modal';
import { useTranslation } from 'react-i18next';
import React, { useCallback, useEffect, useState } from 'react';
import { useConfig } from 'payload/dist/admin/components/utilities/Config';
import { SanitizedCollectionConfig } from 'payload/dist/collections/config/types';
import usePayloadAPI from 'payload/dist/admin/hooks/usePayloadAPI';
import useThumbnail from 'payload/dist/admin/hooks/useThumbnail';
import FileGraphic from 'payload/dist/admin/components/graphics/File';
import { getTranslation } from 'payload/dist/utilities/getTranslation';
import Button from 'payload/dist/admin/components/elements/Button';
import { SwapUploadModal } from 'payload/dist/admin/components/forms/field-types/RichText/elements/upload/Element/SwapUploadModal';
import { EditModal } from 'payload/dist/admin/components/forms/field-types/RichText/elements/upload/Element/EditModal';

const baseClass = 'rich-text-upload';

const initialParams = {
  depth: 0,
};

const DisplayedElement = ({ attributes, children, element, path, fieldProps, activeEditor }) => {
  const { relationTo, value } = element;
  const { toggleModal } = useModal();
  const { collections, serverURL, routes: { api } } = useConfig();
  const [modalToRender, setModalToRender] = useState(undefined);
  const [relatedCollection, setRelatedCollection] = useState<SanitizedCollectionConfig>(() => collections.find((coll) => coll.slug === relationTo));
  const { t, i18n } = useTranslation('fields');

  const modalSlug = `${path}-edit-upload-${modalToRender}`;

  // Get the referenced document
  const [{ data: upload }] = usePayloadAPI(
    `${serverURL}${api}/${relatedCollection.slug}/${value?.id}`,
    { initialParams },
  );

  const thumbnailSRC = useThumbnail(relatedCollection, upload);

  // Remove upload element from editor
  const removeUpload = useCallback(() => {
    // TODO
  }, [/* activeEditor, element] */]);

  const closeModal = useCallback(() => {
    toggleModal(modalSlug);
    setModalToRender(null);
  }, [toggleModal, modalSlug]);

  useEffect(() => {
    if (modalToRender) {
      toggleModal(modalSlug);
    }
  }, [modalToRender, toggleModal, modalSlug]);

  const fieldSchema = fieldProps?.admin?.upload?.collections?.[relatedCollection.slug]?.fields;

  return (
    <div
      className={[
        baseClass,
        (/* selected && focused */true) && `${baseClass}--selected`,
      ].filter(Boolean).join(' ')}
      contentEditable={false}
      {...attributes}
    >
      <div className={`${baseClass}__card`}>
        <div className={`${baseClass}__topRow`}>
          <div className={`${baseClass}__thumbnail`}>
            {thumbnailSRC ? (
              <img
                src={thumbnailSRC}
                alt={upload?.filename}
              />
            ) : (
              <FileGraphic />
            )}
          </div>
          <div className={`${baseClass}__topRowRightPanel`}>
            <div className={`${baseClass}__collectionLabel`}>
              {getTranslation(relatedCollection.labels.singular, i18n)}
            </div>
            <div className={`${baseClass}__actions`}>
              {fieldSchema && (
                <Button
                  icon="edit"
                  round
                  buttonStyle="icon-label"
                  className={`${baseClass}__actionButton`}
                  onClick={(e) => {
                    e.preventDefault();
                    setModalToRender('edit');
                  }}
                  tooltip={t('general:edit')}
                />
              )}
              <Button
                icon="swap"
                round
                buttonStyle="icon-label"
                className={`${baseClass}__actionButton`}
                onClick={(e) => {
                  e.preventDefault();
                  setModalToRender('swap');
                }}
                tooltip={t('swapUpload')}
              />
              <Button
                icon="x"
                round
                buttonStyle="icon-label"
                className={`${baseClass}__actionButton`}
                onClick={(e) => {
                  e.preventDefault();
                  removeUpload();
                }}
                tooltip={t('removeUpload')}
              />
            </div>
          </div>
        </div>

        <div className={`${baseClass}__bottomRow`}>
          <strong>{upload?.filename}</strong>
        </div>
      </div>
      {children}

      {modalToRender === 'swap' && (
        <SwapUploadModal
          slug={modalSlug}
          element={element}
          closeModal={closeModal}
          setRelatedCollectionConfig={setRelatedCollection}
          relatedCollectionConfig={relatedCollection}
        />
      )}

      {(modalToRender === 'edit' && fieldSchema) && (
        <EditModal
          slug={modalSlug}
          closeModal={closeModal}
          relatedCollectionConfig={relatedCollection}
          fieldSchema={fieldSchema}
          element={element}
        />
      )}
    </div>
  );
};

export default DisplayedElement;
