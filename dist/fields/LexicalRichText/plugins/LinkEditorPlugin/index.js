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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditLinkModal = void 0;
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
require("./index.scss");
// import { $isAutoLinkNode, $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const React = __importStar(require("react"));
const react_dom_1 = require("react-dom");
const modal_1 = require("@faceless-ui/modal");
const react_i18next_1 = require("react-i18next");
const LinkPluginModified_1 = require("../LinkPlugin/LinkPluginModified");
const LinkPreview_1 = __importDefault(require("../../ui/LinkPreview"));
const getSelectedNode_1 = require("../../utils/getSelectedNode");
const setFloatingElemPosition_1 = require("../../utils/setFloatingElemPosition");
const Minimal_1 = __importDefault(require("payload/dist/admin/components/templates/Minimal"));
const Button_1 = __importDefault(require("payload/dist/admin/components/elements/Button"));
require("./modal.scss");
const RenderFields_1 = __importDefault(require("payload/dist/admin/components/forms/RenderFields"));
const field_types_1 = __importDefault(require("payload/dist/admin/components/forms/field-types"));
const Submit_1 = __importDefault(require("payload/dist/admin/components/forms/Submit"));
const Form_1 = __importDefault(require("payload/dist/admin/components/forms/Form"));
const reduceFieldsToValues_1 = __importDefault(require("payload/dist/admin/components/forms/Form/reduceFieldsToValues"));
const baseFields_1 = require("payload/dist/admin/components/forms/field-types/RichText/elements/link/Modal/baseFields");
const Config_1 = require("payload/dist/admin/components/utilities/Config");
const buildStateFromSchema_1 = __importDefault(require("payload/dist/admin/components/forms/Form/buildStateFromSchema"));
const Auth_1 = require("payload/dist/admin/components/utilities/Auth");
const Locale_1 = require("payload/dist/admin/components/utilities/Locale");
function LinkEditor({ editor, anchorElem, }) {
    const editorRef = (0, react_1.useRef)(null);
    const [linkUrl, setLinkUrl] = (0, react_1.useState)('');
    const [isEditMode, setEditMode] = (0, react_1.useState)(false);
    const [lastSelection, setLastSelection] = (0, react_1.useState)(null);
    const customFieldSchema = false /* fieldProps?.admin?.link?.fields */; // TODO: Field props
    const config = (0, Config_1.useConfig)();
    const { user } = (0, Auth_1.useAuth)();
    const locale = (0, Locale_1.useLocale)();
    const { t } = (0, react_i18next_1.useTranslation)('fields');
    const [initialState, setInitialState] = (0, react_1.useState)({});
    const [fieldSchema] = (0, react_1.useState)(() => {
        const fields = [
            ...(0, baseFields_1.getBaseFields)(config),
        ];
        if (customFieldSchema) {
            fields.push({
                name: 'fields',
                type: 'group',
                admin: {
                    style: {
                        margin: 0,
                        padding: 0,
                        borderTop: 0,
                        borderBottom: 0,
                    },
                },
                fields: customFieldSchema,
            });
        }
        return fields;
    });
    const { toggleModal, isModalOpen, } = (0, modal_1.useModal)();
    const modalSlug = 'lexicalRichText-edit-link';
    const baseModalClass = 'rich-text-link-edit-modal';
    const updateLinkEditor = (0, react_1.useCallback)(() => {
        var _a, _b, _c, _d;
        const selection = (0, lexical_1.$getSelection)();
        if ((0, lexical_1.$isRangeSelection)(selection)) {
            const node = (0, getSelectedNode_1.getSelectedNode)(selection);
            const parent = node.getParent();
            // Initial state thingy
            // Initial state:
            const data = {
                text: '',
                url: '',
                linkType: undefined,
                newTab: undefined,
                doc: undefined,
                fields: undefined,
            };
            if ((0, LinkPluginModified_1.$isLinkNode)(parent)) {
                data.text = parent.getTextContent();
                data.url = parent.getURL();
                data.newTab = parent.isNewTab();
                data.linkType = parent.getLinkType();
                data.doc = parent.getDoc();
                if (parent.getLinkType() === 'custom') {
                    setLinkUrl(parent.getURL());
                }
                else { // internal
                    setLinkUrl(`relation to ${(_a = parent.getDoc()) === null || _a === void 0 ? void 0 : _a.relationTo}: ${(_b = parent.getDoc()) === null || _b === void 0 ? void 0 : _b.value}`);
                }
            }
            else if ((0, LinkPluginModified_1.$isLinkNode)(node)) {
                data.text = node.getTextContent();
                data.url = node.getURL();
                data.newTab = node.isNewTab();
                data.linkType = node.getLinkType();
                data.doc = node.getDoc();
                if (node.getLinkType() === 'custom') {
                    setLinkUrl(node.getURL());
                }
                else { // internal
                    setLinkUrl(`relation to ${(_c = node.getDoc()) === null || _c === void 0 ? void 0 : _c.relationTo}: ${(_d = node.getDoc()) === null || _d === void 0 ? void 0 : _d.value}`);
                }
            }
            else {
                setLinkUrl('');
            }
            (0, buildStateFromSchema_1.default)({ fieldSchema, data, user, operation: 'create', locale, t }).then((state) => {
                setInitialState(state);
            });
        }
        const editorElem = editorRef.current;
        const nativeSelection = window.getSelection();
        const { activeElement } = document;
        if (editorElem === null) {
            return;
        }
        const rootElement = editor.getRootElement();
        if (selection !== null
            && nativeSelection !== null
            && rootElement !== null
            && rootElement.contains(nativeSelection.anchorNode)
            && editor.isEditable()) {
            const domRange = nativeSelection.getRangeAt(0);
            let rect;
            if (nativeSelection.anchorNode === rootElement) {
                let inner = rootElement;
                while (inner.firstElementChild != null) {
                    inner = inner.firstElementChild;
                }
                rect = inner.getBoundingClientRect();
            }
            else {
                rect = domRange.getBoundingClientRect();
            }
            (0, setFloatingElemPosition_1.setFloatingElemPosition)(rect, editorElem, anchorElem);
            setLastSelection(selection);
        }
        else if (!activeElement || activeElement.className !== 'link-input') {
            if (rootElement !== null) {
                (0, setFloatingElemPosition_1.setFloatingElemPosition)(null, editorElem, anchorElem);
            }
            setLastSelection(null);
            setEditMode(false);
            setLinkUrl('');
        }
        return true;
    }, [anchorElem, editor]);
    (0, react_1.useEffect)(() => {
        const scrollerElem = anchorElem.parentElement;
        const update = () => {
            editor.getEditorState().read(() => {
                updateLinkEditor();
            });
        };
        window.addEventListener('resize', update);
        if (scrollerElem) {
            scrollerElem.addEventListener('scroll', update);
        }
        return () => {
            window.removeEventListener('resize', update);
            if (scrollerElem) {
                scrollerElem.removeEventListener('scroll', update);
            }
        };
    }, [anchorElem.parentElement, editor, updateLinkEditor]);
    (0, react_1.useEffect)(() => {
        return (0, utils_1.mergeRegister)(editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateLinkEditor();
            });
        }), editor.registerCommand(lexical_1.SELECTION_CHANGE_COMMAND, () => {
            updateLinkEditor();
            return true;
        }, lexical_1.COMMAND_PRIORITY_LOW));
    }, [editor, updateLinkEditor]);
    (0, react_1.useEffect)(() => {
        editor.getEditorState().read(() => {
            updateLinkEditor();
        });
    }, [editor, updateLinkEditor]);
    return (React.createElement("div", { ref: editorRef, className: "link-editor" }, isEditMode && isModalOpen(modalSlug) ? (React.createElement(modal_1.Modal, { className: baseModalClass, slug: modalSlug },
        React.createElement(EditLinkModal, { editor: editor, setEditMode: setEditMode, modalSlug: modalSlug, fieldSchema: fieldSchema, initialState: initialState, handleModalSubmit: (fields) => {
                console.log('Submit! fields:', fields);
                // setLinkUrl(sanitizeUrl(fields.url.value));
                setEditMode(false);
                toggleModal(modalSlug);
                const data = (0, reduceFieldsToValues_1.default)(fields, true);
                /* const newLink = {
                  type: 'link',
                  linkType: data.linkType,
                  url: data.linkType === 'custom' ? data.url : undefined,
                  doc: data.linkType === 'internal' ? data.doc : undefined,
                  newTab: data.newTab,
                  fields: data.fields,
                  children: [],
                }; */
                const newNode = {
                    newTab: data.newTab,
                    url: data.linkType === 'custom' ? data.url : undefined,
                    linkType: data.linkType,
                    doc: data.linkType === 'internal' ? data.doc : undefined,
                    payloadType: 'payload',
                };
                if (customFieldSchema) {
                    newNode.fields = data.fields;
                }
                editor.dispatchCommand(LinkPluginModified_1.TOGGLE_LINK_COMMAND, newNode);
            } }))) : (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "link-input" },
            React.createElement("a", { href: linkUrl, target: "_blank", rel: "noopener noreferrer" }, linkUrl),
            React.createElement("div", { className: "link-edit", role: "button", tabIndex: 0, onMouseDown: (event) => event.preventDefault(), onClick: () => {
                    setEditMode(true);
                    toggleModal(modalSlug);
                } })),
        React.createElement(LinkPreview_1.default, { url: linkUrl })))));
}
function useFloatingLinkEditorToolbar(editor, anchorElem) {
    const [activeEditor, setActiveEditor] = (0, react_1.useState)(editor);
    const [isLink, setIsLink] = (0, react_1.useState)(false);
    const updateToolbar = (0, react_1.useCallback)(async () => {
        const selection = (0, lexical_1.$getSelection)();
        if ((0, lexical_1.$isRangeSelection)(selection)) {
            const node = (0, getSelectedNode_1.getSelectedNode)(selection);
            const linkParent = (0, utils_1.$findMatchingParent)(node, LinkPluginModified_1.$isLinkNode);
            const autoLinkParent = (0, utils_1.$findMatchingParent)(node, LinkPluginModified_1.$isAutoLinkNode);
            if (linkParent != null && autoLinkParent == null) {
                setIsLink(true);
            }
            else {
                setIsLink(false);
            }
        }
    }, []);
    (0, react_1.useEffect)(() => {
        return editor.registerCommand(lexical_1.SELECTION_CHANGE_COMMAND, (_payload, newEditor) => {
            updateToolbar();
            setActiveEditor(newEditor);
            return false;
        }, lexical_1.COMMAND_PRIORITY_CRITICAL);
    }, [editor, updateToolbar]);
    return isLink
        ? (0, react_dom_1.createPortal)(React.createElement(LinkEditor, { editor: activeEditor, anchorElem: anchorElem }), anchorElem)
        : null;
}
function FloatingLinkEditorPlugin({ anchorElem = document.body, }) {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    return useFloatingLinkEditorToolbar(editor, anchorElem);
}
exports.default = FloatingLinkEditorPlugin;
function EditLinkModal({ editor, setEditMode, modalSlug, handleModalSubmit, initialState, fieldSchema, }) {
    const baseModalClass = 'rich-text-link-edit-modal';
    const { toggleModal, } = (0, modal_1.useModal)();
    const inputRef = (0, react_1.useRef)(null);
    if (inputRef.current) {
        inputRef.current.focus();
    }
    console.log('ISTATE', initialState);
    return (React.createElement(React.Fragment, null,
        React.createElement(Minimal_1.default, { className: `${baseModalClass}__template` },
            React.createElement("header", { className: `${baseModalClass}__header` },
                React.createElement("h3", null, "Edit Link"),
                React.createElement(Button_1.default, { icon: "x", round: true, buttonStyle: "icon-label", iconStyle: "with-border", onClick: () => {
                        setEditMode(false);
                        toggleModal(modalSlug);
                    } })),
            React.createElement(Form_1.default, { onSubmit: handleModalSubmit, initialState: initialState },
                React.createElement(RenderFields_1.default, { fieldTypes: field_types_1.default, readOnly: false, fieldSchema: fieldSchema, forceRender: true }),
                React.createElement(Submit_1.default, null, "Confirm")))));
}
exports.EditLinkModal = EditLinkModal;
