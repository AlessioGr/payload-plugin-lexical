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
exports.AutoEmbedDialog = exports.EmbedConfigs = exports.FigmaEmbedConfig = exports.TwitterEmbedConfig = exports.YoutubeEmbedConfig = void 0;
const LexicalAutoEmbedPlugin_1 = require("@lexical/react/LexicalAutoEmbedPlugin");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const react_1 = require("react");
const React = __importStar(require("react"));
const ReactDOM = __importStar(require("react-dom"));
const useModal_1 = __importDefault(require("../../hooks/useModal"));
const Button_1 = __importDefault(require("payload/dist/admin/components/elements/Button"));
const Dialog_1 = require("../../ui/Dialog");
const FigmaPlugin_1 = require("../FigmaPlugin");
const TwitterPlugin_1 = require("../TwitterPlugin");
const YouTubePlugin_1 = require("../YouTubePlugin");
exports.YoutubeEmbedConfig = {
    contentName: 'Youtube Video',
    exampleUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    // Icon for display.
    icon: React.createElement("i", { className: "icon youtube" }),
    insertNode: (editor, result) => {
        editor.dispatchCommand(YouTubePlugin_1.INSERT_YOUTUBE_COMMAND, result.id);
    },
    keywords: ['youtube', 'video'],
    // Determine if a given URL is a match and return url data.
    parseUrl: (url) => {
        const match = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/.exec(url);
        const id = match ? ((match === null || match === void 0 ? void 0 : match[2].length) === 11 ? match[2] : null) : null;
        if (id != null) {
            return {
                id,
                url,
            };
        }
        return null;
    },
    type: 'youtube-video',
};
exports.TwitterEmbedConfig = {
    // e.g. Tweet or Google Map.
    contentName: 'Tweet',
    exampleUrl: 'https://twitter.com/jack/status/20',
    // Icon for display.
    icon: React.createElement("i", { className: "icon tweet" }),
    // Create the Lexical embed node from the url data.
    insertNode: (editor, result) => {
        editor.dispatchCommand(TwitterPlugin_1.INSERT_TWEET_COMMAND, result.id);
    },
    // For extra searching.
    keywords: ['tweet', 'twitter'],
    // Determine if a given URL is a match and return url data.
    parseUrl: (text) => {
        const match = /^https:\/\/twitter\.com\/(#!\/)?(\w+)\/status(es)*\/(\d+)$/.exec(text);
        if (match != null) {
            return {
                id: match[4],
                url: match[0],
            };
        }
        return null;
    },
    type: 'tweet',
};
exports.FigmaEmbedConfig = {
    contentName: 'Figma Document',
    exampleUrl: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
    icon: React.createElement("i", { className: "icon figma" }),
    insertNode: (editor, result) => {
        editor.dispatchCommand(FigmaPlugin_1.INSERT_FIGMA_COMMAND, result.id);
    },
    keywords: ['figma', 'figma.com', 'mock-up'],
    // Determine if a given URL is a match and return url data.
    parseUrl: (text) => {
        const match = /https:\/\/([\w.-]+\.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/.exec(text);
        if (match != null) {
            return {
                id: match[3],
                url: match[0],
            };
        }
        return null;
    },
    type: 'figma',
};
exports.EmbedConfigs = [
    exports.TwitterEmbedConfig,
    exports.YoutubeEmbedConfig,
    exports.FigmaEmbedConfig,
];
function AutoEmbedMenuItem({ index, isSelected, onClick, onMouseEnter, option, }) {
    let className = 'item';
    if (isSelected) {
        className += ' selected';
    }
    return (React.createElement("li", { key: option.key, tabIndex: -1, className: className, ref: option.setRefElement, role: "option", "aria-selected": isSelected, id: `typeahead-item-${index}`, onMouseEnter: onMouseEnter, onClick: onClick },
        React.createElement("span", { className: "text" }, option.title)));
}
function AutoEmbedMenu({ options, selectedItemIndex, onOptionClick, onOptionMouseEnter, }) {
    return (React.createElement("div", { className: "typeahead-popover" },
        React.createElement("ul", null, options.map((option, i) => (React.createElement(AutoEmbedMenuItem, { index: i, isSelected: selectedItemIndex === i, onClick: () => onOptionClick(option, i), onMouseEnter: () => onOptionMouseEnter(i), key: option.key, option: option }))))));
}
function AutoEmbedDialog({ embedConfig, onClose, }) {
    const [text, setText] = (0, react_1.useState)('');
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const urlMatch = LexicalAutoEmbedPlugin_1.URL_MATCHER.exec(text);
    const embedResult = text != null && urlMatch != null ? embedConfig.parseUrl(text) : null;
    const onClick = () => {
        if (embedResult != null) {
            embedConfig.insertNode(editor, embedResult);
            onClose();
        }
    };
    return (React.createElement("div", { style: { width: '600px' } },
        React.createElement("div", { className: "Input__wrapper" },
            React.createElement("input", { type: "text", className: "Input__input", placeholder: embedConfig.exampleUrl, value: text, "data-test-id": `${embedConfig.type}-embed-modal-url`, onChange: (e) => {
                    setText(e.target.value);
                } })),
        React.createElement(Dialog_1.DialogActions, null,
            React.createElement(Button_1.default, { disabled: !embedResult, onClick: onClick, "data-test-id": `${embedConfig.type}-embed-modal-submit-btn` }, "Embed"))));
}
exports.AutoEmbedDialog = AutoEmbedDialog;
function AutoEmbedPlugin() {
    const [modal, showModal] = (0, useModal_1.default)();
    const openEmbedModal = (embedConfig) => {
        showModal(`Embed ${embedConfig.contentName}`, (onClose) => (React.createElement(AutoEmbedDialog, { embedConfig: embedConfig, onClose: onClose })));
    };
    const getMenuOptions = (activeEmbedConfig, embedFn, dismissFn) => {
        return [
            new LexicalAutoEmbedPlugin_1.AutoEmbedOption('Dismiss', {
                onSelect: dismissFn,
            }),
            new LexicalAutoEmbedPlugin_1.AutoEmbedOption(`Embed ${activeEmbedConfig.contentName}`, {
                onSelect: embedFn,
            }),
        ];
    };
    return (React.createElement(React.Fragment, null,
        modal,
        React.createElement(LexicalAutoEmbedPlugin_1.LexicalAutoEmbedPlugin, { embedConfigs: exports.EmbedConfigs, onOpenEmbedModalForConfig: openEmbedModal, getMenuOptions: getMenuOptions, menuRenderFn: (anchorElementRef, { selectedIndex, options, selectOptionAndCleanUp, setHighlightedIndex }) => (anchorElementRef.current
                ? ReactDOM.createPortal(React.createElement("div", { className: "typeahead-popover auto-embed-menu", style: {
                        marginLeft: anchorElementRef.current.style.width,
                    } },
                    React.createElement(AutoEmbedMenu, { options: options, selectedItemIndex: selectedIndex, onOptionClick: (option, index) => {
                            setHighlightedIndex(index);
                            selectOptionAndCleanUp(option);
                        }, onOptionMouseEnter: (index) => {
                            setHighlightedIndex(index);
                        } })), anchorElementRef.current)
                : null) })));
}
exports.default = AutoEmbedPlugin;
//# sourceMappingURL=index.js.map