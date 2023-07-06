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
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTubeFeature = void 0;
const React = __importStar(require("react"));
const AutoEmbedPlugin_1 = require("../../../fields/LexicalRichText/plugins/AutoEmbedPlugin");
const plugins_1 = __importStar(require("./plugins"));
const YouTubeNode_1 = require("./nodes/YouTubeNode");
const Drawer_1 = require("payload/dist/admin/components/elements/Drawer");
function YouTubeFeature(props) {
    const YoutubeEmbedConfig = {
        contentName: 'Youtube Video',
        exampleUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
        // Icon for display.
        icon: React.createElement("i", { className: "icon youtube" }),
        insertNode: (editor, result) => {
            editor.dispatchCommand(plugins_1.INSERT_YOUTUBE_COMMAND, result.id);
        },
        keywords: ['youtube', 'video'],
        // Determine if a given URL is a match and return url data.
        parseUrl: (url) => __awaiter(this, void 0, void 0, function* () {
            const match = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/.exec(url);
            const id = match ? ((match === null || match === void 0 ? void 0 : match[2].length) === 11 ? match[2] : null) : null;
            if (id != null) {
                return {
                    id,
                    url,
                };
            }
            return null;
        }),
        type: 'youtube-video',
    };
    return {
        plugins: [
            {
                component: React.createElement(plugins_1.default, { key: "youtube" }),
            },
        ],
        nodes: [YouTubeNode_1.YouTubeNode],
        embedConfigs: [YoutubeEmbedConfig],
        modals: [
            {
                modal: (props) => (0, AutoEmbedPlugin_1.AutoEmbedDrawer)({ embedConfig: YoutubeEmbedConfig }),
                openModalCommand: {
                    type: 'autoembed-' + YoutubeEmbedConfig.type,
                    command: (toggleModal, editDepth, uuid) => {
                        const autoEmbedDrawerSlug = (0, Drawer_1.formatDrawerSlug)({
                            slug: `lexicalRichText-autoembed-` + YoutubeEmbedConfig.type + uuid,
                            depth: editDepth,
                        });
                        toggleModal(autoEmbedDrawerSlug);
                    },
                },
            },
        ],
    };
}
exports.YouTubeFeature = YouTubeFeature;
//# sourceMappingURL=YouTubeFeature.js.map