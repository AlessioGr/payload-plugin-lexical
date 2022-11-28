"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkPlugin = void 0;
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const LinkPluginModified_1 = require("./LinkPluginModified");
function LinkPlugin({ validateUrl }) {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => {
        if (!editor.hasNodes([LinkPluginModified_1.LinkNode])) {
            throw new Error('LinkPlugin: LinkNode not registered on editor');
        }
        return (0, utils_1.mergeRegister)(editor.registerCommand(LinkPluginModified_1.TOGGLE_LINK_COMMAND, (payload) => {
            console.log('Payload received:', payload);
            let linkData = {
                url: null,
                doc: null,
                linkType: 'custom',
                newTab: false,
            };
            if (payload === null) {
                linkData = null;
            }
            else if (typeof payload === 'string') {
                if (validateUrl === undefined || validateUrl(payload)) {
                    linkData.url = payload;
                }
                else {
                    return false;
                }
                // @ts-ignore
            }
            else if (payload.payloadType && payload.payloadType === 'payload') {
                const receivedLinkData = payload;
                linkData.linkType = receivedLinkData.linkType;
                linkData.newTab = receivedLinkData.newTab;
                linkData.fields = receivedLinkData.fields;
                if (receivedLinkData.linkType === 'custom') { // Just a simple URL! No doc
                    if (validateUrl === undefined || validateUrl(receivedLinkData.url)) {
                        linkData.url = receivedLinkData.url;
                    }
                    else {
                        return false;
                    }
                }
                else if (receivedLinkData.linkType === 'internal') {
                    linkData.doc = receivedLinkData.doc;
                    if (!linkData.doc) {
                        linkData = null;
                    }
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
            (0, LinkPluginModified_1.toggleLink)(linkData);
            return true;
        }, lexical_1.COMMAND_PRIORITY_LOW), validateUrl !== undefined
            ? editor.registerCommand(lexical_1.PASTE_COMMAND, (event) => {
                const selection = (0, lexical_1.$getSelection)();
                if (!(0, lexical_1.$isRangeSelection)(selection)
                    || selection.isCollapsed()
                    || !(event instanceof ClipboardEvent)
                    || event.clipboardData == null) {
                    return false;
                }
                const clipboardText = event.clipboardData.getData('text');
                if (!validateUrl(clipboardText)) {
                    return false;
                }
                editor.dispatchCommand(LinkPluginModified_1.TOGGLE_LINK_COMMAND, clipboardText);
                event.preventDefault();
                return true;
            }, lexical_1.COMMAND_PRIORITY_LOW)
            : () => {
                // Don't paste arbritrary text as a link when there's no validate function
            });
    }, [editor, validateUrl]);
    return null;
}
exports.LinkPlugin = LinkPlugin;
//# sourceMappingURL=ReactLinkPluginModified.js.map