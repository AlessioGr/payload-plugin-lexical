/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "./modal.scss"
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import {
  $createNodeSelection,
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  EditorThemeClasses,
  Klass,
  LexicalCommand,
  LexicalEditor,
  LexicalNode,
} from 'lexical';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as React from 'react';
import invariant from '../../shared/invariant';

import { $createTableNodeWithDimensions, TableNode } from '../../nodes/TableNode';
import Button from 'payload/dist/admin/components/elements/Button'
import { DialogActions } from '../../ui/Dialog';
import TextInput from '../../ui/TextInput';
import {useEditDepth} from "payload/dist/admin/components/utilities/EditDepth";
import {Drawer, formatDrawerSlug} from "payload/dist/admin/components/elements/Drawer";
import {useModal} from "@faceless-ui/modal";
import {Gutter} from "payload/dist/admin/components/elements/Gutter";
import X from "payload/dist/admin/components/icons/X";
import {useEditorConfigContext} from "../../LexicalEditorComponent";

export type InsertTableCommandPayload = Readonly<{
  columns: string;
  rows: string;
  includeHeaders?: boolean;
}>;

export type CellContextShape = {
  cellEditorConfig: null | CellEditorConfig;
  cellEditorPlugins: null | JSX.Element | Array<JSX.Element>;
  set: (
    cellEditorConfig: null | CellEditorConfig,
    cellEditorPlugins: null | JSX.Element | Array<JSX.Element>,
  ) => void;
};

export type CellEditorConfig = Readonly<{
  namespace: string;
  nodes?: ReadonlyArray<Klass<LexicalNode>>;
  onError: (error: Error, editor: LexicalEditor) => void;
  readOnly?: boolean;
  theme?: EditorThemeClasses;
}>;

export const INSERT_NEW_TABLE_COMMAND: LexicalCommand<InsertTableCommandPayload> = createCommand('INSERT_NEW_TABLE_COMMAND');

export const CellContext = createContext<CellContextShape>({
  cellEditorConfig: null,
  cellEditorPlugins: null,
  set: () => {
    // Empty
  },
});

export function TableContext({ children }: {children: JSX.Element}) {
  const [contextValue, setContextValue] = useState<{
    cellEditorConfig: null | CellEditorConfig;
    cellEditorPlugins: null | JSX.Element | Array<JSX.Element>;
  }>({
    cellEditorConfig: null,
    cellEditorPlugins: null,
  });
  return (
    <CellContext.Provider
      value={useMemo(
        () => ({
          cellEditorConfig: contextValue.cellEditorConfig,
          cellEditorPlugins: contextValue.cellEditorPlugins,
          set: (cellEditorConfig, cellEditorPlugins) => {
            setContextValue({ cellEditorConfig, cellEditorPlugins });
          },
        }),
        [contextValue.cellEditorConfig, contextValue.cellEditorPlugins],
      )}
    >
      {children}
    </CellContext.Provider>
  );
}


const baseClass = "rich-text-table-modal";

export function InsertTableDialog({
}: {
}): JSX.Element {
  const { uuid} = useEditorConfigContext();

  const editDepth = useEditDepth();
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const tableDrawerSlug = formatDrawerSlug({
    slug: `lexicalRichText-add-table`+uuid,
    depth: editDepth,
  });
  const {
    toggleModal,
    closeModal
  } = useModal();

  const [rows, setRows] = useState('5');
  const [columns, setColumns] = useState('5');

  const onClick = () => {
    activeEditor.dispatchCommand(INSERT_TABLE_COMMAND, {
      columns,
      rows,
    });

    closeModal(tableDrawerSlug);
  };

  return (
      <Drawer slug={tableDrawerSlug} key={tableDrawerSlug} className={baseClass}>
        <Gutter className={`${baseClass}__template`}>
          <header className={`${baseClass}__header`}>
            <h2 className={`${baseClass}__header-text`}>Add table</h2>
            <Button
                className={`${baseClass}__header-close`}
                buttonStyle="none"
                onClick={() => {
                  closeModal(tableDrawerSlug);
                }}
            >
              <X />
            </Button>
          </header>
          <React.Fragment>
            <TextInput
                label="No of rows"
                onChange={setRows}
                value={rows}
                data-test-id="table-modal-rows"
            />
            <TextInput
                label="No of columns"
                onChange={setColumns}
                value={columns}
                data-test-id="table-modal-columns"
            />
            <DialogActions data-test-id="table-model-confirm-insert">
              <Button onClick={onClick}>Confirm</Button>
            </DialogActions>
          </React.Fragment>
        </Gutter>
      </Drawer>
  );
}

