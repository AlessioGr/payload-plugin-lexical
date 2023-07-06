"use strict";
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
exports.traverseLexicalField = exports.populateLexicalRelationships = void 0;
const PayloadLexicalRichTextFieldComponent_1 = require("./LexicalRichText/PayloadLexicalRichTextFieldComponent");
const populateLexicalRelationships = ({ value, req, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { payload } = req;
    if (!value) {
        return value;
    }
    const jsonContent = (0, PayloadLexicalRichTextFieldComponent_1.getJsonContentFromValue)(value);
    if (jsonContent && jsonContent.root && jsonContent.root.children) {
        const newChildren = [];
        for (const childNode of jsonContent.root.children) {
            newChildren.push(yield traverseLexicalField(payload, childNode, ''));
        }
        jsonContent.root.children = newChildren;
    }
    value.jsonContent = Object.assign({}, jsonContent);
    return value;
});
exports.populateLexicalRelationships = populateLexicalRelationships;
function loadUploadData(payload, rawImagePayload, locale) {
    return __awaiter(this, void 0, void 0, function* () {
        let uploadData;
        try {
            uploadData = yield payload.findByID({
                collection: rawImagePayload.relationTo,
                id: rawImagePayload.value.id,
                depth: 2,
                locale,
            });
        }
        catch (e) {
            console.warn(e);
            return null;
        }
        return uploadData;
    });
}
function loadInternalLinkDocData(payload, value, relationTo, locale) {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: Adjustable depth
        const foundDoc = yield payload.findByID({
            collection: relationTo,
            id: value,
            depth: 2,
            locale,
        });
        return foundDoc;
    });
}
function traverseLexicalField(payload, node, locale) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        // Find replacements
        if (node.type === 'upload') {
            const { rawImagePayload } = node;
            // const extraAttributes: ExtraAttributes = node["extraAttributes"];
            const uploadData = yield loadUploadData(payload, rawImagePayload, locale);
            if (uploadData) {
                node.data = uploadData;
            }
        }
        else if (node.type === 'link'
            && ((_a = node.attributes) === null || _a === void 0 ? void 0 : _a.linkType)
            && ((_b = node.attributes) === null || _b === void 0 ? void 0 : _b.linkType) === 'internal') {
            const { attributes } = node;
            const foundDoc = yield loadInternalLinkDocData(payload, attributes.doc.value, attributes.doc.relationTo, locale);
            if (foundDoc) {
                node.attributes.doc.data = foundDoc;
            }
        }
        // Run for its children
        if (node.children && node.children.length > 0) {
            const newChildren = [];
            for (const childNode of node.children) {
                newChildren.push(yield traverseLexicalField(payload, childNode, locale));
            }
            node.children = newChildren;
        }
        return node;
    });
}
exports.traverseLexicalField = traverseLexicalField;
//# sourceMappingURL=LexicalAfterReadHook.js.map