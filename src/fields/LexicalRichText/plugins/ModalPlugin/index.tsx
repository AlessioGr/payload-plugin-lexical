import { EditorConfig } from "../../../../types";
import * as React from "react";
import {
  useListDrawer,
} from "payload/dist/admin/components/elements/ListDrawer";
import { InsertTableDialog } from "../TablePlugin";
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
import { v4 as uuidv4 } from 'uuid';

export const OPEN_MODAL_COMMAND: LexicalCommand<
  "upload" | "table" | "link" | string
> = createCommand("OPEN_MODAL_COMMAND");

export default function ModalPlugin(props: {
  editorConfig: EditorConfig;
}): JSX.Element {
  const editorConfig = props.editorConfig;
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const {
    toggleModal = () => {
      console.log("Error: useModal() from FacelessUI did not work correctly");
    },
    openModal,
    isModalOpen = () => false,
  } = useModal();


  const editDepth = useEditDepth();

  const linkDrawerSlug = formatDrawerSlug({
    slug: `rich-text-link-lexicalRichText`,
    depth: editDepth,
  });

  const addTableDrawerSlug = formatDrawerSlug({
    slug: `lexicalRichText-add-table`,
    depth: editDepth,
  });

  
 
  // Register commands:
  editor.registerCommand<"upload" | "table" | "link" | string>(
    OPEN_MODAL_COMMAND,
    (toOpen: "upload" | "table" | "link" | string) => {
      if (toOpen === "upload") {
        openDrawer();
      } else if (toOpen === "table") {
        toggleModal("lexicalRichText-add-table");
      }else if (toOpen === "link") {
        //openModal(linkDrawerSlug); //TODO
      }else {
        for(const feature of editorConfig.features){
          if(feature.modals && feature.modals.length > 0){
            for(const featureModal of feature.modals){
              if(toOpen === featureModal.openModalCommand.type){
                featureModal.openModalCommand.command(toggleModal, editDepth);
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
  const [
    ListDrawer,
    ListDrawerToggler,
    { closeDrawer, openDrawer, toggleDrawer },
  ] = useListDrawer({
    uploads: true,
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

      {isModalOpen("lexicalRichText-add-table") && (
        <Modal
          className="rich-text-table-modal"
          slug="lexicalRichText-add-table"
        >
          <InsertTableDialog activeEditor={activeEditor} onClose={() => {}} />
        </Modal>
      )}


      {editorConfig.features.map((feature) => {
        if(feature.modals && feature.modals.length > 0) {
          return feature.modals.map((customModal) => {
            return customModal.modal({activeEditor, editorConfig});
          });
        }
      })}
    </>
  );
}
