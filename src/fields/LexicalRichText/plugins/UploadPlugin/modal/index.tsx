import * as React from 'react';
import { useCallback, useEffect, useId, useMemo, useState } from 'react';

import { useEditDepth } from 'payload/components/utilities';
import { Drawer } from 'payload/dist/admin/components/elements/Drawer';
import {
  baseClass,
  formatListDrawerSlug,
  ListDrawerToggler,
} from 'payload/dist/admin/components/elements/ListDrawer';
import { ListDrawerContent } from 'payload/dist/admin/components/elements/ListDrawer/DrawerContent';
import {
  type ListDrawerProps,
  type UseListDrawer,
} from 'payload/dist/admin/components/elements/ListDrawer/types';
import { useConfig } from 'payload/dist/admin/components/utilities/Config';

import { useModal } from '@faceless-ui/modal';



export const ListDrawer: React.FC<ListDrawerProps> = (props) => {
  const { drawerSlug } = props;

  return (
    <Drawer
      slug={drawerSlug}
      className={baseClass}
      header={false}
      gutter={false}>
      <ListDrawerContent {...props} />
    </Drawer>
  );
};

export const useListDrawer: UseListDrawer = ({
  collectionSlugs: collectionSlugsFromProps,
  uploads,
  selectedCollection,
  filterOptions,
}) => {
  const { collections } = useConfig();
  const drawerDepth = useEditDepth();
  const uuid = useId();
  const { modalState, toggleModal, closeModal, openModal } = useModal();
  const [isOpen, setIsOpen] = useState(false);
  const [collectionSlugs, setCollectionSlugs] = useState(
    collectionSlugsFromProps,
  );

  const drawerSlug = formatListDrawerSlug({
    depth: drawerDepth,
    uuid,
  });

  useEffect(() => {
    setIsOpen(Boolean(modalState[drawerSlug]?.isOpen));
  }, [modalState, drawerSlug]);

  useEffect(() => {
    if ((collectionSlugs == null) || collectionSlugs.length === 0) {
      const filteredCollectionSlugs = collections.filter(({ upload }) => {
        if (uploads) {
          return Boolean(upload);
        }
        return true;
      });

      setCollectionSlugs(filteredCollectionSlugs.map(({ slug }) => slug));
    }
  }, [collectionSlugs, uploads, collections]);
  const toggleDrawer = useCallback(() => {
    toggleModal(drawerSlug);
  }, [toggleModal, drawerSlug]);

  const closeDrawer = useCallback(() => {
    closeModal(drawerSlug);
  }, [drawerSlug, closeModal]);

  const openDrawer = useCallback(() => {
    openModal(drawerSlug);
  }, [drawerSlug, openModal]);

  const MemoizedDrawer = useMemo(() => {
    return (props) => (
      <ListDrawer
        {...props}
        drawerSlug={drawerSlug}
        collectionSlugs={collectionSlugs}
        uploads={uploads}
        closeDrawer={closeDrawer}
        key={drawerSlug}
        selectedCollection={selectedCollection}
        filterOptions={filterOptions}
      />
    );
  }, [
    drawerSlug,
    collectionSlugs,
    uploads,
    closeDrawer,
    selectedCollection,
    filterOptions,
  ]);

  const MemoizedDrawerToggler = useMemo(() => {
    return (props) => <ListDrawerToggler {...props} drawerSlug={drawerSlug} />;
  }, [drawerSlug]);

  const MemoizedDrawerState = useMemo(
    () => ({
      drawerSlug,
      drawerDepth,
      isDrawerOpen: isOpen,
      toggleDrawer,
      closeDrawer,
      openDrawer,
    }),
    [drawerDepth, drawerSlug, isOpen, toggleDrawer, closeDrawer, openDrawer],
  );

  return [MemoizedDrawer, MemoizedDrawerToggler, MemoizedDrawerState];
};
