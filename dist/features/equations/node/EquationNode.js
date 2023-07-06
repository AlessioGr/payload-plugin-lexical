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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$isEquationNode = exports.$createEquationNode = exports.EquationNode = void 0;
const katex_1 = __importDefault(require("katex"));
const lexical_1 = require("lexical");
const React = __importStar(require("react"));
const react_1 = require("react");
const EquationComponent = React.lazy(
// @ts-ignore
() => Promise.resolve().then(() => __importStar(require('./EquationComponent'))));
function convertEquationElement(domNode) {
    let equation = domNode.getAttribute('data-lexical-equation');
    const inline = domNode.getAttribute('data-lexical-inline') === 'true';
    // Decode the equation from base64
    equation = atob(equation || '');
    if (equation) {
        const node = $createEquationNode(equation, inline);
        return { node };
    }
    return null;
}
class EquationNode extends lexical_1.DecoratorNode {
    static getType() {
        return 'equation';
    }
    static clone(node) {
        return new EquationNode(node.__equation, node.__inline, node.__key);
    }
    constructor(equation, inline, key) {
        super(key);
        this.__equation = equation;
        this.__inline = inline !== null && inline !== void 0 ? inline : false;
    }
    static importJSON(serializedNode) {
        const node = $createEquationNode(serializedNode.equation, serializedNode.inline);
        return node;
    }
    exportJSON() {
        return {
            equation: this.getEquation(),
            inline: this.__inline,
            type: 'equation',
            version: 1,
        };
    }
    createDOM(_config) {
        const element = document.createElement(this.__inline ? 'span' : 'div');
        // EquationNodes should implement `user-action:none` in their CSS to avoid issues with deletion on Android.
        element.className = 'editor-equation';
        return element;
    }
    exportDOM() {
        const element = document.createElement(this.__inline ? 'span' : 'div');
        // Encode the equation as base64 to avoid issues with special characters
        const equation = btoa(this.__equation);
        element.setAttribute('data-lexical-equation', equation);
        element.setAttribute('data-lexical-inline', `${this.__inline}`);
        katex_1.default.render(this.__equation, element, {
            displayMode: !this.__inline,
            errorColor: '#cc0000',
            output: 'html',
            strict: 'warn',
            throwOnError: false,
            trust: false,
        });
        return { element };
    }
    static importDOM() {
        return {
            div: (domNode) => {
                if (!domNode.hasAttribute('data-lexical-equation')) {
                    return null;
                }
                return {
                    conversion: convertEquationElement,
                    priority: 2,
                };
            },
            span: (domNode) => {
                if (!domNode.hasAttribute('data-lexical-equation')) {
                    return null;
                }
                return {
                    conversion: convertEquationElement,
                    priority: 1,
                };
            },
        };
    }
    updateDOM(prevNode) {
        // If the inline property changes, replace the element
        return this.__inline !== prevNode.__inline;
    }
    getTextContent() {
        return this.__equation;
    }
    getEquation() {
        return this.__equation;
    }
    setEquation(equation) {
        const writable = this.getWritable();
        writable.__equation = equation;
    }
    decorate() {
        return (React.createElement(react_1.Suspense, { fallback: null },
            React.createElement(EquationComponent, { equation: this.__equation, inline: this.__inline, nodeKey: this.__key })));
    }
}
exports.EquationNode = EquationNode;
function $createEquationNode(equation = '', inline = false) {
    return (0, lexical_1.$applyNodeReplacement)(new EquationNode(equation, inline));
}
exports.$createEquationNode = $createEquationNode;
function $isEquationNode(node) {
    return node instanceof EquationNode;
}
exports.$isEquationNode = $isEquationNode;
//# sourceMappingURL=EquationNode.js.map