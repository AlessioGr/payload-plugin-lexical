import * as React from 'react';
import { useCallback, useState, ReactNode, useMemo, createContext, useContext } from 'react';

import { useConfig } from 'payload/components/utilities';
import { formatDrawerSlug } from 'payload/dist/admin/components/elements/Drawer';
import { formatListDrawerSlug } from 'payload/dist/admin/components/elements/ListDrawer';
import { useEditDepth } from 'payload/dist/admin/components/utilities/EditDepth';
import { type SanitizedCollectionConfig } from 'payload/types';

import { useModal } from '@faceless-ui/modal';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { COMMAND_PRIORITY_NORMAL, createCommand, type LexicalCommand } from 'lexical';

import { useEditorConfigContext } from '@/fields/LexicalRichText/LexicalEditorComponent';
import { type ImagePayload } from '@/fields/LexicalRichText/nodes/ImageNode';
import {
  InsertTableDialog,
  InsertNewTableDialog,
} from '@/fields/LexicalRichText/plugins/TablePlugin';
import { INSERT_IMAGE_COMMAND } from '@/fields/LexicalRichText/plugins/UploadPlugin';
import { ListDrawer } from '@/fields/LexicalRichText/plugins/UploadPlugin/modal';
import { type EditorConfig } from '@/types';

export const OPEN_MODAL_COMMAND: LexicalCommand<'upload' | 'table' | string> =
  createCommand('OPEN_MODAL_COMMAND');

export default function ModalPlugin(props: { editorConfig: EditorConfig }): JSX.Element {
  const editorConfig = props.editorConfig;
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);

  const { uuid } = useEditorConfigContext();
  const {
    toggleModal = () => {
      console.log('Error: useModal() from FacelessUI did not work correctly');
    },
    openModal,
    closeModal,
    isModalOpen = () => false,
  } = useModal();

  const editDepth = useEditDepth();

  const addUploadDrawerSlug = formatListDrawerSlug({
    uuid,
    depth: editDepth,
  });

  // Register commands:
  editor.registerCommand<'upload' | 'table' | string>(
    OPEN_MODAL_COMMAND,
    (toOpen: 'upload' | 'table' | string) => {
      if (toOpen === 'upload') {
        toggleModal(addUploadDrawerSlug);
      } else if (toOpen === 'table') {
        const addTableDrawerSlug = formatDrawerSlug({
          slug: `lexicalRichText-add-table-${uuid}`,
          depth: editDepth,
        });
        toggleModal(addTableDrawerSlug);
      } else if (toOpen === 'newtable') {
        const addNewTableDrawerSlug = formatDrawerSlug({
          slug: `lexicalRichText-add-newtable-${uuid}`,
          depth: editDepth,
        });
        toggleModal(addNewTableDrawerSlug);
      } else {
        for (const feature of editorConfig.features) {
          if (feature.modals != null && feature.modals.length > 0) {
            for (const featureModal of feature.modals) {
              if (toOpen === featureModal.openModalCommand.type) {
                featureModal.openModalCommand.command(toggleModal, editDepth, uuid);
                return true;
              }
            }
          }
        }
      }

      return true;
    },
    COMMAND_PRIORITY_NORMAL
  );

  // For upload
  interface options {
    uploads: boolean;
  }

  type FilteredCollectionsT = (
    collections: SanitizedCollectionConfig[],
    options?: options
  ) => SanitizedCollectionConfig[];
  const filterRichTextCollections: FilteredCollectionsT = (collections, options) => {
    return collections.filter(({ admin: { enableRichTextRelationship }, upload }) => {
      if (options?.uploads != null) {
        return enableRichTextRelationship && Boolean(upload);
      }

      return upload != null ? false : enableRichTextRelationship;
    });
  };

  const uploads = true; // TODO: what does it do?
  const { collections } = useConfig();
  const [enabledCollectionSlugs] = React.useState(() =>
    filterRichTextCollections(collections, { uploads }).map(({ slug }) => slug)
  );

  /* const [
    ListDrawer,
    _,
    { closeDrawer, openDrawer, toggleDrawer },
  ] = useListDrawer({
    uploads: true,
    collectionSlugs: enabledCollectionSlugs,
  }); */

  const onUploadSelect = useCallback(
    ({ docID, collectionConfig }) => {
      insertUpload({
        value: {
          id: docID,
        },
        relationTo: collectionConfig.slug,
        activeEditor,
      });
      closeModal(addUploadDrawerSlug);
    },
    [editor, closeModal]
  );
  const insertUpload = ({ value, relationTo, activeEditor }): void => {
    console.log('insertUpload value:', value, 'relationTo:', relationTo);

    const imagePayload: ImagePayload = {
      rawImagePayload: {
        value,
        relationTo,
      },
    };

    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, imagePayload);
    console.log('Dispatched insert image command');

    // injectVoidElement(editor, upload);
  };

  return (
    <>
      <ListDrawer
        onSelect={onUploadSelect}
        drawerSlug={addUploadDrawerSlug}
        collectionSlugs={enabledCollectionSlugs}
      />

      <InsertTableDialog />
      <InsertNewTableDialog />

      {editorConfig.features.map((feature) => {
        if (feature.modals != null && feature.modals.length > 0) {
          return feature.modals.map((customModal) => {
            return customModal?.modal != null ? customModal.modal({ editorConfig }) : null;
          });
        }
        return null;
      })}
    </>
  );
}
