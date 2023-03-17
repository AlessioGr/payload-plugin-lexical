import { EditorConfig } from "../../../../types";
import * as React from "react";
import {
  useListDrawer,
} from "payload/dist/admin/components/elements/ListDrawer";
import { InsertTableDialog, InsertNewTableDialog } from "../TablePlugin";
import { ImagePayload } from "../../nodes/ImageNode";
import { INSERT_IMAGE_COMMAND } from "../UploadPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  COMMAND_PRIORITY_NORMAL,
  createCommand,
  LexicalCommand,
} from "lexical";
import { Modal, useModal } from "@faceless-ui/modal";
import { useCallback, useState, ReactNode, useMemo, createContext, useContext } from "react";
import { useEditDepth } from "payload/dist/admin/components/utilities/EditDepth";
import { formatDrawerSlug } from "payload/dist/admin/components/elements/Drawer";
import { SanitizedCollectionConfig } from 'payload/types';
import { useConfig } from 'payload/components/utilities';
import {useEditorConfigContext} from "../../LexicalEditorComponent";

export const OPEN_MODAL_COMMAND: LexicalCommand<
  "upload" | "table" | string
> = createCommand("OPEN_MODAL_COMMAND");

export default function ModalPlugin(props: {
  editorConfig: EditorConfig;
}): JSX.Element {
  const editorConfig = props.editorConfig;
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);

  const { uuid} = useEditorConfigContext();
  const {
    toggleModal = () => {
      console.log("Error: useModal() from FacelessUI did not work correctly");
    },
    openModal,
    isModalOpen = () => false,
  } = useModal();


  const editDepth = useEditDepth();



  // Register commands:
  editor.registerCommand<"upload" | "table" | string>(
    OPEN_MODAL_COMMAND,
    (toOpen: "upload" | "table" | string) => {
      if (toOpen === "upload") {
        openDrawer();
      } else if (toOpen === "table") {
        const addTableDrawerSlug = formatDrawerSlug({
          slug: `lexicalRichText-add-table`+uuid,
          depth: editDepth,
        });
        toggleModal(addTableDrawerSlug);
      } else if (toOpen === "newtable") {
        const addNewTableDrawerSlug = formatDrawerSlug({
          slug: `lexicalRichText-add-newtable`+uuid,
          depth: editDepth,
        });
        toggleModal(addNewTableDrawerSlug);
      } else {
        for(const feature of editorConfig.features){
          if(feature.modals && feature.modals.length > 0){
            for(const featureModal of feature.modals){
              if(toOpen === featureModal.openModalCommand.type){
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





  //For upload
  type options = { uploads: boolean };

  type FilteredCollectionsT = (collections: SanitizedCollectionConfig[], options?: options) => SanitizedCollectionConfig[];
  const filterRichTextCollections: FilteredCollectionsT = (collections, options) => {
    return collections.filter(({ admin: { enableRichTextRelationship }, upload }) => {
      if (options?.uploads) {
        return enableRichTextRelationship && Boolean(upload) === true;
      }

      return upload ? false : enableRichTextRelationship;
    });
  };

  const uploads = true; // TODO: what does it do?
  const { collections } = useConfig();
  const [enabledCollectionSlugs] = React.useState(() => filterRichTextCollections(collections, { uploads }).map(({ slug }) => slug));

  const [
    ListDrawer,
    ListDrawerToggler,
    { closeDrawer, openDrawer, toggleDrawer },
  ] = useListDrawer({
    uploads: true,
    collectionSlugs: enabledCollectionSlugs,
  });





  const onUploadSelect = useCallback(
    ({ docID, collectionConfig }) => {
      insertUpload({
        value: {
          id: docID,
        },
        relationTo: collectionConfig.slug,
        activeEditor,
      });
      closeDrawer();
    },
    [editor, closeDrawer]
  );
  const insertUpload = ({ value, relationTo, activeEditor }) => {
    console.log("insertUpload value:", value, "relationTo:", relationTo);

    const imagePayload: ImagePayload = {
      rawImagePayload: {
        value,
        relationTo,
      },
    };

    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, imagePayload);
    console.log("Dispatched insert image command");

    // injectVoidElement(editor, upload);
  };




  return (
    <>
      <ListDrawer onSelect={onUploadSelect} />

      <InsertTableDialog/>
      <InsertNewTableDialog />

      {editorConfig.features.map((feature) => {
        if(feature.modals && feature.modals.length > 0) {
          return feature.modals.map((customModal) => {

            return customModal?.modal ? customModal.modal({editorConfig}) : null;
          });
        }
      })}
    </>
  );
}
