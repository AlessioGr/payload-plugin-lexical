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
exports.HorizontalRuleFeature = void 0;
const React = __importStar(require("react"));
const LexicalHorizontalRulePlugin_1 = require("@lexical/react/LexicalHorizontalRulePlugin");
const LexicalHorizontalRuleNode_1 = require("@lexical/react/LexicalHorizontalRuleNode");
const ComponentPickerPlugin_1 = require("../../fields/LexicalRichText/plugins/ComponentPickerPlugin");
const DropDown_1 = require("../../fields/LexicalRichText/ui/DropDown");
require("./index.scss");
function HorizontalRuleFeature(props) {
    const horizontalRuleMarkdownElementTransformer = {
        dependencies: [LexicalHorizontalRuleNode_1.HorizontalRuleNode],
        export: (node) => {
            return (0, LexicalHorizontalRuleNode_1.$isHorizontalRuleNode)(node) ? '***' : null;
        },
        regExp: /^(---|\*\*\*|___)\s?$/,
        replace: (parentNode, _1, _2, isImport) => {
            const line = (0, LexicalHorizontalRuleNode_1.$createHorizontalRuleNode)();
            // TODO: Get rid of isImport flag
            if (isImport || parentNode.getNextSibling() != null) {
                parentNode.replace(line);
            }
            else {
                parentNode.insertBefore(line);
            }
            line.selectNext();
        },
        type: 'element',
    };
    const componentPickerOption = (editor, editorConfig) => new ComponentPickerPlugin_1.ComponentPickerOption('Horizontal Rule', {
        icon: React.createElement("i", { className: "icon horizontal-rule" }),
        keywords: ['horizontal rule', 'divider', 'hr'],
        onSelect: () => editor.dispatchCommand(LexicalHorizontalRuleNode_1.INSERT_HORIZONTAL_RULE_COMMAND, undefined),
    });
    return {
        plugins: [
            {
                component: React.createElement(LexicalHorizontalRulePlugin_1.HorizontalRulePlugin, { key: "horizontalrule" }),
            },
        ],
        nodes: [LexicalHorizontalRuleNode_1.HorizontalRuleNode],
        toolbar: {
            insert: [
                (editor, editorConfig) => {
                    return (React.createElement(DropDown_1.DropDownItem, { key: "horizontalrule", onClick: () => {
                            editor.dispatchCommand(LexicalHorizontalRuleNode_1.INSERT_HORIZONTAL_RULE_COMMAND, undefined);
                        }, className: "item" },
                        React.createElement("i", { className: "icon horizontal-rule" }),
                        React.createElement("span", { className: "text" }, "Horizontal Rule")));
                },
            ],
        },
        componentPicker: {
            componentPickerOptions: [componentPickerOption],
        },
        markdownTransformers: [horizontalRuleMarkdownElementTransformer],
    };
}
exports.HorizontalRuleFeature = HorizontalRuleFeature;
//# sourceMappingURL=HorizontalRuleFeature.js.map