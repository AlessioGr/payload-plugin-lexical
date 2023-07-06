"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.$isYouTubeNode = exports.$createYouTubeNode = exports.YouTubeNode = void 0;
const LexicalBlockWithAlignableContents_1 = require("@lexical/react/LexicalBlockWithAlignableContents");
const LexicalDecoratorBlockNode_1 = require("@lexical/react/LexicalDecoratorBlockNode");
const React = __importStar(require("react"));
function YouTubeComponent({ className, format, nodeKey, videoID, }) {
    return (React.createElement(LexicalBlockWithAlignableContents_1.BlockWithAlignableContents, { className: className, format: format, nodeKey: nodeKey },
        React.createElement("iframe", { width: "560", height: "315", src: `https://www.youtube-nocookie.com/embed/${videoID}`, frameBorder: "0", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", allowFullScreen: true, title: "YouTube video", style: { maxWidth: '100%' } })));
}
function convertYoutubeElement(domNode) {
    const videoID = domNode.getAttribute('data-lexical-youtube');
    if (videoID) {
        const node = $createYouTubeNode(videoID);
        return { node };
    }
    return null;
}
class YouTubeNode extends LexicalDecoratorBlockNode_1.DecoratorBlockNode {
    static getType() {
        return 'youtube';
    }
    static clone(node) {
        return new YouTubeNode(node.__id, node.__format, node.__key);
    }
    static importJSON(serializedNode) {
        const node = $createYouTubeNode(serializedNode.videoID);
        node.setFormat(serializedNode.format);
        return node;
    }
    exportJSON() {
        return Object.assign(Object.assign({}, super.exportJSON()), { type: 'youtube', version: 1, videoID: this.__id });
    }
    constructor(id, format, key) {
        super(format, key);
        this.__id = id;
    }
    exportDOM() {
        const element = document.createElement('iframe');
        element.setAttribute('data-lexical-youtube', this.__id);
        element.setAttribute('width', '560');
        element.setAttribute('height', '315');
        element.setAttribute('src', `https://www.youtube-nocookie.com/embed/${this.__id}`);
        element.setAttribute('frameborder', '0');
        element.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        element.setAttribute('allowfullscreen', 'true');
        element.setAttribute('title', 'YouTube video');
        return { element };
    }
    static importDOM() {
        return {
            iframe: (domNode) => {
                if (!domNode.hasAttribute('data-lexical-youtube')) {
                    return null;
                }
                return {
                    conversion: convertYoutubeElement,
                    priority: 1,
                };
            },
        };
    }
    updateDOM() {
        return false;
    }
    getId() {
        return this.__id;
    }
    getTextContent(_includeInert, _includeDirectionless) {
        return `https://www.youtube.com/watch?v=${this.__id}`;
    }
    decorate(_editor, config) {
        const embedBlockTheme = config.theme.embedBlock || {};
        const className = {
            base: embedBlockTheme.base || '',
            focus: embedBlockTheme.focus || '',
        };
        return (React.createElement(YouTubeComponent, { className: className, format: this.__format, nodeKey: this.getKey(), videoID: this.__id }));
    }
    isInline() {
        return false;
    }
}
exports.YouTubeNode = YouTubeNode;
function $createYouTubeNode(videoID) {
    return new YouTubeNode(videoID);
}
exports.$createYouTubeNode = $createYouTubeNode;
function $isYouTubeNode(node) {
    return node instanceof YouTubeNode;
}
exports.$isYouTubeNode = $isYouTubeNode;
//# sourceMappingURL=YouTubeNode.js.map