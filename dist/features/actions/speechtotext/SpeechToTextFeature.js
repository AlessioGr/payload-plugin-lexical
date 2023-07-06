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
exports.SpeechToTextFeature = void 0;
const plugins_1 = __importStar(require("./plugins"));
const React = __importStar(require("react"));
const react_1 = require("react");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
function SpeechToTextAction() {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [isSpeechToText, setIsSpeechToText] = (0, react_1.useState)(false);
    return (React.createElement(React.Fragment, null, (0, plugins_1.isSUPPORT_SPEECH_RECOGNITION)() && (React.createElement("button", { onClick: (event) => {
            event.preventDefault();
            editor.dispatchCommand(plugins_1.SPEECH_TO_TEXT_COMMAND, !isSpeechToText);
            setIsSpeechToText(!isSpeechToText);
        }, className: `action-button action-button-mic ${isSpeechToText ? 'active' : ''}`, title: "Speech To Text", "aria-label": `${isSpeechToText ? 'Enable' : 'Disable'} speech to text` },
        React.createElement("i", { className: "mic" })))));
}
function SpeechToTextFeature(props) {
    return {
        plugins: [
            {
                component: React.createElement(plugins_1.default, { key: "speechtotext" }),
            },
        ],
        actions: [React.createElement(SpeechToTextAction, { key: "speechtotext" })],
    };
}
exports.SpeechToTextFeature = SpeechToTextFeature;
//# sourceMappingURL=SpeechToTextFeature.js.map