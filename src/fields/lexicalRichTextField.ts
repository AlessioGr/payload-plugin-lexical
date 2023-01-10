import {Field, FieldHook} from 'payload/types';
import {LexicalRichTextFieldComponent, LexicalRichTextCell, traverseLexicalField, populateLexicalRelationships2, getJsonContentFromValue} from './LexicalRichText'
import {SerializedEditorState} from "lexical";
import {EditorConfig} from "../types";

type LexicalRichTextFieldAfterReadFieldHook = FieldHook<any, {jsonContent: SerializedEditorState, preview: string, characters: number, words: number}, any>;

//I cannot put this in LexicalRichText/index as that causes an error => https://github.com/payloadcms/payload/issues/1518
const populateLexicalRelationships: LexicalRichTextFieldAfterReadFieldHook = async ({value, req}): Promise<{jsonContent: SerializedEditorState, preview: string, characters: number, words: number}> =>  {
    if(!value) {
        return value;
    }
    const jsonContent = getJsonContentFromValue(value);
    if(jsonContent && jsonContent.root && jsonContent.root.children){
        const newChildren = [];
        for(let childNode of jsonContent.root.children){
            newChildren.push(await traverseLexicalField(childNode, ""));
        }
        jsonContent.root.children = newChildren;
     }
     value.jsonContent = {...jsonContent};

    return value;
};



function lexicalRichTextField(props: {name?: string, label?: string, localized?: boolean, editorConfigModifier?: (defaultEditorConfig: EditorConfig) => EditorConfig   }): Field {
    const {name, label, localized, editorConfigModifier} = props;

    const defaultEditorConfig: EditorConfig = {
        debug: true,
        simpleNodes: [],
        features: {
            comments: {
                enabled: true,
            },
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
        },
        extraPlugins: [],
        extraNodes: [],
        extraModals: [],
        extraToolbarElements: {
            insert: [],
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
