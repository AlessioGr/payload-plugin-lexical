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
exports.InsertEquationDrawer = exports.INSERT_EQUATION_COMMAND = void 0;
require("katex/dist/katex.css");
require("./modal.scss");
require("./index.scss");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const React = __importStar(require("react"));
const modal_1 = require("@faceless-ui/modal");
const EditDepth_1 = require("payload/dist/admin/components/utilities/EditDepth");
const Drawer_1 = require("payload/dist/admin/components/elements/Drawer");
const EquationNode_1 = require("../node/EquationNode");
const KatexEquationAlterer_1 = __importDefault(require("../ui/KatexEquationAlterer"));
const LexicalEditorComponent_1 = require("../../../fields/LexicalRichText/LexicalEditorComponent");
exports.INSERT_EQUATION_COMMAND = (0, lexical_1.createCommand)('INSERT_EQUATION_COMMAND');
const baseClass = 'rich-text-equation-modal';
function InsertEquationDrawer(props) {
    const { uuid } = (0, LexicalEditorComponent_1.useEditorConfigContext)();
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [activeEditor, setActiveEditor] = (0, react_1.useState)(editor);
    const editDepth = (0, EditDepth_1.useEditDepth)();
    const equationDrawerSlug = (0, Drawer_1.formatDrawerSlug)({
        slug: `lexicalRichText-add-equation` + uuid,
        depth: editDepth,
    });
    const { toggleModal } = (0, modal_1.useModal)();
    const onEquationConfirm = (0, react_1.useCallback)((equation, inline) => {
        toggleModal(equationDrawerSlug);
        activeEditor.dispatchCommand(exports.INSERT_EQUATION_COMMAND, {
            equation,
            inline,
        });
    }, [activeEditor /* , onClose */]);
    return (React.createElement(Drawer_1.Drawer, { slug: equationDrawerSlug, key: equationDrawerSlug, className: baseClass, title: "Add equation" },
        React.createElement(KatexEquationAlterer_1.default, { onConfirm: onEquationConfirm })));
}
exports.InsertEquationDrawer = InsertEquationDrawer;
function EquationsPlugin() {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => {
        if (!editor.hasNodes([EquationNode_1.EquationNode])) {
            throw new Error('EquationsPlugins: EquationsNode not registered on editor');
        }
        return editor.registerCommand(exports.INSERT_EQUATION_COMMAND, (payload) => {
            const { equation, inline } = payload;
            editor.update(() => {
                const equationNode = (0, EquationNode_1.$createEquationNode)(equation, inline);
                (0, lexical_1.$insertNodes)([equationNode]);
                if ((0, lexical_1.$isRootOrShadowRoot)(equationNode.getParentOrThrow())) {
                    (0, utils_1.$wrapNodeInElement)(equationNode, lexical_1.$createParagraphNode).selectEnd();
                }
            });
            return true;
        }, lexical_1.COMMAND_PRIORITY_EDITOR);
    }, [editor]);
    return null;
}
exports.default = EquationsPlugin;
//# sourceMappingURL=index.js.map