export function InsertNewTableDialog({
}: {
}): JSX.Element {
  const { uuid} = useEditorConfigContext();

  const editDepth = useEditDepth();
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const newTableDrawerSlug = formatDrawerSlug({
    slug: `lexicalRichText-add-newtable`+uuid,
    depth: editDepth,
  });
  const {
    toggleModal,
    closeModal
  } = useModal();

  const [rows, setRows] = useState('5');
  const [columns, setColumns] = useState('5');

  const onClick = () => {
    activeEditor.dispatchCommand(INSERT_NEW_TABLE_COMMAND, { columns, rows });
    closeModal(newTableDrawerSlug);
  };

  return (
      <Drawer slug={newTableDrawerSlug} key={newTableDrawerSlug} className={baseClass}>
        <Gutter className={`${baseClass}__template`}>
          <header className={`${baseClass}__header`}>
            <h2 className={`${baseClass}__header-text`}>Add new table (Experimental)</h2>
            <Button
                className={`${baseClass}__header-close`}
                buttonStyle="none"
                onClick={() => {
                  closeModal(newTableDrawerSlug);
                }}
            >
              <X />
            </Button>
          </header>
          <React.Fragment>
            <TextInput
                label="No of rows"
                onChange={setRows}
                value={rows}
                data-test-id="table-modal-rows"
            />
            <TextInput
                label="No of columns"
                onChange={setColumns}
                value={columns}
                data-test-id="table-modal-columns"
            />
            <DialogActions data-test-id="table-modal-confirm-insert">
              <Button onClick={onClick}>Confirm</Button>
            </DialogActions>
          </React.Fragment>
        </Gutter>
      </Drawer>
  );
}

export function TablePlugin({
  cellEditorConfig,
  children,
}: {
  cellEditorConfig: CellEditorConfig;
  children: JSX.Element | Array<JSX.Element>;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const cellContext = useContext(CellContext);

  useEffect(() => {
    if (!editor.hasNodes([TableNode])) {
      invariant(false, 'TablePlugin: TableNode is not registered on editor');
    }

    cellContext.set(cellEditorConfig, children);

    return editor.registerCommand<InsertTableCommandPayload>(
      INSERT_NEW_TABLE_COMMAND,
      ({ columns, rows, includeHeaders }) => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection)) {
          return true;
        }

        const { focus } = selection;
        const focusNode = focus.getNode();

        if (focusNode !== null) {
          const tableNode = $createTableNodeWithDimensions(
            Number(rows),
            Number(columns),
            includeHeaders,
          );

          if ($isRootOrShadowRoot(focusNode)) {
            const target = focusNode.getChildAtIndex(focus.offset);

            if (target !== null) {
              target.insertBefore(tableNode);
            } else {
              focusNode.append(tableNode);
            }

            tableNode.insertBefore($createParagraphNode());
          } else {
            const topLevelNode = focusNode.getTopLevelElementOrThrow();
            topLevelNode.insertAfter(tableNode);
          }

          tableNode.insertAfter($createParagraphNode());
          const nodeSelection = $createNodeSelection();
          nodeSelection.add(tableNode.getKey());
          $setSelection(nodeSelection);
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [cellContext, cellEditorConfig, children, editor]);

  return null;
}
