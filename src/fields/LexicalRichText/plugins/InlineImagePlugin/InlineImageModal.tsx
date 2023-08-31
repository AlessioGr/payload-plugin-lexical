import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { useConfig } from 'payload/components/utilities';
import { requests } from 'payload/dist/admin/api';
import Button from 'payload/dist/admin/components/elements/Button/index';
import { Drawer } from 'payload/dist/admin/components/elements/Drawer/index';
import FileDetails from 'payload/dist/admin/components/elements/FileDetails/index';
import { baseClass, formatListDrawerSlug } from 'payload/dist/admin/components/elements/ListDrawer/index';
import { CheckboxInput } from 'payload/dist/admin/components/forms/field-types/Checkbox/Input';
import SelectInput from 'payload/dist/admin/components/forms/field-types/Select/Input';
import TextInput from 'payload/dist/admin/components/forms/field-types/Text/Input';
import { useEditDepth } from 'payload/dist/admin/components/utilities/EditDepth/index';
import type { OptionObject } from 'payload/dist/fields/config/types';
import type { SanitizedCollectionConfig } from 'payload/types';

import { useModal } from '@faceless-ui/modal';

import { useEditorConfigContext } from '../../EditorConfigProvider';
import { InlineImageMediaModal } from './InlineImageMediaModal';

import type { Position } from '../../nodes/InlineImageNode/types';
import type { InlineImageModalPayload } from './types';

import './InlineImageModal.css';

export function InlineImageModal({
  drawerSlug,
  collection: collectionFromProps,
  onSubmit,
  docID,
  altText: altTextFromProps,
  position: positionFromProps,
  showCaption: showCaptionFromProps,
}: {
  drawerSlug: string;
  collection: string;
  onSubmit: (data: InlineImageModalPayload) => void;
  docID?: string;
  altText?: string;
  position?: Position;
  showCaption?: boolean;
}): JSX.Element {
  const {
    serverURL,
    collections,
    routes: { api },
  } = useConfig();
  const { uuid } = useEditorConfigContext();
  const editDepth = useEditDepth();
  const { toggleModal, closeModal } = useModal();
  const [doc, setDoc] = useState<Record<string, unknown> | null>(null);
  const [position, setPosition] = useState<Position>(positionFromProps ?? 'left');
  const [altText, setAltText] = useState(altTextFromProps ?? '');
  const [showCaption, setShowCaption] = useState(showCaptionFromProps ?? false);
  const [mediaRemoved, setMediaRemoved] = useState(false);
  const isDisabled = altText == null || altText.length === 0 || doc == null;
  const mediaCollection: SanitizedCollectionConfig | undefined = collections.find(
    (collection) => collection.slug === collectionFromProps
  );
  const selectMediaDrawerSlug = formatListDrawerSlug({
    uuid: `${uuid}-inline-image`, // NOTE: while there are two ListDrawers registered - they must have unique IDs (see the ModalPlugin)
    depth: editDepth,
  });

  useEffect(() => {
    async function loadDoc(): Promise<void> {
      try {
        const url = `${serverURL}${api}/${collectionFromProps}/${docID as string}`;
        const response = await requests.get(url);
        if (response.ok) {
          const doc = await response.json();
          setDoc(doc);
        }
      } catch (error) {
        console.error('Error: trying load existing image in InlineImageModal', error);
      }
    }

    if (docID != null && docID.length > 0 && doc == null && !mediaRemoved) {
      void loadDoc();
    }
  }, [docID]);

  const handleOnSubmit = (): void => {
    if (onSubmit != null && doc != null && altText != null) {
      onSubmit({ doc, collectionSlug: collectionFromProps, altText, position, showCaption });
    }
    closeModal(drawerSlug);
  };

  const handleOnCancel = (): void => {
    closeModal(drawerSlug);
  };

  const handleOnSelectMedia = (): void => {
    toggleModal(selectMediaDrawerSlug);
  };

  const handleOnRemoveMedia = (): void => {
    setMediaRemoved(true);
    setDoc(null);
  };

  const handleOnMediaSelected = async ({ docID, collectionConfig }): Promise<void> => {
    closeModal(selectMediaDrawerSlug);
    try {
      const response = await requests.get(`${serverURL}${api}/media/${docID as string}`);
      if (response.ok) {
        const doc = await response.json();
        setDoc(doc);
      }
    } catch (error) {
      // TODO: Payload error alert?
      console.error(error);
      toast.error(`Error: error retrieving image for document ID: ${docID as string} `);
    }
  };

  const handleAltTextChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setAltText(event.target.value);
  };

  const handlePositionChange = (option): void => {
    if (option?.value != null) {
      setPosition(option.value);
    }
  };

  const handleShowCaptionChange = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    setShowCaption(!showCaption);
  };

  const positionOptions: OptionObject[] = [
    {
      label: 'Left',
      value: 'left',
    },
    {
      label: 'Right',
      value: 'right',
    },
    {
      label: 'Full Width',
      value: 'full',
    },
  ];

  return (
    <>
      <Drawer slug={drawerSlug} key={drawerSlug} className={baseClass} title="Insert Image">
        <div className="InlineImagePlugin--modal-media-display">
          {mediaCollection != null && doc != null ? (
            <FileDetails
              collection={mediaCollection}
              doc={doc}
              handleRemove={handleOnRemoveMedia}
            />
          ) : (
            <Button buttonStyle="secondary" onClick={handleOnSelectMedia}>
              Select Image
            </Button>
          )}
        </div>

        <TextInput
          name="altText"
          path=""
          label="Alt Text"
          onChange={handleAltTextChange}
          data-test-id="insert-image-modal-alt-text"
          value={altText}
          required={true}
          errorMessage="Please input alt text"
          showError={false}
        />

        <SelectInput
          name="position"
          path=""
          label="Position"
          options={positionOptions}
          value={position}
          onChange={handlePositionChange}
          required={true}
        />

        <CheckboxInput
          name="showCaption"
          label="Show Caption"
          checked={showCaption}
          onToggle={handleShowCaptionChange}
        />

        <div className="InlineImagePlugin--modal-actions" data-test-id="insert-image-model-actions">
          <Button buttonStyle="primary" disabled={isDisabled} onClick={handleOnSubmit}>
            Save
          </Button>
          <Button buttonStyle="secondary" onClick={handleOnCancel}>
            Cancel
          </Button>
        </div>
      </Drawer>

      <InlineImageMediaModal
        onSelect={handleOnMediaSelected}
        drawerSlug={selectMediaDrawerSlug}
        key={selectMediaDrawerSlug}
        collectionSlugs={[collectionFromProps]}
      />
    </>
  );
}
