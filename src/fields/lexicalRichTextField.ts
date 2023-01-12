import {Field} from 'payload/types';
import {LexicalRichTextFieldComponent, LexicalRichTextCell } from './LexicalRichText'
import {EditorConfig} from "../types";
import { populateLexicalRelationships } from './LexicalAfterReadHook';




function lexicalRichTextField(props: {name?: string, label?: string, localized?: boolean, required?: boolean, editorConfigModifier?: (defaultEditorConfig: EditorConfig) => EditorConfig   }): Field {
    const {name, label, localized, required, editorConfigModifier} = props;

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
        required: required,
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
