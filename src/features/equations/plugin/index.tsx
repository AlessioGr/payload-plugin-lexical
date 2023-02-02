/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'katex/dist/katex.css';
import './modal.scss';
import './index.scss';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $wrapNodeInElement } from '@lexical/utils';
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
  LexicalEditor,
} from 'lexical';
import { useCallback, useEffect } from 'react';
import * as React from 'react';

import { useModal } from '@faceless-ui/modal';
import { useEditDepth } from 'payload/dist/admin/components/utilities/EditDepth';
import { formatDrawerSlug } from 'payload/dist/admin/components/elements/Drawer';
import { Drawer } from "payload/dist/admin/components/elements/Drawer";
import Button from "payload/dist/admin/components/elements/Button";
import X from "payload/dist/admin/components/icons/X";
import { Gutter } from 'payload/dist/admin/components/elements/Gutter';
import { $createEquationNode, EquationNode } from '../node/EquationNode';
import { EditorConfig } from '../../../types';
import KatexEquationAlterer from '../ui/KatexEquationAlterer';


type CommandPayload = {
  equation: string;
  inline: boolean;
};

export const INSERT_EQUATION_COMMAND: LexicalCommand<CommandPayload> = createCommand('INSERT_EQUATION_COMMAND');

const baseClass = "rich-text-equation-modal";

export function InsertEquationDrawer(props: {
  activeEditor: LexicalEditor;
  editorConfig: EditorConfig;
}): JSX.Element {

  const {activeEditor, editorConfig} = props;

  const editDepth = useEditDepth();

  const equationDrawerSlug = formatDrawerSlug({
    slug: `lexicalRichText-add-equation`,
    depth: editDepth,
  });

  const {
    toggleModal,
  } = useModal();

  const onEquationConfirm = useCallback(
    (equation: string, inline: boolean) => {
      activeEditor.dispatchCommand(INSERT_EQUATION_COMMAND, { equation, inline });
      toggleModal(equationDrawerSlug);
    },
    [activeEditor/* , onClose */],
  );

  return (
    <Drawer slug={equationDrawerSlug} key={equationDrawerSlug} className={baseClass}>
      <Gutter className={`${baseClass}__template`}>
        <header className={`${baseClass}__header`}>
          <h2 className={`${baseClass}__header-text`}>Add equation</h2>
          <Button
            className={`${baseClass}__header-close`}
            buttonStyle="none"
            onClick={() => {
              toggleModal(equationDrawerSlug);
            }}
          >
            <X />
          </Button>
        </header>
        <KatexEquationAlterer onConfirm={onEquationConfirm} />
      </Gutter>
    </Drawer>
  );

}

export default function EquationsPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([EquationNode])) {
      throw new Error(
        'EquationsPlugins: EquationsNode not registered on editor',
      );
    }

    return editor.registerCommand<CommandPayload>(
      INSERT_EQUATION_COMMAND,
      (payload) => {
        const { equation, inline } = payload;
        const equationNode = $createEquationNode(equation, inline);

        $insertNodes([equationNode]);
        if ($isRootOrShadowRoot(equationNode.getParentOrThrow())) {
          $wrapNodeInElement(equationNode, $createParagraphNode).selectEnd();
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
