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
exports.$isFigmaNode = exports.$createFigmaNode = exports.FigmaNode = void 0;
const LexicalBlockWithAlignableContents_1 = require("@lexical/react/LexicalBlockWithAlignableContents");
const LexicalDecoratorBlockNode_1 = require("@lexical/react/LexicalDecoratorBlockNode");
const React = __importStar(require("react"));
function FigmaComponent({ className, format, nodeKey, documentID, }) {
    return (React.createElement(LexicalBlockWithAlignableContents_1.BlockWithAlignableContents, { className: className, format: format, nodeKey: nodeKey },
        React.createElement("iframe", { width: "560", height: "315", src: `https://www.figma.com/embed?embed_host=lexical&url=\
        https://www.figma.com/file/${documentID}`, allowFullScreen: true, style: { maxWidth: '100%' } })));
}
class FigmaNode extends LexicalDecoratorBlockNode_1.DecoratorBlockNode {
    static getType() {
        return 'figma';
    }
    static clone(node) {
        return new FigmaNode(node.__id, node.__format, node.__key);
    }
    static importJSON(serializedNode) {
        const node = $createFigmaNode(serializedNode.documentID);
        node.setFormat(serializedNode.format);
        return node;
    }
    exportJSON() {
        return Object.assign(Object.assign({}, super.exportJSON()), { documentID: this.__id, type: 'figma', version: 1 });
    }
    constructor(id, format, key) {
        super(format, key);
        this.__id = id;
    }
    updateDOM() {
        return false;
    }
    getId() {
        return this.__id;
    }
    getTextContent(_includeInert, _includeDirectionless) {
        return `https://www.figma.com/file/${this.__id}`;
    }
    decorate(_editor, config) {
        const embedBlockTheme = config.theme.embedBlock || {};
        const className = {
            base: embedBlockTheme.base || '',
            focus: embedBlockTheme.focus || '',
        };
        return (React.createElement(FigmaComponent, { className: className, format: this.__format, nodeKey: this.getKey(), documentID: this.__id }));
    }
    isInline() {
        return false;
    }
}
exports.FigmaNode = FigmaNode;
function $createFigmaNode(documentID) {
    return new FigmaNode(documentID);
}
exports.$createFigmaNode = $createFigmaNode;
function $isFigmaNode(node) {
    return node instanceof FigmaNode;
}
exports.$isFigmaNode = $isFigmaNode;
//# sourceMappingURL=FigmaNode.js.map