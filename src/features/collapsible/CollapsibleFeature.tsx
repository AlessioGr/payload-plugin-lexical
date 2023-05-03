import * as React from 'react';

import { type LexicalEditor } from 'lexical';

import { CollapsibleContainerNode } from './nodes/CollapsibleContainerNode';
import { CollapsibleContentNode } from './nodes/CollapsibleContentNode';
import { CollapsibleTitleNode } from './nodes/CollapsibleTitleNode';
import CollapsiblePlugin, { INSERT_COLLAPSIBLE_COMMAND } from './plugins';
import { ComponentPickerOption } from '../../fields/LexicalRichText/plugins/ComponentPickerPlugin';
import { DropDownItem } from '../../fields/LexicalRichText/ui/DropDown';
import { type EditorConfig, type Feature } from '../../types';

export function CollapsibleFeature(): Feature {
  const componentPickerOption = (
    editor: LexicalEditor,
    editorConfig: EditorConfig
  ): ComponentPickerOption =>
    new ComponentPickerOption('Collapsible', {
      icon: <i className="icon caret-right" />,
      keywords: ['collapse', 'collapsible', 'toggle'],
      onSelect: () => editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined),
    });

  return {
    plugins: [
      {
        component: <CollapsiblePlugin key="collapsible" />,
      },
    ],
    nodes: [CollapsibleContainerNode, CollapsibleContentNode, CollapsibleTitleNode],
    toolbar: {
      insert: [
        (editor: LexicalEditor, editorConfig: EditorConfig) => {
          return (
            <DropDownItem
              key="collapsible"
              onClick={() => {
                editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined);
              }}
              className="item"
            >
              <i className="icon caret-right" />
              <span className="text">Collapsible container</span>
            </DropDownItem>
          );
        },
      ],
    },
    componentPicker: {
      componentPickerOptions: [componentPickerOption],
    },
  };
}
