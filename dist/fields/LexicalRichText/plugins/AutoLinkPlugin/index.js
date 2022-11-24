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
const LexicalAutoLinkPlugin_1 = require("@lexical/react/LexicalAutoLinkPlugin");
const React = __importStar(require("react"));
const URL_MATCHER = /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const EMAIL_MATCHER = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
const MATCHERS = [
    (text) => {
        const match = URL_MATCHER.exec(text);
        if (match === null) {
            return null;
        }
        const fullMatch = match[0];
        return {
            index: match.index,
            length: fullMatch.length,
            text: fullMatch,
            url: fullMatch.startsWith('http') ? fullMatch : `https://${fullMatch}`,
        };
    },
    (text) => {
        const match = EMAIL_MATCHER.exec(text);
        return (match && {
            index: match.index,
            length: match[0].length,
            text: match[0],
            url: `mailto:${match[0]}`,
        });
    },
];
function LexicalAutoLinkPlugin() {
    return React.createElement(LexicalAutoLinkPlugin_1.AutoLinkPlugin, { matchers: MATCHERS });
}
exports.default = LexicalAutoLinkPlugin;
