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
const React = __importStar(require("react"));
const react_1 = require("react");
const Config_1 = require("payload/dist/admin/components/utilities/Config");
const react_i18next_1 = require("react-i18next");
const api_1 = require("payload/dist/admin/api");
const ImageComponent = React.lazy(() => Promise.resolve().then(() => __importStar(require('./ImageComponent'))));
function RawImageComponent({ rawImagePayload, nodeKey, extraAttributes, showCaption, caption, captionsEnabled, }) {
    const { collections, serverURL, routes: { api }, } = (0, Config_1.useConfig)();
    const { i18n } = (0, react_i18next_1.useTranslation)();
    const [imageData, setImageData] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        function loadImageData() {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                const relatedCollection = collections.find((coll) => {
                    return coll.slug === rawImagePayload.relationTo;
                });
                const response = yield api_1.requests.get(`${serverURL}${api}/${relatedCollection === null || relatedCollection === void 0 ? void 0 : relatedCollection.slug}/${(_a = rawImagePayload.value) === null || _a === void 0 ? void 0 : _a.id}`, {
                    headers: {
                        'Accept-Language': i18n.language,
                    },
                });
                const json = yield response.json();
                const imagePayload = {
                    altText: json === null || json === void 0 ? void 0 : json.text,
                    height: extraAttributes && extraAttributes.heightOverride
                        ? extraAttributes.heightOverride
                        : json === null || json === void 0 ? void 0 : json.height,
                    maxWidth: extraAttributes && extraAttributes.widthOverride
                        ? extraAttributes.widthOverride
                        : json === null || json === void 0 ? void 0 : json.width,
                    src: json === null || json === void 0 ? void 0 : json.url,
                };
                setImageData(imagePayload);
            });
        }
        loadImageData();
    }, []);
    return (React.createElement(react_1.Suspense, { fallback: React.createElement("p", null, "Loading image...") }, imageData ? (React.createElement(ImageComponent, { src: imageData.src, altText: imageData.altText, width: undefined, height: imageData.height, maxWidth: imageData.maxWidth, nodeKey: nodeKey, showCaption: showCaption, caption: caption, captionsEnabled: captionsEnabled, resizable: true })) : (React.createElement("p", null, "Loading image..."))));
}
exports.default = RawImageComponent;
//# sourceMappingURL=RawImageComponent.js.map