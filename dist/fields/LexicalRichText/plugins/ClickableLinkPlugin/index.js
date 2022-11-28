"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const lexical_1 = require("lexical");
const react_1 = require("react");
const LinkPluginModified_1 = require("../LinkPlugin/LinkPluginModified");
function ClickableLinkPlugin({ filter, newTab = true, }) {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => {
        function onClick(e) {
            const event = e;
            const linkDomNode = getLinkDomNode(event, editor);
            if (linkDomNode === null) {
                return;
            }
            const href = linkDomNode.getAttribute('href');
            if (linkDomNode.getAttribute('contenteditable') === 'false'
                || href === undefined) {
                return;
            }
            // Allow user to select link text without following url
            const selection = editor.getEditorState().read(lexical_1.$getSelection);
            if ((0, lexical_1.$isRangeSelection)(selection) && !selection.isCollapsed()) {
                return;
            }
            let linkNode = null;
            editor.update(() => {
                const maybeLinkNode = (0, lexical_1.$getNearestNodeFromDOMNode)(linkDomNode);
                if ((0, LinkPluginModified_1.$isLinkNode)(maybeLinkNode)) {
                    linkNode = maybeLinkNode;
                }
            });
            if (linkNode === null
                || (filter !== undefined && !filter(event, linkNode))) {
                return;
            }
            try {
                if (href !== null) {
                    window.open(href, newTab || event.metaKey || event.ctrlKey ? '_blank' : '_self');
                    event.preventDefault();
                }
            }
            catch (_a) {
                // It didn't work, which is better than throwing an exception!
            }
        }
        return editor.registerRootListener((rootElement, prevRootElement) => {
            if (prevRootElement !== null) {
                prevRootElement.removeEventListener('click', onClick);
            }
            if (rootElement !== null) {
                rootElement.addEventListener('click', onClick);
            }
        });
    }, [editor, filter, newTab]);
    return null;
}
exports.default = ClickableLinkPlugin;
function isLinkDomNode(domNode) {
    return domNode.nodeName.toLowerCase() === 'a';
}
function getLinkDomNode(event, editor) {
    return editor.getEditorState().read(() => {
        const domNode = event.target;
        if (isLinkDomNode(domNode)) {
            return domNode;
        }
        if (domNode.parentNode && isLinkDomNode(domNode.parentNode)) {
            return domNode.parentNode;
        }
        return null;
    });
}
//# sourceMappingURL=index.js.map