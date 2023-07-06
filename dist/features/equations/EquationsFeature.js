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
exports.EquationsFeature = void 0;
const EquationNode_1 = require("./node/EquationNode");
const plugin_1 = __importStar(require("./plugin"));
const React = __importStar(require("react"));
const Drawer_1 = require("payload/dist/admin/components/elements/Drawer");
const DropDown_1 = require("../../fields/LexicalRichText/ui/DropDown");
const ModalPlugin_1 = require("../../fields/LexicalRichText/plugins/ModalPlugin");
const ComponentPickerPlugin_1 = require("../../fields/LexicalRichText/plugins/ComponentPickerPlugin");
function EquationsFeature(props) {
    const equationMarkdownTextMatchTransformer = {
        dependencies: [EquationNode_1.EquationNode],
        export: (node) => {
            if (!(0, EquationNode_1.$isEquationNode)(node)) {
                return null;
            }
            return `$${node.getEquation()}$`;
        },
        importRegExp: /\$([^$]+?)\$/,
        regExp: /\$([^$]+?)\$$/,
        replace: (textNode, match) => {
            const [, equation] = match;
            const equationNode = (0, EquationNode_1.$createEquationNode)(equation, true);
            textNode.replace(equationNode);
        },
        trigger: '$',
        type: 'text-match',
    };
    const componentPickerOption = (editor, editorConfig) => new ComponentPickerPlugin_1.ComponentPickerOption('Equation', {
        icon: React.createElement("i", { className: "icon equation" }),
        keywords: ['equation', 'latex', 'math'],
        onSelect: () => {
            editor.dispatchCommand(ModalPlugin_1.OPEN_MODAL_COMMAND, 'equation');
        },
    });
    return {
        plugins: [
            {
                component: React.createElement(plugin_1.default, { key: "equations" }),
            },
        ],
        nodes: [EquationNode_1.EquationNode],
        tableCellNodes: [EquationNode_1.EquationNode],
        modals: [
            {
                modal: plugin_1.InsertEquationDrawer,
                openModalCommand: {
                    type: 'equation',
                    command: (toggleModal, editDepth, uuid) => {
                        const addEquationDrawerSlug = (0, Drawer_1.formatDrawerSlug)({
                            slug: `lexicalRichText-add-equation` + uuid,
                            depth: editDepth,
                        });
                        toggleModal(addEquationDrawerSlug);
                    },
                },
            },
        ],
        toolbar: {
            insert: [
                (editor, editorConfig) => {
                    return (React.createElement(DropDown_1.DropDownItem, { key: "inlineProduct", onClick: () => {
                            editor.dispatchCommand(ModalPlugin_1.OPEN_MODAL_COMMAND, 'equation');
                        }, className: "item" },
                        React.createElement("i", { className: "icon equation" }),
                        React.createElement("span", { className: "text" }, "Equation")));
                },
            ],
        },
        componentPicker: {
            componentPickerOptions: [componentPickerOption],
        },
        markdownTransformers: [equationMarkdownTextMatchTransformer],
    };
}
exports.EquationsFeature = EquationsFeature;
//# sourceMappingURL=EquationsFeature.js.map