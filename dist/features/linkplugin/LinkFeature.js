"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkFeature = void 0;
const React = __importStar(require("react"));
const floatingLinkEditor_1 = __importDefault(require("./floatingLinkEditor"));
const link_1 = __importDefault(require("./plugins/link"));
const LinkNodeModified_1 = require("./nodes/LinkNodeModified");
const AutoLinkNodeModified_1 = require("./nodes/AutoLinkNodeModified");
const autoLink_1 = __importDefault(require("./plugins/autoLink/"));
const LexicalClickableLinkPlugin_1 = __importDefault(require("@lexical/react/LexicalClickableLinkPlugin"));
/*import { getSelectedNode } from '../../fields/LexicalRichText/utils/getSelectedNode';
import { $getSelection, $isRangeSelection, CAN_REDO_COMMAND, CAN_UNDO_COMMAND, COMMAND_PRIORITY_CRITICAL, SELECTION_CHANGE_COMMAND } from 'lexical';
import { OPEN_MODAL_COMMAND } from '../../fields/LexicalRichText/plugins/ModalPlugin';
import { useState, useCallback, useEffect } from 'react';
*/
function LinkFeature(props) {
    //TODO: Modularize link modal, toolbarplugin and floatingtexttoolbarplugin
    return {
        floatingAnchorElemPlugins: [
            (floatingAnchorElem) => (React.createElement(floatingLinkEditor_1.default, { anchorElem: floatingAnchorElem, key: "floatinglinkeditor" })),
        ],
        tablePlugins: [
            React.createElement(link_1.default, { key: "linkplugin" }),
            React.createElement(LexicalClickableLinkPlugin_1.default, { key: "clickablelinkplugin" }),
        ],
        subEditorPlugins: [React.createElement(link_1.default, { key: "linkplugin" })],
        plugins: [
            {
                component: React.createElement(link_1.default, { key: "linkplugin" }),
            },
            {
                component: React.createElement(LexicalClickableLinkPlugin_1.default, { key: "clickablelinkplugin" }),
                onlyIfNotEditable: true,
            },
            {
                component: React.createElement(autoLink_1.default, { key: "autolinkplugin" }),
            },
        ],
        nodes: [LinkNodeModified_1.LinkNode, AutoLinkNodeModified_1.AutoLinkNode],
        tableCellNodes: [LinkNodeModified_1.LinkNode, AutoLinkNodeModified_1.AutoLinkNode],
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
exports.LinkFeature = LinkFeature;
//# sourceMappingURL=LinkFeature.js.map