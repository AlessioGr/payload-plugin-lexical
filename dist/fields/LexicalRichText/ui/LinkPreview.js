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
require("./LinkPreview.scss");
const React = __importStar(require("react"));
const react_1 = require("react");
// Cached responses or running request promises
const PREVIEW_CACHE = {};
const URL_MATCHER = /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
function useSuspenseRequest(url) {
    let cached = PREVIEW_CACHE[url];
    if (!url.match(URL_MATCHER)) {
        return { preview: null };
    }
    if (!cached) {
        cached = PREVIEW_CACHE[url] = fetch(`/api/link-preview?url=${encodeURI(url)}`)
            .then((response) => response.json())
            .then((preview) => {
            PREVIEW_CACHE[url] = preview;
            return preview;
        })
            .catch(() => {
            PREVIEW_CACHE[url] = { preview: null };
        });
    }
    if (cached instanceof Promise) {
        throw cached;
    }
    return cached;
}
function LinkPreviewContent({ url, }) {
    const { preview } = useSuspenseRequest(url);
    if (preview === null) {
        return null;
    }
    return (React.createElement("div", { className: "LinkPreview__container" },
        preview.img && (React.createElement("div", { className: "LinkPreview__imageWrapper" },
            React.createElement("img", { src: preview.img, alt: preview.title, className: "LinkPreview__image" }))),
        preview.domain && (React.createElement("div", { className: "LinkPreview__domain" }, preview.domain)),
        preview.title && (React.createElement("div", { className: "LinkPreview__title" }, preview.title)),
        preview.description && (React.createElement("div", { className: "LinkPreview__description" }, preview.description))));
}
function Glimmer(props) {
    return (React.createElement("div", { className: "LinkPreview__glimmer", ...props, style: {
            animationDelay: String((props.index || 0) * 300),
            ...(props.style || {}),
        } }));
}
function LinkPreview({ url, }) {
    return (React.createElement(react_1.Suspense, { fallback: (React.createElement(React.Fragment, null,
            React.createElement(Glimmer, { style: { height: '80px' }, index: 0 }),
            React.createElement(Glimmer, { style: { width: '60%' }, index: 1 }),
            React.createElement(Glimmer, { style: { width: '80%' }, index: 2 }))) },
        React.createElement(LinkPreviewContent, { url: url })));
}
exports.default = LinkPreview;
