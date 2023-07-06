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
require("./index.scss");
const code_1 = require("@lexical/code");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const lexical_1 = require("lexical");
const react_1 = require("react");
const React = __importStar(require("react"));
const react_dom_1 = require("react-dom");
const CopyButton_1 = require("./components/CopyButton");
const PrettierButton_1 = require("./components/PrettierButton");
const utils_1 = require("./utils");
const CODE_PADDING = 8;
function CodeActionMenuContainer({ anchorElem, }) {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [lang, setLang] = (0, react_1.useState)('');
    const [isShown, setShown] = (0, react_1.useState)(false);
    const [shouldListenMouseMove, setShouldListenMouseMove] = (0, react_1.useState)(false);
    const [position, setPosition] = (0, react_1.useState)({
        right: '0',
        top: '0',
    });
    const codeSetRef = (0, react_1.useRef)(new Set());
    const codeDOMNodeRef = (0, react_1.useRef)(null);
    function getCodeDOMNode() {
        return codeDOMNodeRef.current;
    }
    const debouncedOnMouseMove = (0, utils_1.useDebounce)((event) => {
        const { codeDOMNode, isOutside } = getMouseInfo(event);
        if (isOutside) {
            setShown(false);
            return;
        }
        if (!codeDOMNode) {
            return;
        }
        codeDOMNodeRef.current = codeDOMNode;
        let codeNode = null;
        let _lang = '';
        editor.update(() => {
            const maybeCodeNode = (0, lexical_1.$getNearestNodeFromDOMNode)(codeDOMNode);
            if ((0, code_1.$isCodeNode)(maybeCodeNode)) {
                codeNode = maybeCodeNode;
                _lang = codeNode.getLanguage() || '';
            }
        });
        if (codeNode) {
            const { y: editorElemY, right: editorElemRight } = anchorElem.getBoundingClientRect();
            const { y, right } = codeDOMNode.getBoundingClientRect();
            setLang(_lang);
            setShown(true);
            setPosition({
                right: `${editorElemRight - right + CODE_PADDING}px`,
                top: `${y - editorElemY}px`,
            });
        }
    }, 50, 1000);
    (0, react_1.useEffect)(() => {
        if (!shouldListenMouseMove) {
            return;
        }
        document.addEventListener('mousemove', debouncedOnMouseMove);
        return () => {
            setShown(false);
            debouncedOnMouseMove.cancel();
            document.removeEventListener('mousemove', debouncedOnMouseMove);
        };
    }, [shouldListenMouseMove, debouncedOnMouseMove]);
    editor.registerMutationListener(code_1.CodeNode, (mutations) => {
        editor.getEditorState().read(() => {
            for (const [key, type] of mutations) {
                switch (type) {
                    case 'created':
                        codeSetRef.current.add(key);
                        setShouldListenMouseMove(codeSetRef.current.size > 0);
                        break;
                    case 'destroyed':
                        codeSetRef.current.delete(key);
                        setShouldListenMouseMove(codeSetRef.current.size > 0);
                        break;
                    default:
                        break;
                }
            }
        });
    });
    const normalizedLang = (0, code_1.normalizeCodeLang)(lang);
    const codeFriendlyName = (0, code_1.getLanguageFriendlyName)(lang);
    return (React.createElement(React.Fragment, null, isShown ? (React.createElement("div", { className: "code-action-menu-container", style: Object.assign({}, position) },
        React.createElement("div", { className: "code-highlight-language" }, codeFriendlyName),
        React.createElement(CopyButton_1.CopyButton, { editor: editor, getCodeDOMNode: getCodeDOMNode }),
        (0, PrettierButton_1.canBePrettier)(normalizedLang) ? (React.createElement(PrettierButton_1.PrettierButton, { editor: editor, getCodeDOMNode: getCodeDOMNode, lang: normalizedLang })) : null)) : null));
}
function getMouseInfo(event) {
    const { target } = event;
    if (target && target instanceof HTMLElement) {
        const codeDOMNode = target.closest('code.PlaygroundEditorTheme__code');
        const isOutside = !(codeDOMNode ||
            target.closest('div.code-action-menu-container'));
        return { codeDOMNode, isOutside };
    }
    return { codeDOMNode: null, isOutside: true };
}
function CodeActionMenuPlugin({ anchorElem = document.body, }) {
    return (0, react_dom_1.createPortal)(React.createElement(CodeActionMenuContainer, { anchorElem: anchorElem }), anchorElem);
}
exports.default = CodeActionMenuPlugin;
//# sourceMappingURL=index.js.map