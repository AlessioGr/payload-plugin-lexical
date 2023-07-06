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
exports.TwitterFeature = void 0;
const React = __importStar(require("react"));
const AutoEmbedPlugin_1 = require("../../../fields/LexicalRichText/plugins/AutoEmbedPlugin");
const TweetNode_1 = require("./nodes/TweetNode");
const plugins_1 = __importStar(require("./plugins"));
const Drawer_1 = require("payload/dist/admin/components/elements/Drawer");
function TwitterFeature(props) {
    const TwitterEmbedConfig = {
        // e.g. Tweet or Google Map.
        contentName: 'Tweet',
        exampleUrl: 'https://twitter.com/jack/status/20',
        // Icon for display.
        icon: React.createElement("i", { className: "icon tweet" }),
        // Create the Lexical embed node from the url data.
        insertNode: (editor, result) => {
            editor.dispatchCommand(plugins_1.INSERT_TWEET_COMMAND, result.id);
        },
        // For extra searching.
        keywords: ['tweet', 'twitter'],
        // Determine if a given URL is a match and return url data.
        parseUrl: (text) => {
            const match = /^https:\/\/twitter\.com\/(#!\/)?(\w+)\/status(es)*\/(\d+)$/.exec(text);
            if (match != null) {
                return {
                    id: match[4],
                    url: match[0],
                };
            }
            return null;
        },
        type: 'tweet',
    };
    const tweetMarkdownElementTransformer = {
        dependencies: [TweetNode_1.TweetNode],
        export: (node) => {
            if (!(0, TweetNode_1.$isTweetNode)(node)) {
                return null;
            }
            return `<tweet id="${node.getId()}" />`;
        },
        regExp: /<tweet id="([^"]+?)"\s?\/>\s?$/,
        replace: (textNode, _1, match) => {
            const [, id] = match;
            const tweetNode = (0, TweetNode_1.$createTweetNode)(id);
            textNode.replace(tweetNode);
        },
        type: 'element',
    };
    return {
        plugins: [
            {
                component: React.createElement(plugins_1.default, { key: "twitter" }),
            },
        ],
        nodes: [TweetNode_1.TweetNode],
        embedConfigs: [TwitterEmbedConfig],
        markdownTransformers: [tweetMarkdownElementTransformer],
        modals: [
            {
                modal: (props) => (0, AutoEmbedPlugin_1.AutoEmbedDrawer)({ embedConfig: TwitterEmbedConfig }),
                openModalCommand: {
                    type: 'autoembed-' + TwitterEmbedConfig.type,
                    command: (toggleModal, editDepth, uuid) => {
                        const autoEmbedDrawerSlug = (0, Drawer_1.formatDrawerSlug)({
                            slug: `lexicalRichText-autoembed-` + TwitterEmbedConfig.type + uuid,
                            depth: editDepth,
                        });
                        toggleModal(autoEmbedDrawerSlug);
                    },
                },
            },
        ],
    };
}
exports.TwitterFeature = TwitterFeature;
//# sourceMappingURL=TwitterFeature.js.map