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
const LexicalRichText_1 = require("./LexicalRichText");
//I cannot put this in LexicalRichText/index as that causes an error => https://github.com/payloadcms/payload/issues/1518
const populateLexicalRelationships = ({ value, req }) => __awaiter(void 0, void 0, void 0, function* () {
    if (value.root.children) {
        const newChildren = [];
        for (let childNode of value.root.children) {
            newChildren.push(yield (0, LexicalRichText_1.traverseLexicalField)(childNode, ""));
        }
        value.root.children = newChildren;
    }
    return value;
});
function lexicalRichTextField(props) {
    const { name, label, editorConfigModifier } = props;
    const defaultEditorConfig = {
        features: {
            tables: {
                enabled: false
            },
            upload: {
                enabled: true
            },
            twitter: {
                enabled: true
            },
            youtube: {
                enabled: true
            },
            figma: {
                enabled: true
            },
            horizontalRule: {
                enabled: true
            },
            equations: {
                enabled: true
            },
            collapsible: {
                enabled: true
            },
            fontSize: {
                enabled: true
            },
            font: {
                enabled: true
            },
            textColor: {
                enabled: true
            },
            textBackground: {
                enabled: true
            },
        }
    };
    const finalEditorConfig = !editorConfigModifier ? defaultEditorConfig : editorConfigModifier(defaultEditorConfig);
    return {
        name: name ? name : 'richText',
        type: 'richText',
        label: label ? label : 'Rich Text',
        hooks: {
            afterRead: [
                populateLexicalRelationships,
            ],
        },
        admin: {
            components: {
                Field: (args) => (0, LexicalRichText_1.LexicalRichTextFieldComponent)(Object.assign(Object.assign({}, args), { editorConfig: finalEditorConfig })),
                Cell: LexicalRichText_1.LexicalRichTextCell
            }
        }
    };
}
exports.default = lexicalRichTextField;
//# sourceMappingURL=lexicalRichTextField.js.map