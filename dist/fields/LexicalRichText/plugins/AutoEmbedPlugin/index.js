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
exports.AutoEmbedDrawer = exports.getEmbedConfigs = void 0;
const LexicalAutoEmbedPlugin_1 = require("@lexical/react/LexicalAutoEmbedPlugin");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const react_1 = require("react");
const React = __importStar(require("react"));
const ReactDOM = __importStar(require("react-dom"));
const Button_1 = __importDefault(require("payload/dist/admin/components/elements/Button"));
const Dialog_1 = require("../../ui/Dialog");
const ModalPlugin_1 = require("../ModalPlugin");
const Drawer_1 = require("payload/dist/admin/components/elements/Drawer");
const utilities_1 = require("payload/components/utilities");
const modal_1 = require("@faceless-ui/modal");
require("./modal.scss");
const LexicalEditorComponent_1 = require("../../LexicalEditorComponent");
function getEmbedConfigs(editorConfig) {
    const embedConfigs = [];
    for (const feature of editorConfig.features) {
        if (feature.embedConfigs && feature.embedConfigs.length > 0) {
            embedConfigs.push(...feature.embedConfigs);
        }
    }
    return embedConfigs;
}
exports.getEmbedConfigs = getEmbedConfigs;
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
const debounce = (callback, delay) => {
    let timeoutId;
    return (text) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback(text);
        }, delay);
    };
};
const baseClass = 'rich-text-autoembed';
function AutoEmbedDrawer({ embedConfig, }) {
    const { uuid } = (0, LexicalEditorComponent_1.useEditorConfigContext)();
    const [text, setText] = (0, react_1.useState)('');
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [embedResult, setEmbedResult] = (0, react_1.useState)(null);
    const validateText = (0, react_1.useMemo)(() => debounce((inputText) => {
        const urlMatch = LexicalAutoEmbedPlugin_1.URL_MATCHER.exec(inputText);
        if (embedConfig != null && inputText != null && urlMatch != null) {
            Promise.resolve(embedConfig.parseUrl(inputText)).then((parseResult) => {
                setEmbedResult(parseResult);
            });
        }
        else if (embedResult != null) {
            setEmbedResult(null);
        }
    }, 200), [embedConfig, embedResult]);
    const onClick = () => {
        if (embedResult != null) {
            embedConfig.insertNode(editor, embedResult);
            toggleModal(autoEmbedDrawerSlug);
        }
    };
    const editDepth = (0, utilities_1.useEditDepth)();
    const autoEmbedDrawerSlug = (0, Drawer_1.formatDrawerSlug)({
        slug: `lexicalRichText-autoembed-${embedConfig.type}` + uuid,
        depth: editDepth,
    });
    const { toggleModal } = (0, modal_1.useModal)();
    return (React.createElement(Drawer_1.Drawer, { slug: autoEmbedDrawerSlug, key: autoEmbedDrawerSlug, className: baseClass, title: "Add Embed" },
        React.createElement("div", { className: "Input__wrapper" },
            React.createElement("input", { type: "text", className: "Input__input", placeholder: embedConfig.exampleUrl, value: text, "data-test-id": `${embedConfig.type}-embed-modal-url`, onChange: (e) => {
                    setText(e.target.value);
                    const { value } = e.target;
                    setText(value);
                    validateText(value);
                } })),
        React.createElement(Dialog_1.DialogActions, null,
            React.createElement(Button_1.default, { disabled: !embedResult, onClick: onClick, "data-test-id": `${embedConfig.type}-embed-modal-submit-btn` }, "Embed"))));
}
exports.AutoEmbedDrawer = AutoEmbedDrawer;
function AutoEmbedPlugin(props) {
    const editorConfig = props.editorConfig;
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const openEmbedModal = (embedConfig) => {
        editor.dispatchCommand(ModalPlugin_1.OPEN_MODAL_COMMAND, 'autoembed-' + embedConfig.type);
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
        React.createElement(LexicalAutoEmbedPlugin_1.LexicalAutoEmbedPlugin, { embedConfigs: getEmbedConfigs(editorConfig), onOpenEmbedModalForConfig: openEmbedModal, getMenuOptions: getMenuOptions, menuRenderFn: (anchorElementRef, { selectedIndex, options, selectOptionAndCleanUp, setHighlightedIndex, }) => anchorElementRef.current
                ? ReactDOM.createPortal(React.createElement("div", { className: "typeahead-popover auto-embed-menu", style: {
                        marginLeft: anchorElementRef.current.style.width,
                        width: 200,
                    } },
                    React.createElement(AutoEmbedMenu, { options: options, selectedItemIndex: selectedIndex, onOptionClick: (option, index) => {
                            setHighlightedIndex(index);
                            selectOptionAndCleanUp(option);
                        }, onOptionMouseEnter: (index) => {
                            setHighlightedIndex(index);
                        } })), anchorElementRef.current)
                : null })));
}
exports.default = AutoEmbedPlugin;
//# sourceMappingURL=index.js.map