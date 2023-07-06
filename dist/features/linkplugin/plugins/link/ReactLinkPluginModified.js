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
const LinkNodeModified_1 = require("../../nodes/LinkNodeModified");
function LinkPlugin({ validateUrl }) {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => {
        if (!editor.hasNodes([LinkNodeModified_1.LinkNode])) {
            throw new Error('LinkPlugin: LinkNode not registered on editor');
        }
        return (0, utils_1.mergeRegister)(editor.registerCommand(LinkNodeModified_1.TOGGLE_LINK_COMMAND, (payload) => {
            console.log('Payload received:', payload);
            let linkAttributes = payload;
            //validate
            if ((linkAttributes === null || linkAttributes === void 0 ? void 0 : linkAttributes.linkType) === 'custom') {
                if (!(validateUrl === undefined || validateUrl(linkAttributes === null || linkAttributes === void 0 ? void 0 : linkAttributes.url))) {
                    return false;
                }
            }
            (0, LinkNodeModified_1.toggleLink)(linkAttributes);
            return true;
        }, lexical_1.COMMAND_PRIORITY_LOW), validateUrl !== undefined
            ? editor.registerCommand(lexical_1.PASTE_COMMAND, (event) => {
                const selection = (0, lexical_1.$getSelection)();
                if (!(0, lexical_1.$isRangeSelection)(selection) ||
                    selection.isCollapsed() ||
                    !(event instanceof ClipboardEvent) ||
                    event.clipboardData == null) {
                    return false;
                }
                const clipboardText = event.clipboardData.getData('text');
                if (!validateUrl(clipboardText)) {
                    return false;
                }
                // If we select nodes that are elements then avoid applying the link.
                if (!selection.getNodes().some((node) => (0, lexical_1.$isElementNode)(node))) {
                    const linkAttributes = {
                        linkType: 'custom',
                        url: clipboardText,
                    };
                    editor.dispatchCommand(LinkNodeModified_1.TOGGLE_LINK_COMMAND, linkAttributes);
                    event.preventDefault();
                    return true;
                }
                return false;
            }, lexical_1.COMMAND_PRIORITY_LOW)
            : () => {
                // Don't paste arbritrary text as a link when there's no validate function
            });
    }, [editor, validateUrl]);
    return null;
}
exports.LinkPlugin = LinkPlugin;
//# sourceMappingURL=ReactLinkPluginModified.js.map