import * as React from 'react';

import { formatDrawerSlug } from 'payload/dist/admin/components/elements/Drawer';

import { type TextMatchTransformer } from '@lexical/markdown';
import { type LexicalEditor } from 'lexical';

import {
  $createEquationNode,
  $isEquationNode,
  EquationNode,
} from './node/EquationNode';
import EquationsPlugin, { InsertEquationDrawer } from './plugin';
import { ComponentPickerOption } from '../../fields/LexicalRichText/plugins/ComponentPickerPlugin';
import { OPEN_MODAL_COMMAND } from '../../fields/LexicalRichText/plugins/ModalPlugin';
import { DropDownItem } from '../../fields/LexicalRichText/ui/DropDown';
import { type EditorConfig, type Feature } from '../../types';

export function EquationsFeature(props: {}): Feature {
  const equationMarkdownTextMatchTransformer: TextMatchTransformer = {
    dependencies: [EquationNode],
    export: (node) => {
      if (!$isEquationNode(node)) {
        return null;
      }

      return `$${node.getEquation()}$`;
    },
    importRegExp: /\$([^$]+?)\$/,
    regExp: /\$([^$]+?)\$$/,
    replace: (textNode, match) => {
      const [, equation] = match;
      const equationNode = $createEquationNode(equation, true);
      textNode.replace(equationNode);
    },
    trigger: '$',
    type: 'text-match',
  };

  const componentPickerOption = (
    editor: LexicalEditor,
    editorConfig: EditorConfig,
  ) =>
    new ComponentPickerOption('Equation', {
      icon: <i className="icon equation" />,
      keywords: ['equation', 'latex', 'math'],
      onSelect: () => {
        editor.dispatchCommand(OPEN_MODAL_COMMAND, 'equation');
      },
    });

  return {
    plugins: [
      {
        component: <EquationsPlugin key="equations" />,
      },
    ],
    nodes: [EquationNode],
    tableCellNodes: [EquationNode],
    modals: [
      {
        modal: InsertEquationDrawer,
        openModalCommand: {
          type: 'equation',
          command: (toggleModal, editDepth, uuid: string) => {
            const addEquationDrawerSlug = formatDrawerSlug({
              slug: `lexicalRichText-add-equation` + uuid,
              depth: editDepth,
            });
            toggleModal(addEquationDrawerSlug);
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
                editor.dispatchCommand(OPEN_MODAL_COMMAND, 'equation');
              }}
              className="item">
              <i className="icon equation" />
              <span className="text">Equation</span>
            </DropDownItem>
          );
        },
      ],
    },
    componentPicker: {
      componentPickerOptions: [componentPickerOption],
    },
    markdownTransformers: [equationMarkdownTextMatchTransformer],
  };
}
