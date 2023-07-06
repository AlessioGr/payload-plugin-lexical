"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoLinkPlugin = exports.createLinkMatcherWithRegExp = void 0;
const LinkNodeModified_1 = require("../../nodes/LinkNodeModified");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const invariant_1 = __importDefault(require("../../../../fields/LexicalRichText/shared/invariant"));
const AutoLinkNodeModified_1 = require("../../nodes/AutoLinkNodeModified");
function createLinkMatcherWithRegExp(regExp, urlTransformer = (text) => text) {
    return (text) => {
        const match = regExp.exec(text);
        if (match === null)
            return null;
        return {
            index: match.index,
            length: match[0].length,
            text: match[0],
            url: urlTransformer(text),
        };
    };
}
exports.createLinkMatcherWithRegExp = createLinkMatcherWithRegExp;
function findFirstMatch(text, matchers) {
    for (let i = 0; i < matchers.length; i++) {
        const match = matchers[i](text);
        if (match) {
            return match;
        }
    }
    return null;
}
const PUNCTUATION_OR_SPACE = /[.,;\s]/;
function isSeparator(char) {
    return PUNCTUATION_OR_SPACE.test(char);
}
function endsWithSeparator(textContent) {
    return isSeparator(textContent[textContent.length - 1]);
}
function startsWithSeparator(textContent) {
    return isSeparator(textContent[0]);
}
function isPreviousNodeValid(node) {
    let previousNode = node.getPreviousSibling();
    if ((0, lexical_1.$isElementNode)(previousNode)) {
        previousNode = previousNode.getLastDescendant();
    }
    return (previousNode === null ||
        (0, lexical_1.$isLineBreakNode)(previousNode) ||
        ((0, lexical_1.$isTextNode)(previousNode) &&
            endsWithSeparator(previousNode.getTextContent())));
}
function isNextNodeValid(node) {
    let nextNode = node.getNextSibling();
    if ((0, lexical_1.$isElementNode)(nextNode)) {
        nextNode = nextNode.getFirstDescendant();
    }
    return (nextNode === null ||
        (0, lexical_1.$isLineBreakNode)(nextNode) ||
        ((0, lexical_1.$isTextNode)(nextNode) && startsWithSeparator(nextNode.getTextContent())));
}
function isContentAroundIsValid(matchStart, matchEnd, text, node) {
    const contentBeforeIsValid = matchStart > 0
        ? isSeparator(text[matchStart - 1])
        : isPreviousNodeValid(node);
    if (!contentBeforeIsValid) {
        return false;
    }
    const contentAfterIsValid = matchEnd < text.length
        ? isSeparator(text[matchEnd])
        : isNextNodeValid(node);
    return contentAfterIsValid;
}
function handleLinkCreation(node, matchers, onChange) {
    const nodeText = node.getTextContent();
    let text = nodeText;
    let invalidMatchEnd = 0;
    let remainingTextNode = node;
    let match;
    while ((match = findFirstMatch(text, matchers)) && match !== null) {
        const matchStart = match.index;
        const matchLength = match.length;
        const matchEnd = matchStart + matchLength;
        const isValid = isContentAroundIsValid(invalidMatchEnd + matchStart, invalidMatchEnd + matchEnd, nodeText, node);
        if (isValid) {
            let linkTextNode;
            if (invalidMatchEnd + matchStart === 0) {
                [linkTextNode, remainingTextNode] = remainingTextNode.splitText(invalidMatchEnd + matchLength);
            }
            else {
                [, linkTextNode, remainingTextNode] = remainingTextNode.splitText(invalidMatchEnd + matchStart, invalidMatchEnd + matchStart + matchLength);
            }
            const attributes = Object.assign({ url: match.url, linkType: 'custom' }, match.attributes);
            const linkNode = (0, AutoLinkNodeModified_1.$createAutoLinkNode)({ attributes: attributes });
            const textNode = (0, lexical_1.$createTextNode)(match.text);
            textNode.setFormat(linkTextNode.getFormat());
            textNode.setDetail(linkTextNode.getDetail());
            linkNode.append(textNode);
            linkTextNode.replace(linkNode);
            onChange(match.url, null);
            invalidMatchEnd = 0;
        }
        else {
            invalidMatchEnd += matchEnd;
        }
        text = text.substring(matchEnd);
    }
}
function handleLinkEdit(linkNode, matchers, onChange) {
    var _a, _b, _c, _d;
    // Check children are simple text
    const children = linkNode.getChildren();
    const childrenLength = children.length;
    for (let i = 0; i < childrenLength; i++) {
        const child = children[i];
        if (!(0, lexical_1.$isTextNode)(child) || !child.isSimpleText()) {
            replaceWithChildren(linkNode);
            onChange(null, (_a = linkNode.getAttributes()) === null || _a === void 0 ? void 0 : _a.url);
            return;
        }
    }
    // Check text content fully matches
    const text = linkNode.getTextContent();
    const match = findFirstMatch(text, matchers);
    if (match === null || match.text !== text) {
        replaceWithChildren(linkNode);
        onChange(null, (_b = linkNode.getAttributes()) === null || _b === void 0 ? void 0 : _b.url);
        return;
    }
    // Check neighbors
    if (!isPreviousNodeValid(linkNode) || !isNextNodeValid(linkNode)) {
        replaceWithChildren(linkNode);
        onChange(null, (_c = linkNode.getAttributes()) === null || _c === void 0 ? void 0 : _c.url);
        return;
    }
    const url = (_d = linkNode.getAttributes()) === null || _d === void 0 ? void 0 : _d.url;
    if (url !== (match === null || match === void 0 ? void 0 : match.url)) {
        let attrs = linkNode.getAttributes();
        attrs.url = match === null || match === void 0 ? void 0 : match.url;
        linkNode.setAttributes(attrs);
        onChange(match.url, url);
    }
    if (match.attributes) {
        const rel = linkNode.getAttributes().rel;
        if (rel !== match.attributes.rel) {
            let attrs = linkNode.getAttributes();
            attrs.rel = match.attributes.rel || null;
            linkNode.setAttributes(attrs);
            onChange(match.attributes.rel || null, rel);
        }
    }
}
// Bad neighbours are edits in neighbor nodes that make AutoLinks incompatible.
// Given the creation preconditions, these can only be simple text nodes.
function handleBadNeighbors(textNode, matchers, onChange) {
    var _a, _b;
    const previousSibling = textNode.getPreviousSibling();
    const nextSibling = textNode.getNextSibling();
    const text = textNode.getTextContent();
    if ((0, AutoLinkNodeModified_1.$isAutoLinkNode)(previousSibling) && !startsWithSeparator(text)) {
        previousSibling.append(textNode);
        handleLinkEdit(previousSibling, matchers, onChange);
        onChange(null, (_a = previousSibling.getAttributes()) === null || _a === void 0 ? void 0 : _a.url);
    }
    if ((0, AutoLinkNodeModified_1.$isAutoLinkNode)(nextSibling) && !endsWithSeparator(text)) {
        replaceWithChildren(nextSibling);
        handleLinkEdit(nextSibling, matchers, onChange);
        onChange(null, (_b = nextSibling.getAttributes()) === null || _b === void 0 ? void 0 : _b.url);
    }
}
function replaceWithChildren(node) {
    const children = node.getChildren();
    const childrenLength = children.length;
    for (let j = childrenLength - 1; j >= 0; j--) {
        node.insertAfter(children[j]);
    }
    node.remove();
    return children.map((child) => child.getLatest());
}
function useAutoLink(editor, matchers, onChange) {
    (0, react_1.useEffect)(() => {
        if (!editor.hasNodes([AutoLinkNodeModified_1.AutoLinkNode])) {
            (0, invariant_1.default)(false, 'LexicalAutoLinkPlugin: AutoLinkNode not registered on editor');
        }
        const onChangeWrapped = (url, prevUrl) => {
            if (onChange) {
                onChange(url, prevUrl);
            }
        };
        return (0, utils_1.mergeRegister)(editor.registerNodeTransform(lexical_1.TextNode, (textNode) => {
            const parent = textNode.getParentOrThrow();
            const previous = textNode.getPreviousSibling();
            if ((0, AutoLinkNodeModified_1.$isAutoLinkNode)(parent)) {
                handleLinkEdit(parent, matchers, onChangeWrapped);
            }
            else if (!(0, LinkNodeModified_1.$isLinkNode)(parent)) {
                if (textNode.isSimpleText() &&
                    (startsWithSeparator(textNode.getTextContent()) ||
                        !(0, AutoLinkNodeModified_1.$isAutoLinkNode)(previous))) {
                    handleLinkCreation(textNode, matchers, onChangeWrapped);
                }
                handleBadNeighbors(textNode, matchers, onChangeWrapped);
            }
        }));
    }, [editor, matchers, onChange]);
}
function AutoLinkPlugin({ matchers, onChange, }) {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    useAutoLink(editor, matchers, onChange);
    return null;
}
exports.AutoLinkPlugin = AutoLinkPlugin;
//# sourceMappingURL=AutoLinkPluginModified.js.map