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
exports.LexicalRichTextCell = exports.LexicalRichTextFieldComponent = void 0;
const react_1 = __importStar(require("react"));
const ShimmerEffect_1 = require("payload/dist/admin/components/elements/ShimmerEffect");
const LexicalRichTextFieldComponent2 = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./PayloadLexicalRichTextFieldComponent'))));
const LexicalRichTextFieldComponent = (props) => {
    return (react_1.default.createElement(react_1.Suspense, { fallback: react_1.default.createElement(ShimmerEffect_1.ShimmerEffect, { height: "35vh" }) },
        react_1.default.createElement(LexicalRichTextFieldComponent2, Object.assign({}, props))));
};
exports.LexicalRichTextFieldComponent = LexicalRichTextFieldComponent;
const LexicalRichTextCell = (props) => {
    const { cellData } = props;
    const data = cellData;
    if (!data) {
        return react_1.default.createElement("span", null);
    }
    return react_1.default.createElement("span", null, data.preview);
};
exports.LexicalRichTextCell = LexicalRichTextCell;
//# sourceMappingURL=index.js.map