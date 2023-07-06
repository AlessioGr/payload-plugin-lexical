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
exports.$isImageNode = exports.$createImageNode = exports.ImageNode = void 0;
const lexical_1 = require("lexical");
const React = __importStar(require("react"));
const RawImageComponent = React.lazy(() => Promise.resolve().then(() => __importStar(require('./RawImageComponent'))));
function convertImageElement(domNode) {
    if (domNode instanceof HTMLImageElement) {
        // const { alt: altText, src } = domNode;
        // const node = $createImageNode({ altText, src });
        // return { node };
        // TODO: Auto-upload functionality here!
    }
    return null;
}
class ImageNode extends lexical_1.DecoratorNode {
    static getType() {
        return 'upload';
    }
    static clone(node) {
        return new ImageNode(node.__rawImagePayload, node.__extraAttributes, node.__showCaption, node.__caption, node.__captionsEnabled);
    }
    exportDOM() {
        const element = document.createElement('img');
        // element.setAttribute('src', this.__src);
        // element.setAttribute('alt', this.__altText); //TODO
        return { element };
    }
    static importDOM() {
        return {
            img: (node) => ({
                conversion: convertImageElement,
                priority: 0,
            }),
        };
    }
    constructor(rawImagePayload, extraAttributes, showCaption, caption, captionsEnabled) {
        super(undefined); // TODO: Do I need a key?
        this.__extraAttributes = {
            widthOverride: undefined,
            heightOverride: undefined,
        };
        this.__rawImagePayload = rawImagePayload;
        this.__extraAttributes = extraAttributes;
        this.__showCaption = showCaption || false;
        this.__caption = caption || (0, lexical_1.createEditor)();
        this.__captionsEnabled = captionsEnabled || captionsEnabled === undefined;
    }
    static importJSON(serializedNode) {
        const { rawImagePayload, type, version, extraAttributes, caption, showCaption, } = serializedNode;
        const node = $createImageNode(rawImagePayload, extraAttributes, showCaption, undefined, undefined);
        const nestedEditor = node.__caption;
        try {
            const editorState = nestedEditor === null || nestedEditor === void 0 ? void 0 : nestedEditor.parseEditorState(caption.editorState);
            if (!editorState.isEmpty()) {
                nestedEditor.setEditorState(editorState);
            }
        }
        catch (e) {
            console.error(e);
        }
        return node;
    }
    exportJSON() {
        return {
            type: 'upload',
            version: 1,
            rawImagePayload: this.__rawImagePayload,
            extraAttributes: this.__extraAttributes,
            caption: this.__caption.toJSON(),
            showCaption: this.__showCaption,
        };
    }
    setWidthAndHeightOverride(width, height) {
        const writable = this.getWritable();
        if (!writable.__extraAttributes) {
            writable.__extraAttributes = {
                widthOverride: width,
                heightOverride: height,
            };
        }
        else {
            writable.__extraAttributes.widthOverride = width;
            writable.__extraAttributes.heightOverride = height;
        }
    }
    setShowCaption(showCaption) {
        const writable = this.getWritable();
        writable.__showCaption = showCaption;
    }
    // View
    // eslint-disable-next-line class-methods-use-this
    createDOM(config) {
        const span = document.createElement('span');
        const { theme } = config;
        const className = theme.image;
        if (className !== undefined) {
            span.className = className;
        }
        return span;
    }
    // eslint-disable-next-line class-methods-use-this
    updateDOM() {
        return false;
    }
    decorate() {
        return (React.createElement(RawImageComponent, { rawImagePayload: this.__rawImagePayload, extraAttributes: this.__extraAttributes, nodeKey: this.getKey(), showCaption: this.__showCaption, caption: this.__caption, captionsEnabled: this.__captionsEnabled }));
    }
}
exports.ImageNode = ImageNode;
function $createImageNode(rawImagePayload, extraAttributes, showCaption, caption, captionsEnabled) {
    return (0, lexical_1.$applyNodeReplacement)(new ImageNode(rawImagePayload, extraAttributes, showCaption, caption, captionsEnabled));
}
exports.$createImageNode = $createImageNode;
function $isImageNode(node) {
    return node instanceof ImageNode;
}
exports.$isImageNode = $isImageNode;
//# sourceMappingURL=ImageNode.js.map