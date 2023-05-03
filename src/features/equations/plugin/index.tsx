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

import { useCallback, useEffect, useState } from 'react';
import * as React from 'react';

import Button from 'payload/dist/admin/components/elements/Button';
import {
  Drawer,
  formatDrawerSlug,
} from 'payload/dist/admin/components/elements/Drawer';
import { Gutter } from 'payload/dist/admin/components/elements/Gutter';
import X from 'payload/dist/admin/components/icons/X';
import { useEditDepth } from 'payload/dist/admin/components/utilities/EditDepth';

import { useModal } from '@faceless-ui/modal';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $wrapNodeInElement } from '@lexical/utils';
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  type LexicalCommand,
  LexicalEditor,
} from 'lexical';



import { useEditorConfigContext } from '../../../fields/LexicalRichText/LexicalEditorComponent';
import { type EditorConfig } from '../../../types';
import { $createEquationNode, EquationNode } from '../node/EquationNode';
import KatexEquationAlterer from '../ui/KatexEquationAlterer';

interface CommandPayload {
  equation: string;
  inline: boolean;
}

export const INSERT_EQUATION_COMMAND: LexicalCommand<CommandPayload> =
  createCommand('INSERT_EQUATION_COMMAND');

const baseClass = 'rich-text-equation-modal';

export function InsertEquationDrawer(props: {
  editorConfig: EditorConfig;
}): JSX.Element {
  const { uuid } = useEditorConfigContext();

  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);

  const editDepth = useEditDepth();

  const equationDrawerSlug = formatDrawerSlug({
    slug: `lexicalRichText-add-equation` + uuid,
    depth: editDepth,
  });

  const { toggleModal } = useModal();

  const onEquationConfirm = useCallback(
    (equation: string, inline: boolean) => {
      toggleModal(equationDrawerSlug);
      activeEditor.dispatchCommand(INSERT_EQUATION_COMMAND, {
        equation,
        inline,
      });
    },
    [activeEditor /* , onClose */],
  );

  return (
    <Drawer
      slug={equationDrawerSlug}
      key={equationDrawerSlug}
      className={baseClass}
      title="Add equation">
      <KatexEquationAlterer onConfirm={onEquationConfirm} />
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
        editor.update(() => {
          const equationNode = $createEquationNode(equation, inline);
          $insertNodes([equationNode]);
          if ($isRootOrShadowRoot(equationNode.getParentOrThrow())) {
            $wrapNodeInElement(equationNode, $createParagraphNode).selectEnd();
          }
        });

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
