import React, { Fragment, useEffect, useState } from 'react';
import { useModal } from '@faceless-ui/modal';
import { useTranslation } from 'react-i18next';
import { LexicalEditor } from 'lexical';
import { useConfig } from 'payload/dist/admin/components/utilities/Config';

import usePayloadAPI from 'payload/dist/admin/hooks/usePayloadAPI';
import UploadGallery from 'payload/dist/admin/components/elements/UploadGallery';
import ListControls from 'payload/dist/admin/components/elements/ListControls';
import ReactSelect from 'payload/dist/admin/components/elements/ReactSelect';
import Paginator from 'payload/dist/admin/components/elements/Paginator';
import formatFields from 'payload/dist/admin/components/views/collections/List/formatFields';
import Label from 'payload/dist/admin/components/forms/Label';
import MinimalTemplate from 'payload/dist/admin/components/templates/Minimal';
import Button from 'payload/dist/admin/components/elements/Button';
import { SanitizedCollectionConfig } from 'payload/dist/collections/config/types';
import PerPage from 'payload/dist/admin/components/elements/PerPage';
import { getTranslation } from 'payload/dist/utilities/getTranslation';

import './index.scss';
import '../addSwapModals.scss';
import { RawImagePayload } from '../../../nodes/ImageNode';
import { INSERT_IMAGE_COMMAND } from '../index';

const baseClass = 'upload-rich-text-button';
const baseModalClass = 'rich-text-upload-modal';

const insertUpload = ({
  value,
  relationTo,
  activeEditor,
}) => {
  console.log('insertUpload value:', value, 'relationTo:', relationTo);

  const rawImagePayload: RawImagePayload = {
    value,
    relationTo,
  };

  activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, rawImagePayload);
  console.log('Dispatched insert image command');

  // injectVoidElement(editor, upload);
};


export const UploadModal: React.FC<{activeEditor: LexicalEditor}> = ({ activeEditor }) => {
  const {
    t,
    i18n,
  } = useTranslation('upload');
  const {
    toggleModal,
  } = useModal();
  const {
    serverURL,
    routes: { api },
    collections,
  } = useConfig();
  const [availableCollections] = useState(() => collections.filter(({
    admin: { enableRichTextRelationship },
    upload,
  }) => (Boolean(upload) && enableRichTextRelationship)));
  const [modalCollectionOption, setModalCollectionOption] = useState<{ label: string, value: string }>(() => {
    const firstAvailableCollection = collections.find(({
      admin: { enableRichTextRelationship },
      upload,
    }) => (Boolean(upload) && enableRichTextRelationship));
    if (firstAvailableCollection) {
      return {
        label: getTranslation(firstAvailableCollection.labels.singular, i18n),
        value: firstAvailableCollection.slug,
      };
    }

    return undefined;
  });
  const [modalCollection, setModalCollection] = useState<SanitizedCollectionConfig>(() => collections.find(({
    admin: { enableRichTextRelationship },
    upload,
  }) => (Boolean(upload) && enableRichTextRelationship)));
  const [fields, setFields] = useState(() => (modalCollection ? formatFields(modalCollection, t) : undefined));
  const [limit, setLimit] = useState<number>();
  const [sort, setSort] = useState(null);
  const [where, setWhere] = useState(null);
  const [page, setPage] = useState(null);

  const modalSlug = 'lexicalRichText-add-upload';
  const moreThanOneAvailableCollection = availableCollections.length > 1;

  // If modal is open, get active page of upload gallery
  const apiURL = `${serverURL}${api}/${modalCollection.slug}`;
  const [{ data }, { setParams }] = usePayloadAPI(apiURL, {});

  useEffect(() => {
    if (modalCollection) {
      setFields(formatFields(modalCollection, t));
    }
  }, [modalCollection, t]);


  useEffect(() => {
    const params: {
      page?: number
      sort?: string
      where?: unknown
      limit?: number
    } = {};

    if (page) params.page = page;
    if (where) params.where = where;
    if (sort) params.sort = sort;
    if (limit) params.limit = limit;

    setParams(params);
  }, [setParams, page, sort, where, limit]);

  useEffect(() => {
    if (modalCollectionOption) {
      setModalCollection(collections.find(({ slug }) => modalCollectionOption.value === slug));
    }
  }, [modalCollectionOption, collections]);

  if (!modalCollection) {
    return null;
  }


  return (
    <Fragment>
      <MinimalTemplate width="wide">
        <header className={`${baseModalClass}__header`}>
          <h1>
            {t('fields:addLabel', { label: getTranslation(modalCollection.labels.singular, i18n) })}
          </h1>
          <Button
            icon="x"
            round
            buttonStyle="icon-label"
            iconStyle="with-border"
            onClick={() => {
              toggleModal(modalSlug);
            }}
          />
        </header>
        {moreThanOneAvailableCollection && (
          <div className={`${baseModalClass}__select-collection-wrap`}>
            <Label label={t('selectCollectionToBrowse')} />
            <ReactSelect
              className={`${baseClass}__select-collection`}
              value={modalCollectionOption}
              onChange={setModalCollectionOption}
              options={availableCollections.map((coll) => ({
                label: getTranslation(coll.labels.singular, i18n),
                value: coll.slug,
              }))}
            />
          </div>
        )}
        <ListControls
          collection={{
            ...modalCollection,
            fields,
          }}
          enableColumns={false}
          enableSort
          modifySearchQuery={false}
          handleSortChange={setSort}
          handleWhereChange={setWhere}
        />
        <UploadGallery
          docs={data?.docs}
          collection={modalCollection}
          onCardClick={(doc) => {
            insertUpload({
              value: {
                id: doc.id,
              },
              relationTo: modalCollection.slug,
              activeEditor,
            });
            toggleModal(modalSlug);
          }}
        />
        <div className={`${baseModalClass}__page-controls`}>
          <Paginator
            limit={data.limit}
            totalPages={data.totalPages}
            page={data.page}
            hasPrevPage={data.hasPrevPage}
            hasNextPage={data.hasNextPage}
            prevPage={data.prevPage}
            nextPage={data.nextPage}
            numberOfNeighbors={1}
            onChange={setPage}
            disableHistoryChange
          />
          {data?.totalDocs > 0 && (
            <Fragment>
              <div className={`${baseModalClass}__page-info`}>
                {data.page}
                -
                {data.totalPages > 1 ? data.limit : data.totalDocs}
                {' '}
                {t('general:of')}
                {' '}
                {data.totalDocs}
              </div>
              <PerPage
                limits={modalCollection?.admin?.pagination?.limits}
                limit={limit}
                modifySearchParams={false}
                handleChange={setLimit}
              />
            </Fragment>
          )}
        </div>
      </MinimalTemplate>
    </Fragment>
  );
};
