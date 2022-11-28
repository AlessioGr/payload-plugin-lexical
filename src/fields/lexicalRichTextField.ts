import {Field, FieldHook} from 'payload/types';
import {LexicalRichTextFieldComponent, LexicalRichTextCell, traverseLexicalField, populateLexicalRelationships2} from './LexicalRichText'
import {SerializedEditorState} from "lexical";
import {EditorConfig} from "../types";

type LexicalRichTextFieldAfterReadFieldHook = FieldHook<any, SerializedEditorState, any>;

//I cannot put this in LexicalRichText/index as that causes an error => https://github.com/payloadcms/payload/issues/1518
const populateLexicalRelationships: LexicalRichTextFieldAfterReadFieldHook = async ({value, req}): Promise<SerializedEditorState> =>  {
        if(value.root.children){
            const newChildren = [];
            for(let childNode of value.root.children){
                newChildren.push(await traverseLexicalField(childNode, ""));
            }
            value.root.children = newChildren;
        }

        return value;
};



function lexicalRichTextField(props: {name?: string, label?: string, editorConfigModifier?: (defaultEditorConfig: EditorConfig) => EditorConfig   }): Field {
    const {name, label, editorConfigModifier} = props;

    const defaultEditorConfig: EditorConfig = {
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
    }

    const finalEditorConfig: EditorConfig = !editorConfigModifier ? defaultEditorConfig : editorConfigModifier(defaultEditorConfig);

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
                Field: (args) => LexicalRichTextFieldComponent({ ...args, editorConfig: finalEditorConfig }),
                Cell: LexicalRichTextCell
            }
        }
    }
}

export default lexicalRichTextField;
