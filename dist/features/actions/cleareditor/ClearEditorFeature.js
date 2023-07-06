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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearEditorFeature = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const lexical_1 = require("lexical");
const Drawer_1 = require("payload/dist/admin/components/elements/Drawer");
const ModalPlugin_1 = require("../../../fields/LexicalRichText/plugins/ModalPlugin");
const drawer_1 = require("./drawer");
function ClearEditorAction() {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [isEditorEmpty, setIsEditorEmpty] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        //Not sure if this here is needed
        return editor.registerUpdateListener(({ dirtyElements, prevEditorState, tags }) => {
            editor.getEditorState().read(() => {
                const root = (0, lexical_1.$getRoot)();
                const children = root.getChildren();
                if (children.length > 1) {
                    setIsEditorEmpty(false);
                }
                else if ((0, lexical_1.$isParagraphNode)(children[0])) {
                    const paragraphChildren = children[0].getChildren();
                    setIsEditorEmpty(paragraphChildren.length === 0);
                }
                else {
                    setIsEditorEmpty(false);
                }
            });
        });
    }, [editor]);
    return (React.createElement("button", { className: "action-button clear", disabled: isEditorEmpty, onClick: (event) => {
            event.preventDefault();
            editor.dispatchCommand(ModalPlugin_1.OPEN_MODAL_COMMAND, 'clear-editor');
        }, title: "Clear", "aria-label": "Clear editor contents" },
        React.createElement("i", { className: "clear" })));
}
function ClearEditorFeature(props) {
    return {
        actions: [React.createElement(ClearEditorAction, { key: "cleareditor" })],
        modals: [
            {
                modal: drawer_1.ClearEditorDrawer,
                openModalCommand: {
                    type: 'clear-editor',
                    command: (toggleModal, editDepth, uuid) => {
                        const addEquationDrawerSlug = (0, Drawer_1.formatDrawerSlug)({
                            slug: `lexicalRichText-clear-editor` + uuid,
                            depth: editDepth,
                        });
                        toggleModal(addEquationDrawerSlug);
                    },
                },
            },
        ],
    };
}
exports.ClearEditorFeature = ClearEditorFeature;
//# sourceMappingURL=ClearEditorFeature.js.map