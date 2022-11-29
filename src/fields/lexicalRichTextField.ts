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



function lexicalRichTextField(props: {name?: string, label?: string, localized?: boolean, editorConfigModifier?: (defaultEditorConfig: EditorConfig) => EditorConfig   }): Field {
    const {name, label, localized, editorConfigModifier} = props;

    const defaultEditorConfig: EditorConfig = {
        debug: true,
        nodes: [],
        features: {
            tables: {
                enabled: true,
                display: false
            },
            upload: {
                enabled: true,
                display: true
            },
            twitter: {
                enabled: true,
                display: true
            },
            youtube: {
                enabled: true,
                display: true
            },
            figma: {
                enabled: true,
                display: true
            },
            horizontalRule: {
                enabled: true,
                display: true
            },
            equations: {
                enabled: true,
                display: true
            },
            collapsible: {
                enabled: true,
                display: true
            },
            fontSize: {
                enabled: true,
                display: true
            },
            font: {
                enabled: true,
                display: true
            },
            textColor: {
                enabled: true,
                display: true
            },
            textBackground: {
                enabled: true,
                display: true
            },
            mentions: {
                enabled: false,
                display: false
            },
            align: {
                enabled: true,
                display: true
            },
        }
    }

    const finalEditorConfig: EditorConfig = !editorConfigModifier ? defaultEditorConfig : editorConfigModifier(defaultEditorConfig);

    return {
        name: name ? name : 'richText',
        type: 'richText',
        label: label ? label : 'Rich Text',
        localized: localized,
        hooks: {
            afterRead: [
                populateLexicalRelationships,
            ],
        },
        admin: {
            components: {
                Field: (args) => LexicalRichTextFieldComponent({ ...args, editorConfig: finalEditorConfig }),
                Cell: (args) => LexicalRichTextCell({ ...args, editorConfig: finalEditorConfig }),
            }
        }
    }
}

export default lexicalRichTextField;
