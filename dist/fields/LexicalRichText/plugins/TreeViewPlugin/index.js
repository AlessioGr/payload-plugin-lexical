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
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const LexicalTreeView_1 = require("@lexical/react/LexicalTreeView");
const React = __importStar(require("react"));
function TreeViewPlugin() {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    return (React.createElement(LexicalTreeView_1.TreeView, { viewClassName: "tree-view-output", timeTravelPanelClassName: "debug-timetravel-panel", timeTravelButtonClassName: "debug-timetravel-button", timeTravelPanelSliderClassName: "debug-timetravel-panel-slider", timeTravelPanelButtonClassName: "debug-timetravel-panel-button", editor: editor }));
}
exports.default = TreeViewPlugin;
