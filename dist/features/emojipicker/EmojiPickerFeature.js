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
exports.EmojiPickerFeature = void 0;
const React = __importStar(require("react"));
const lexical_1 = require("lexical");
const plugins_1 = __importDefault(require("./plugins"));
const emoji_list_1 = __importDefault(require("./plugins/emoji-list"));
function EmojiPickerFeature(props) {
    const emojiMarkdownTextMatchTransformer = {
        dependencies: [],
        export: () => null,
        importRegExp: /:([a-z0-9_]+):/,
        regExp: /:([a-z0-9_]+):/,
        replace: (textNode, [, name]) => {
            var _a;
            const emoji = (_a = emoji_list_1.default.find((e) => e.aliases.includes(name))) === null || _a === void 0 ? void 0 : _a.emoji;
            if (emoji) {
                textNode.replace((0, lexical_1.$createTextNode)(emoji));
            }
        },
        trigger: ':',
        type: 'text-match',
    };
    return {
        plugins: [
            {
                component: React.createElement(plugins_1.default, { key: "emojipicker" }),
            },
        ],
        subEditorPlugins: [React.createElement(plugins_1.default, { key: "emojipicker" })],
        markdownTransformers: [emojiMarkdownTextMatchTransformer],
    };
}
exports.EmojiPickerFeature = EmojiPickerFeature;
//# sourceMappingURL=EmojiPickerFeature.js.map