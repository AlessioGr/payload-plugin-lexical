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
exports.FigmaFeature = void 0;
const React = __importStar(require("react"));
const plugins_1 = __importStar(require("./plugins"));
const FigmaNode_1 = require("./nodes/FigmaNode");
const AutoEmbedPlugin_1 = require("../../../fields/LexicalRichText/plugins/AutoEmbedPlugin");
const Drawer_1 = require("payload/dist/admin/components/elements/Drawer");
function FigmaFeature(props) {
    const FigmaEmbedConfig = {
        contentName: 'Figma Document',
        exampleUrl: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
        icon: React.createElement("i", { className: "icon figma" }),
        insertNode: (editor, result) => {
            editor.dispatchCommand(plugins_1.INSERT_FIGMA_COMMAND, result.id);
        },
        keywords: ['figma', 'figma.com', 'mock-up'],
        // Determine if a given URL is a match and return url data.
        parseUrl: (text) => {
            const match = /https:\/\/([\w.-]+\.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/.exec(text);
            if (match != null) {
                return {
                    id: match[3],
                    url: match[0],
                };
            }
            return null;
        },
        type: 'figma',
    };
    return {
        plugins: [
            {
                component: React.createElement(plugins_1.default, { key: "figma" }),
            },
        ],
        nodes: [FigmaNode_1.FigmaNode],
        embedConfigs: [FigmaEmbedConfig],
        modals: [
            {
                modal: (props) => (0, AutoEmbedPlugin_1.AutoEmbedDrawer)({ embedConfig: FigmaEmbedConfig }),
                openModalCommand: {
                    type: 'autoembed-' + FigmaEmbedConfig.type,
                    command: (toggleModal, editDepth, uuid) => {
                        const autoEmbedDrawerSlug = (0, Drawer_1.formatDrawerSlug)({
                            slug: `lexicalRichText-autoembed-` + FigmaEmbedConfig.type + uuid,
                            depth: editDepth,
                        });
                        toggleModal(autoEmbedDrawerSlug);
                    },
                },
            },
        ],
    };
}
exports.FigmaFeature = FigmaFeature;
//# sourceMappingURL=FigmaFeature.js.map