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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const reduceFieldsToValues_1 = __importDefault(require("payload/dist/admin/components/forms/Form/reduceFieldsToValues"));
const baseFields_1 = require("payload/dist/admin/components/forms/field-types/RichText/elements/link/LinkDrawer/baseFields");
const Config_1 = require("payload/dist/admin/components/utilities/Config");
const buildStateFromSchema_1 = __importDefault(require("payload/dist/admin/components/forms/Form/buildStateFromSchema"));
const Auth_1 = require("payload/dist/admin/components/utilities/Auth");
const Locale_1 = require("payload/dist/admin/components/utilities/Locale");
const EditDepth_1 = require("payload/dist/admin/components/utilities/EditDepth");
const Drawer_1 = require("payload/dist/admin/components/elements/Drawer");
const getSelectedNode_1 = require("../../../fields/LexicalRichText/utils/getSelectedNode");
const LinkNodeModified_1 = require("../nodes/LinkNodeModified");
const LinkDrawer_1 = require("./LinkDrawer");
const AutoLinkNodeModified_1 = require("../nodes/AutoLinkNodeModified");
const LexicalEditorComponent_1 = require("../../../fields/LexicalRichText/LexicalEditorComponent");
const setFloatingElemPositionForLinkEditor_1 = require("../../../fields/LexicalRichText/utils/setFloatingElemPositionForLinkEditor");
function LinkEditor({ editor, isLink, setIsLink, anchorElem, }) {
    const editorRef = (0, react_1.useRef)(null);
    const [linkUrl, setLinkUrl] = (0, react_1.useState)('');
    const [linkLabel, setLinkLabel] = (0, react_1.useState)('');
    const [lastSelection, setLastSelection] = (0, react_1.useState)(null);
    const { uuid } = (0, LexicalEditorComponent_1.useEditorConfigContext)();
    const customFieldSchema = false; /* fieldProps?.admin?.link?.fields */ // TODO: Field props
    const config = (0, Config_1.useConfig)();
    const { user } = (0, Auth_1.useAuth)();
    const locale = (0, Locale_1.useLocale)();
    const { t } = (0, react_i18next_1.useTranslation)('fields');
    const [initialState, setInitialState] = (0, react_1.useState)({});
    const [fieldSchema] = (0, react_1.useState)(() => {
        const fields = [...(0, baseFields_1.getBaseFields)(config)];
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
        fields.push({
            name: 'sponsored',
            label: 'Sponsored',
            type: 'checkbox',
            admin: {
                condition: ({ linkType }) => {
                    return linkType === 'custom';
                },
            },
        });
        fields.push({
            name: 'nofollow',
            label: 'Nofollow',
            type: 'checkbox',
            admin: {
                condition: ({ linkType }) => {
                    return linkType === 'custom';
                },
            },
        });
        return fields;
    });
    const { toggleModal, isModalOpen, closeModal } = (0, modal_1.useModal)();
    const editDepth = (0, EditDepth_1.useEditDepth)();
    const drawerSlug = (0, Drawer_1.formatDrawerSlug)({
        slug: `rich-text-link-lexicalRichText` + uuid,
        depth: editDepth,
    });
    const updateLinkEditor = (0, react_1.useCallback)(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
        const selection = (0, lexical_1.$getSelection)();
        if ((0, lexical_1.$isRangeSelection)(selection)) {
            const node = (0, getSelectedNode_1.getSelectedNode)(selection);
            const parent = node.getParent();
            // Initial state thingy
            // Initial state:
            let data = {
                text: '',
                url: '',
                linkType: undefined,
                newTab: undefined,
                sponsored: undefined,
                nofollow: undefined,
                doc: undefined,
                fields: undefined,
            };
            if ((0, LinkNodeModified_1.$isLinkNode)(parent)) {
                data = Object.assign(Object.assign({}, parent.getAttributes()), { text: parent.getTextContent(), fields: undefined });
                if (((_a = parent.getAttributes()) === null || _a === void 0 ? void 0 : _a.linkType) === 'custom') {
                    setLinkUrl((_b = parent.getAttributes()) === null || _b === void 0 ? void 0 : _b.url);
                    setLinkLabel(null);
                }
                else {
                    // internal
                    setLinkUrl(`/admin/collections/${(_d = (_c = parent.getAttributes()) === null || _c === void 0 ? void 0 : _c.doc) === null || _d === void 0 ? void 0 : _d.relationTo}/${(_f = (_e = parent.getAttributes()) === null || _e === void 0 ? void 0 : _e.doc) === null || _f === void 0 ? void 0 : _f.value}`);
                    setLinkLabel(`relation to ${(_h = (_g = parent.getAttributes()) === null || _g === void 0 ? void 0 : _g.doc) === null || _h === void 0 ? void 0 : _h.relationTo}: ${(_k = (_j = parent.getAttributes()) === null || _j === void 0 ? void 0 : _j.doc) === null || _k === void 0 ? void 0 : _k.value}`);
                }
            }
            else if ((0, LinkNodeModified_1.$isLinkNode)(node)) {
                data = Object.assign(Object.assign({}, node.getAttributes()), { text: node.getTextContent(), fields: undefined });
                if (((_l = node.getAttributes()) === null || _l === void 0 ? void 0 : _l.linkType) === 'custom') {
                    setLinkUrl((_m = node.getAttributes()) === null || _m === void 0 ? void 0 : _m.url);
                    setLinkLabel(null);
                }
                else {
                    // internal
                    setLinkUrl(`/admin/collections/${(_p = (_o = parent.getAttributes()) === null || _o === void 0 ? void 0 : _o.doc) === null || _p === void 0 ? void 0 : _p.relationTo}/${(_r = (_q = parent.getAttributes()) === null || _q === void 0 ? void 0 : _q.doc) === null || _r === void 0 ? void 0 : _r.value}`);
                    setLinkLabel(`relation to ${(_t = (_s = parent.getAttributes()) === null || _s === void 0 ? void 0 : _s.doc) === null || _t === void 0 ? void 0 : _t.relationTo}: ${(_v = (_u = parent.getAttributes()) === null || _u === void 0 ? void 0 : _u.doc) === null || _v === void 0 ? void 0 : _v.value}`);
                }
            }
            else {
                setLinkUrl('');
                setLinkLabel(null);
            }
            (0, buildStateFromSchema_1.default)({
                fieldSchema,
                data,
                user,
                operation: 'create',
                locale,
                t,
            }).then((state) => {
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
        if (selection !== null &&
            nativeSelection !== null &&
            rootElement !== null &&
            rootElement.contains(nativeSelection.anchorNode) &&
            editor.isEditable()) {
            const domRect = (_x = (_w = nativeSelection.focusNode) === null || _w === void 0 ? void 0 : _w.parentElement) === null || _x === void 0 ? void 0 : _x.getBoundingClientRect();
            if (domRect) {
                domRect.y += 40;
                (0, setFloatingElemPositionForLinkEditor_1.setFloatingElemPositionForLinkEditor)(domRect, editorElem, anchorElem);
            }
            setLastSelection(selection);
        }
        else if (!activeElement || activeElement.className !== 'link-input') {
            if (rootElement !== null) {
                (0, setFloatingElemPositionForLinkEditor_1.setFloatingElemPositionForLinkEditor)(null, editorElem, anchorElem);
            }
            setLastSelection(null);
            setLinkUrl('');
            setLinkLabel(null);
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
        }, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_ESCAPE_COMMAND, () => {
            if (isLink) {
                setIsLink(false);
                return true;
            }
            return false;
        }, lexical_1.COMMAND_PRIORITY_HIGH));
    }, [editor, updateLinkEditor, setIsLink, isLink]);
    (0, react_1.useEffect)(() => {
        editor.getEditorState().read(() => {
            updateLinkEditor();
        });
    }, [editor, updateLinkEditor]);
    return (React.createElement("div", { ref: editorRef, className: "link-editor" },
        React.createElement(LinkDrawer_1.LinkDrawer // TODO: Might aswell import from payload/dist/admin/components/forms/field-types/RichText/elements/link/LinkDrawer/index.tsx instead?
        , { drawerSlug: drawerSlug, fieldSchema: fieldSchema, initialState: initialState, handleClose: () => {
                closeModal(drawerSlug);
            }, handleModalSubmit: (fields) => {
                closeModal(drawerSlug);
                const data = (0, reduceFieldsToValues_1.default)(fields, true);
                const newNode = {
                    newTab: data.newTab,
                    sponsored: data.sponsored,
                    nofollow: data.nofollow,
                    url: data.linkType === 'custom' ? data.url : undefined,
                    linkType: data.linkType,
                    doc: data.linkType === 'internal' ? data.doc : undefined,
                    text: data === null || data === void 0 ? void 0 : data.text,
                };
                /*if (customFieldSchema) {
                    newNode.fields += data.fields;
                  }*/ //TODO
                editor.dispatchCommand(LinkNodeModified_1.TOGGLE_LINK_COMMAND, newNode);
            } }),
        isLink && !isModalOpen(drawerSlug) && (React.createElement("div", { className: "link-input" },
            React.createElement("a", { href: linkUrl, target: "_blank", rel: "noopener noreferrer" }, linkLabel !== null && linkLabel !== void 0 ? linkLabel : linkUrl),
            React.createElement("div", { className: "link-edit", role: "button", tabIndex: 0, onMouseDown: (event) => event.preventDefault(), onClick: () => {
                    toggleModal(drawerSlug);
                } }),
            React.createElement("div", { className: "link-trash", role: "button", tabIndex: 0, onMouseDown: (event) => event.preventDefault(), onClick: () => {
                    editor.dispatchCommand(LinkNodeModified_1.TOGGLE_LINK_COMMAND, null);
                } })))));
}
function useFloatingLinkEditorToolbar(editor, anchorElem) {
    const [activeEditor, setActiveEditor] = (0, react_1.useState)(editor);
    const [isLink, setIsLink] = (0, react_1.useState)(false);
    const updateToolbar = (0, react_1.useCallback)(() => __awaiter(this, void 0, void 0, function* () {
        const selection = (0, lexical_1.$getSelection)();
        if ((0, lexical_1.$isRangeSelection)(selection)) {
            const node = (0, getSelectedNode_1.getSelectedNode)(selection);
            const linkParent = (0, utils_1.$findMatchingParent)(node, LinkNodeModified_1.$isLinkNode);
            const autoLinkParent = (0, utils_1.$findMatchingParent)(node, AutoLinkNodeModified_1.$isAutoLinkNode);
            if (linkParent != null || autoLinkParent != null) {
                setIsLink(true);
            }
            else {
                setIsLink(false);
            }
        }
    }), []);
    (0, react_1.useEffect)(() => {
        return (0, utils_1.mergeRegister)(editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateToolbar();
            });
        }), editor.registerCommand(lexical_1.SELECTION_CHANGE_COMMAND, (_payload, newEditor) => {
            updateToolbar();
            setActiveEditor(newEditor);
            return false;
        }, lexical_1.COMMAND_PRIORITY_CRITICAL));
    }, [editor, updateToolbar]);
    return (0, react_dom_1.createPortal)(React.createElement(LinkEditor, { editor: activeEditor, anchorElem: anchorElem, isLink: isLink, setIsLink: setIsLink }), anchorElem);
}
function FloatingLinkEditorPlugin({ anchorElem = document.body, }) {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    return useFloatingLinkEditorToolbar(editor, anchorElem);
}
exports.default = FloatingLinkEditorPlugin;
//# sourceMappingURL=index.js.map