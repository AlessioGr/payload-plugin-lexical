import { EditorConfig, Feature } from '../../types';
import * as React from "react";
import HorizontalRulePlugin from './plugins';
import { $createHorizontalRuleNode, $isHorizontalRuleNode, HorizontalRuleNode, INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { LexicalEditor, LexicalNode } from 'lexical';
import { ComponentPickerOption } from '../../fields/LexicalRichText/plugins/ComponentPickerPlugin';
import { DropDownItem } from '../../fields/LexicalRichText/ui/DropDown';
import { ElementTransformer } from '@lexical/markdown';


export function HorizontalRuleFeature(props: {}): Feature {

    const horizontalRuleMarkdownElementTransformer: ElementTransformer = {
        dependencies: [HorizontalRuleNode],
        export: (node: LexicalNode) => {
          return $isHorizontalRuleNode(node) ? "***" : null;
        },
        regExp: /^(---|\*\*\*|___)\s?$/,
        replace: (parentNode, _1, _2, isImport) => {
          const line = $createHorizontalRuleNode();
      
          // TODO: Get rid of isImport flag
          if (isImport || parentNode.getNextSibling() != null) {
            parentNode.replace(line);
          } else {
            parentNode.insertBefore(line);
          }
      
          line.selectNext();
        },
        type: "element",
      };

    const componentPickerOption = (editor: LexicalEditor, editorConfig: EditorConfig) => new ComponentPickerOption("Horizontal Rule", {
        icon: <i className="icon horizontal-rule" />,
        keywords: ["horizontal rule", "divider", "hr"],
        onSelect: () =>
            editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined),
    })

    return {
        plugins: [
            {
                component: (<HorizontalRulePlugin key="horizontalrule" />),
            }
        ],
        nodes: [
            HorizontalRuleNode
        ],
        toolbar: {
            insert: [
                (editor: LexicalEditor, editorConfig: EditorConfig) => {
                    return (
                        <DropDownItem
                            key="horizontalrule"
                            onClick={() => {
                                editor.dispatchCommand(
                                    INSERT_HORIZONTAL_RULE_COMMAND,
                                    undefined
                                );
                            }}
                            className="item"
                        >
                            <i className="icon horizontal-rule" />
                            <span className="text">Horizontal Rule</span>
                        </DropDownItem>

                    );
                }
            ]
        },
        componentPicker: {
            componentPickerOptions: [
                componentPickerOption
            ]
        },
        markdownTransformers: [horizontalRuleMarkdownElementTransformer]

    }
}