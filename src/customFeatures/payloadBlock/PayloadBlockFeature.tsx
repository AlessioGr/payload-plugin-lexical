
import { LexicalEditor } from 'lexical';
import { formatDrawerSlug } from 'payload/dist/admin/components/elements/Drawer';
import * as React from "react";
import { OPEN_MODAL_COMMAND } from '../../../plugin-lexical/fields/LexicalRichText/plugins/ModalPlugin';
import { DropDownItem } from '../../../plugin-lexical/fields/LexicalRichText/ui/DropDown';
import { EditorConfig, Feature } from '../../../plugin-lexical/types';
import {PayloadBlockPlugin} from "./plugins/PayloadBlockPlugin";
import {PayloadBlockNode} from "./nodes/PayloadBlockNode";
import {InsertPayloadBlockDialog} from "./modal/PayloadBlockDrawer";


export function PayloadBlockFeature(props: {}): Feature {
    return {
        plugins: [
            {
                component: (<PayloadBlockPlugin key="payloadBlock" />),
            }
        ],
        nodes: [
            PayloadBlockNode
        ],
        modals: [
            {
                modal: InsertPayloadBlockDialog,
                openModalCommand: {
                    type: "payloadBlock",
                    command: (toggleModal, editDepth,uuid) => {

                        const payloadBlockDrawerSlug = formatDrawerSlug({
                            slug: `payloadBlock`+uuid,
                            depth: editDepth,
                        });
                        toggleModal(payloadBlockDrawerSlug);
                    }
                }
            }
        ],
        toolbar: {
            insert: [
                (editor: LexicalEditor, editorConfig: EditorConfig) => {
                    return (
                        <DropDownItem
                            key="payloadBlock"
                            onClick={() => {
                                editor.dispatchCommand(OPEN_MODAL_COMMAND, "payloadBlock");
                            }}
                            className="item"
                        >
                            <i className="icon block" />
                            <span className="text">Payload Block</span>
                        </DropDownItem>
                    );
                }
            ]
        }

    }
}
