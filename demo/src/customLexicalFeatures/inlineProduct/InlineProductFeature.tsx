import { formatDrawerSlug } from 'payload/distadmin/components/elements/Drawer/index';
import * as React from 'react';
import { InlineProductNode } from './nodes/InlineProductNode';
import { InlineProductPlugin } from './plugins/InlineProductPlugin';
import { InsertInlineProductDrawer } from './modals/modal/InlineProductDrawer';
import { LexicalEditor } from 'lexical';
import { Feature, EditorConfig } from '../../../../src/types';
import { DropDownItem } from '../../../../src/fields/LexicalRichText/ui/DropDown';
import { OPEN_MODAL_COMMAND } from '../../../../src/fields/LexicalRichText/plugins/ModalPlugin';

export function InlineProductFeature(props: {}): Feature {
  return {
    plugins: [
      {
        component: <InlineProductPlugin key="inlineProduct" />,
      },
    ],
    nodes: [InlineProductNode],
    modals: [
      {
        modal: InsertInlineProductDrawer,
        openModalCommand: {
          type: 'inlineProduct',
          command: (toggleModal, editDepth, uuid) => {
            const inlineProductDrawerSlug = formatDrawerSlug({
              slug: `inlineProduct` + uuid,
              depth: editDepth,
            });
            toggleModal(inlineProductDrawerSlug);
          },
        },
      },
    ],
    toolbar: {
      insert: [
        (editor: LexicalEditor, editorConfig: EditorConfig) => {
          return (
            <DropDownItem
              key="inlineProduct"
              onClick={() => {
                editor.dispatchCommand(OPEN_MODAL_COMMAND, 'inlineProduct');
              }}
              className="item"
            >
              <i className="icon product" />
              <span className="text">Inline Product</span>
            </DropDownItem>
          );
        },
      ],
    },
  };
}
