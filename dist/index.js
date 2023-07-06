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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
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
exports.OPEN_MODAL_COMMAND = exports.lexicalRichTextField = exports.LexicalPlugin = void 0;
const openai_1 = require("openai");
const LexicalPlugin = (pluginOptions) => (config) => {
    var _a;
    if (!config.endpoints) {
        config.endpoints = [];
    }
    if ((_a = pluginOptions === null || pluginOptions === void 0 ? void 0 : pluginOptions.ai) === null || _a === void 0 ? void 0 : _a.openai_key) {
        const configuration = new openai_1.Configuration({
            apiKey: pluginOptions.ai.openai_key,
        });
        const openai = new openai_1.OpenAIApi(configuration);
        config.endpoints.push({
            path: '/openai-completion',
            method: 'get',
            handler: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const match = (yield openai.createChatCompletion({
                        model: 'gpt-3.5-turbo',
                        messages: [
                            {
                                role: 'system',
                                content: 'You only complete the provided text - in any language.',
                            },
                            {
                                role: 'user',
                                content: `Complete this sentence. Even if you cannot understand it, try to answer with what's most likely to come next. Do not use any placeholders and write like the author would write - no matter what language it is: ${req.query.text}`,
                            },
                        ],
                    })).data.choices[0].message.content;
                    if (match) {
                        res.status(200).send({ match });
                    }
                    else {
                        res.status(404).send({ error: 'not found' });
                    }
                }
                catch (e) {
                    console.log(e);
                    res.status(500).send({ error: 'error' });
                }
            }),
        });
    }
    return config;
};
exports.LexicalPlugin = LexicalPlugin;
var lexicalRichTextField_1 = require("./fields/lexicalRichTextField");
Object.defineProperty(exports, "lexicalRichTextField", { enumerable: true, get: function () { return lexicalRichTextField_1.lexicalRichTextField; } });
__exportStar(require("./features/index"), exports);
__exportStar(require("./types"), exports);
var index_1 = require("./fields/LexicalRichText/plugins/ModalPlugin/index");
Object.defineProperty(exports, "OPEN_MODAL_COMMAND", { enumerable: true, get: function () { return index_1.OPEN_MODAL_COMMAND; } });
__exportStar(require("./fields/LexicalRichText/ui/DropDown"), exports);
__exportStar(require("./fields/LexicalRichText/LexicalEditorComponent"), exports);
__exportStar(require("./fields/LexicalRichText/nodes/PlaygroundNodes"), exports);
__exportStar(require("./fields/LexicalRichText/themes/PlaygroundEditorTheme"), exports);
//# sourceMappingURL=index.js.map