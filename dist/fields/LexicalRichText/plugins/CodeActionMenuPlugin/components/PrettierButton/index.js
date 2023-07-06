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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrettierButton = exports.canBePrettier = void 0;
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
require("./index.scss");
const code_1 = require("@lexical/code");
const lexical_1 = require("lexical");
const React = __importStar(require("react"));
const react_1 = require("react");
const PRETTIER_PARSER_MODULES = {
    css: () => Promise.resolve().then(() => __importStar(require('prettier/parser-postcss'))),
    html: () => Promise.resolve().then(() => __importStar(require('prettier/parser-html'))),
    js: () => Promise.resolve().then(() => __importStar(require('prettier/parser-babel'))),
    markdown: () => Promise.resolve().then(() => __importStar(require('prettier/parser-markdown'))),
};
function loadPrettierParserByLang(lang) {
    return __awaiter(this, void 0, void 0, function* () {
        const dynamicImport = PRETTIER_PARSER_MODULES[lang];
        return yield dynamicImport();
    });
}
function loadPrettierFormat() {
    return __awaiter(this, void 0, void 0, function* () {
        const { format } = yield Promise.resolve().then(() => __importStar(require('prettier/standalone')));
        return format;
    });
}
const PRETTIER_OPTIONS_BY_LANG = {
    css: {
        parser: 'css',
    },
    html: {
        parser: 'html',
    },
    js: {
        parser: 'babel',
    },
    markdown: {
        parser: 'markdown',
    },
};
const LANG_CAN_BE_PRETTIER = Object.keys(PRETTIER_OPTIONS_BY_LANG);
function canBePrettier(lang) {
    return LANG_CAN_BE_PRETTIER.includes(lang);
}
exports.canBePrettier = canBePrettier;
function getPrettierOptions(lang) {
    const options = PRETTIER_OPTIONS_BY_LANG[lang];
    if (!options) {
        throw new Error(`CodeActionMenuPlugin: Prettier does not support this language: ${lang}`);
    }
    return options;
}
function PrettierButton({ lang, editor, getCodeDOMNode }) {
    const [syntaxError, setSyntaxError] = (0, react_1.useState)('');
    const [tipsVisible, setTipsVisible] = (0, react_1.useState)(false);
    function handleClick() {
        return __awaiter(this, void 0, void 0, function* () {
            const codeDOMNode = getCodeDOMNode();
            try {
                const format = yield loadPrettierFormat();
                const options = getPrettierOptions(lang);
                options.plugins = [yield loadPrettierParserByLang(lang)];
                if (!codeDOMNode) {
                    return;
                }
                editor.update(() => {
                    const codeNode = (0, lexical_1.$getNearestNodeFromDOMNode)(codeDOMNode);
                    if ((0, code_1.$isCodeNode)(codeNode)) {
                        const content = codeNode.getTextContent();
                        let parsed = '';
                        try {
                            parsed = format(content, options);
                        }
                        catch (error) {
                            setError(error);
                        }
                        if (parsed !== '') {
                            const selection = codeNode.select(0);
                            selection.insertText(parsed);
                            setSyntaxError('');
                            setTipsVisible(false);
                        }
                    }
                });
            }
            catch (error) {
                setError(error);
            }
        });
    }
    function setError(error) {
        if (error instanceof Error) {
            setSyntaxError(error.message);
            setTipsVisible(true);
        }
        else {
            console.error('Unexpected error: ', error);
        }
    }
    function handleMouseEnter() {
        if (syntaxError !== '') {
            setTipsVisible(true);
        }
    }
    function handleMouseLeave() {
        if (syntaxError !== '') {
            setTipsVisible(false);
        }
    }
    return (React.createElement("div", { className: "prettier-wrapper" },
        React.createElement("button", { className: "menu-item", onClick: (e) => {
                e.preventDefault();
                handleClick();
            }, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, "aria-label": "prettier" }, syntaxError ? (React.createElement("i", { className: "format prettier-error" })) : (React.createElement("i", { className: "format prettier" }))),
        tipsVisible ? (React.createElement("pre", { className: "code-error-tips" }, syntaxError)) : null));
}
exports.PrettierButton = PrettierButton;
//# sourceMappingURL=index.js.map