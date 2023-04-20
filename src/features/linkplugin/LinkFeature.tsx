import { Feature } from '../../types';
import * as React from 'react';
import FloatingLinkEditorPlugin from './floatingLinkEditor';
import LinkPlugin from './plugins/link';
import {
  $isLinkNode,
  LinkAttributes,
  LinkNode,
  TOGGLE_LINK_COMMAND,
} from './nodes/LinkNodeModified';
import { AutoLinkNode } from './nodes/AutoLinkNodeModified';
import AutoLinkPlugin from './plugins/autoLink/';
import LexicalClickableLinkPlugin from '@lexical/react/LexicalClickableLinkPlugin';

/*import { getSelectedNode } from '../../fields/LexicalRichText/utils/getSelectedNode';
import { $getSelection, $isRangeSelection, CAN_REDO_COMMAND, CAN_UNDO_COMMAND, COMMAND_PRIORITY_CRITICAL, SELECTION_CHANGE_COMMAND } from 'lexical';
import { OPEN_MODAL_COMMAND } from '../../fields/LexicalRichText/plugins/ModalPlugin';
import { useState, useCallback, useEffect } from 'react';
*/
export function LinkFeature(props: {}): Feature {
  //TODO: Modularize link modal, toolbarplugin and floatingtexttoolbarplugin

  return {
    floatingAnchorElemPlugins: [
      (floatingAnchorElem) => (
        <FloatingLinkEditorPlugin
          anchorElem={floatingAnchorElem}
          key="floatinglinkeditor"
        />
      ),
    ],
    tablePlugins: [
      <LinkPlugin key="linkplugin" />,
      <LexicalClickableLinkPlugin key="clickablelinkplugin" />,
    ],
    subEditorPlugins: [<LinkPlugin key="linkplugin" />],
    plugins: [
      {
        component: <LinkPlugin key="linkplugin" />,
      },
      {
        component: <LexicalClickableLinkPlugin key="clickablelinkplugin" />,
        onlyIfNotEditable: true,
      },
      {
        component: <AutoLinkPlugin key="autolinkplugin" />,
      },
    ],
    nodes: [LinkNode, AutoLinkNode],
    tableCellNodes: [LinkNode, AutoLinkNode],
    floatingTextFormatToolbar: {}, // TODO: Exctracting this here is too much of a brainfuck - even worse than for toolbar. Some react expert should look at this!
    // TODO: For now, disabled & moved to toolbar.tsx (hardcoded & unmodularized), as this below approach broke the code block
    /* toolbar: {
            normal: [
                (editor, editorConfig, isEditable) => { //TODO: too much duplicated code copied over from toolbar. Some react expert should look at this!
                    const [isLink, setIsLink] = useState(false);

                    const updateToolbar = useCallback(() => {
                        const selection = $getSelection();

                        if ($isRangeSelection(selection)) {
                            // Update links
                            const selection = $getSelection();
                            if ($isRangeSelection(selection)) {
                                const node = getSelectedNode(selection);
                                const parent = node.getParent();
                                if ($isLinkNode(parent) || $isLinkNode(node)) {
                                    setIsLink(true);
                                } else {
                                    setIsLink(false);
                                }
                            }
                        }
                    }, [editor]);

                    useEffect(() => {
                        return editor.registerCommand(
                            SELECTION_CHANGE_COMMAND,
                            (_payload, newEditor) => {
                                updateToolbar();
                                return false;
                            },
                            COMMAND_PRIORITY_CRITICAL
                        );
                    }, [editor, updateToolbar]);



                    const insertLink = useCallback(() => {
                        if (!isLink) {
                            const linkAttributes: LinkAttributes = {
                                linkType: "custom",
                                url: "https://",
                            }
                            editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkAttributes);
                        } else {
                            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
                        }
                    }, [editor, isLink]);

                    return (
                        <button
                            key="link"
                            type="button"
                            disabled={!isEditable}
                            onClick={(event) => {
                                event.preventDefault();
                                insertLink();
                                editor.dispatchCommand(OPEN_MODAL_COMMAND, "link");
                            }}
                            className={`toolbar-item spaced ${isLink ? "active" : ""}`}
                            aria-label="Insert link"
                            title="Insert link"
                        >
                            <i className="format link" />
                        </button>
                    );
                }
            ]
        }*/
  };
}
