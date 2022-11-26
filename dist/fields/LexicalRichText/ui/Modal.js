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
require("./Modal.scss");
const React = __importStar(require("react"));
const react_1 = require("react");
const react_dom_1 = require("react-dom");
function PortalImpl({ onClose, children, title, closeOnClickOutside, }) {
    const modalRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (modalRef.current !== null) {
            modalRef.current.focus();
        }
    }, []);
    (0, react_1.useEffect)(() => {
        let modalOverlayElement = null;
        const handler = (event) => {
            if (event.keyCode === 27) {
                onClose();
            }
        };
        const clickOutsideHandler = (event) => {
            const { target } = event;
            if (modalRef.current !== null
                && !modalRef.current.contains(target)
                && closeOnClickOutside) {
                onClose();
            }
        };
        const modelElement = modalRef.current;
        if (modelElement !== null) {
            modalOverlayElement = modelElement.parentElement;
            if (modalOverlayElement !== null) {
                modalOverlayElement.addEventListener('click', clickOutsideHandler);
            }
        }
        window.addEventListener('keydown', handler);
        return () => {
            window.removeEventListener('keydown', handler);
            if (modalOverlayElement !== null) {
                modalOverlayElement === null || modalOverlayElement === void 0 ? void 0 : modalOverlayElement.removeEventListener('click', clickOutsideHandler);
            }
        };
    }, [closeOnClickOutside, onClose]);
    return (React.createElement("div", { className: "Modal__overlay", role: "dialog" },
        React.createElement("div", { className: "Modal__modal", tabIndex: -1, ref: modalRef },
            React.createElement("h2", { className: "Modal__title" }, title),
            React.createElement("button", { className: "Modal__closeButton", "aria-label": "Close modal", type: "button", onClick: onClose }, "X"),
            React.createElement("div", { className: "Modal__content" }, children))));
}
function Modal({ onClose, children, title, closeOnClickOutside = false, }) {
    return (0, react_dom_1.createPortal)(React.createElement(PortalImpl, { onClose: onClose, title: title, closeOnClickOutside: closeOnClickOutside }, children), document.body);
}
exports.default = Modal;
