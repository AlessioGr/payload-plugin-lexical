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
exports.InsertEquationDialog = exports.INSERT_EQUATION_COMMAND = void 0;
require("katex/dist/katex.css");
require("./modal.scss");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const React = __importStar(require("react"));
const modal_1 = require("@faceless-ui/modal");
const EquationNode_1 = require("../../nodes/EquationNode");
const KatexEquationAlterer_1 = __importDefault(require("../../ui/KatexEquationAlterer"));
const Minimal_1 = __importDefault(require("payload/dist/admin/components/templates/Minimal"));
const Button_1 = __importDefault(require("payload/dist/admin/components/elements/Button"));
exports.INSERT_EQUATION_COMMAND = (0, lexical_1.createCommand)('INSERT_EQUATION_COMMAND');
function InsertEquationDialog({ activeEditor, }) {
    const { toggleModal, } = (0, modal_1.useModal)();
    const modalSlug = 'lexicalRichText-add-equation';
    const baseModalClass = 'rich-text-equation-modal';
    const onEquationConfirm = (0, react_1.useCallback)((equation, inline) => {
        activeEditor.dispatchCommand(exports.INSERT_EQUATION_COMMAND, { equation, inline });
        toggleModal(modalSlug);
    }, [activeEditor /* , onClose */]);
    return (React.createElement(React.Fragment, null,
        React.createElement(Minimal_1.default, { width: "wide" },
            React.createElement("header", { className: `${baseModalClass}__header` },
                React.createElement("h1", null, "Add equation"),
                React.createElement(Button_1.default, { icon: "x", round: true, buttonStyle: "icon-label", iconStyle: "with-border", onClick: () => {
                        toggleModal(modalSlug);
                    } })),
            React.createElement(KatexEquationAlterer_1.default, { onConfirm: onEquationConfirm }))));
}
exports.InsertEquationDialog = InsertEquationDialog;
function EquationsPlugin() {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => {
        if (!editor.hasNodes([EquationNode_1.EquationNode])) {
            throw new Error('EquationsPlugins: EquationsNode not registered on editor');
        }
        return editor.registerCommand(exports.INSERT_EQUATION_COMMAND, (payload) => {
            const { equation, inline } = payload;
            const equationNode = (0, EquationNode_1.$createEquationNode)(equation, inline);
            (0, lexical_1.$insertNodes)([equationNode]);
            if ((0, lexical_1.$isRootOrShadowRoot)(equationNode.getParentOrThrow())) {
                (0, utils_1.$wrapNodeInElement)(equationNode, lexical_1.$createParagraphNode).selectEnd();
            }
            return true;
        }, lexical_1.COMMAND_PRIORITY_EDITOR);
    }, [editor]);
    return null;
}
exports.default = EquationsPlugin;
//# sourceMappingURL=index.js.map