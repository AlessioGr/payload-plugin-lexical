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
exports.ClearEditorDrawer = void 0;
require("./index.scss");
const React = __importStar(require("react"));
const lexical_1 = require("lexical");
const Button_1 = __importDefault(require("payload/dist/admin/components/elements/Button"));
const utilities_1 = require("payload/components/utilities");
const Drawer_1 = require("payload/dist/admin/components/elements/Drawer");
const modal_1 = require("@faceless-ui/modal");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const react_1 = require("react");
const LexicalEditorComponent_1 = require("../../../../fields/LexicalRichText/LexicalEditorComponent");
const baseClass = 'rich-text-clear-editor-drawer';
function ClearEditorDrawer(props) {
    const { uuid } = (0, LexicalEditorComponent_1.useEditorConfigContext)();
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [activeEditor, setActiveEditor] = (0, react_1.useState)(editor);
    const editDepth = (0, utilities_1.useEditDepth)();
    const equationDrawerSlug = (0, Drawer_1.formatDrawerSlug)({
        slug: `lexicalRichText-clear-editor` + uuid,
        depth: editDepth,
    });
    const { toggleModal } = (0, modal_1.useModal)();
    return (React.createElement(Drawer_1.Drawer, { slug: equationDrawerSlug, key: equationDrawerSlug, className: baseClass, title: "Are you sure you want to clear the editor?" },
        React.createElement("div", { className: "Modal__content" },
            React.createElement(Button_1.default, { onClick: () => {
                    activeEditor.dispatchCommand(lexical_1.CLEAR_EDITOR_COMMAND, undefined);
                    toggleModal(equationDrawerSlug);
                    activeEditor.focus();
                } }, "Clear"),
            ' ',
            React.createElement(Button_1.default, { onClick: () => {
                    toggleModal(equationDrawerSlug);
                    activeEditor.focus();
                } }, "Cancel"))));
}
exports.ClearEditorDrawer = ClearEditorDrawer;
//# sourceMappingURL=index.js.map