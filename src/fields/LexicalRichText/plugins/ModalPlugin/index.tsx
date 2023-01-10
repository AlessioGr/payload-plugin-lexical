import { EditorConfig } from "../../../../types";
import * as React from "react";
import {
  useListDrawer,
} from "payload/dist/admin/components/elements/ListDrawer";
import { InsertTableDialog } from "../TablePlugin";
import { InsertEquationDialog } from "../EquationsPlugin";
import { ImagePayload } from "../../nodes/ImageNode";
import { INSERT_IMAGE_COMMAND } from "../UploadPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  COMMAND_PRIORITY_NORMAL,
  createCommand,
  LexicalCommand,
} from "lexical";
import { Modal, useModal } from "@faceless-ui/modal";
import { useCallback, useState } from "react";
import { useEditDepth } from "payload/dist/admin/components/utilities/EditDepth";
import { formatDrawerSlug } from "payload/dist/admin/components/elements/Drawer";

export const OPEN_MODAL_COMMAND: LexicalCommand<
  "upload" | "table" | "equation" | "link" | string
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
    slug: `rich-text-link-lexicalRichText`, // TODO: Add uuid for the slug?
    depth: editDepth,
  });

  // Register commands:
  editor.registerCommand<"upload" | "table" | "equation" | "link" | string>(
    OPEN_MODAL_COMMAND,
    (toOpen: "upload" | "table" | "equation" | "link" | string) => {
      if (toOpen === "upload") {
        openDrawer();
      } else if (toOpen === "table") {
        toggleModal("lexicalRichText-add-table");
      } else if (toOpen === "equation") {
        toggleModal("lexicalRichText-add-equation");
      } else if (toOpen === "link") {
        //openModal(linkDrawerSlug); //TODO
      }else {
        for(const customModal of editorConfig.extraModals){
          if(toOpen === customModal.openModalCommand.type) {
            customModal.openModalCommand.command(toggleModal);
            continue;
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

      {isModalOpen("lexicalRichText-add-equation") && (
        <Modal
          className="rich-text-equation-modal"
          slug="lexicalRichText-add-equation"
        >
          <InsertEquationDialog activeEditor={activeEditor} />
        </Modal>
      )}



      {editorConfig.extraModals.map((customModal) => {
        return customModal.modal({editorConfig});
      })}
    </>
  );
}
