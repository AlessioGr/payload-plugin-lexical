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
exports.CollapsibleFeature = void 0;
const React = __importStar(require("react"));
const plugins_1 = __importStar(require("./plugins"));
const CollapsibleContainerNode_1 = require("./nodes/CollapsibleContainerNode");
const CollapsibleContentNode_1 = require("./nodes/CollapsibleContentNode");
const CollapsibleTitleNode_1 = require("./nodes/CollapsibleTitleNode");
const ComponentPickerPlugin_1 = require("../../fields/LexicalRichText/plugins/ComponentPickerPlugin");
const DropDown_1 = require("../../fields/LexicalRichText/ui/DropDown");
function CollapsibleFeature(props) {
    const componentPickerOption = (editor, editorConfig) => new ComponentPickerPlugin_1.ComponentPickerOption('Collapsible', {
        icon: React.createElement("i", { className: "icon caret-right" }),
        keywords: ['collapse', 'collapsible', 'toggle'],
        onSelect: () => editor.dispatchCommand(plugins_1.INSERT_COLLAPSIBLE_COMMAND, undefined),
    });
    return {
        plugins: [
            {
                component: React.createElement(plugins_1.default, { key: "collapsible" }),
            },
        ],
        nodes: [
            CollapsibleContainerNode_1.CollapsibleContainerNode,
            CollapsibleContentNode_1.CollapsibleContentNode,
            CollapsibleTitleNode_1.CollapsibleTitleNode,
        ],
        toolbar: {
            insert: [
                (editor, editorConfig) => {
                    return (React.createElement(DropDown_1.DropDownItem, { key: "collapsible", onClick: () => {
                            editor.dispatchCommand(plugins_1.INSERT_COLLAPSIBLE_COMMAND, undefined);
                        }, className: "item" },
                        React.createElement("i", { className: "icon caret-right" }),
                        React.createElement("span", { className: "text" }, "Collapsible container")));
                },
            ],
        },
        componentPicker: {
            componentPickerOptions: [componentPickerOption],
        },
    };
}
exports.CollapsibleFeature = CollapsibleFeature;
//# sourceMappingURL=CollapsibleFeature.js.map