"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LexicalRichText_1 = require("./LexicalRichText");
function lexicalRichTextField(props) {
    const { name, label } = props;
    return {
        name: name ? name : 'richText',
        type: 'richText',
        label: label ? label : 'Rich Text',
        hooks: {
            afterRead: [
                LexicalRichText_1.populateLexicalRelationships
            ]
        },
        admin: {
            components: {
                Field: LexicalRichText_1.LexicalRichTextField,
                Cell: LexicalRichText_1.LexicalRichTextCell
            }
        }
    };
}
exports.default = lexicalRichTextField;
