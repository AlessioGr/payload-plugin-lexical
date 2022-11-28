import {Field, FieldHook} from 'payload/types';
import {LexicalRichTextField, LexicalRichTextCell, traverseLexicalField} from './LexicalRichText'
import {SerializedEditorState} from "lexical";

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

function lexicalRichTextField(props: {name?: string, label?: string, plugins?}): Field {
    const {name, label, plugins} = props;
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
                Field: LexicalRichTextField,
                Cell: LexicalRichTextCell
            }
        }
    }
}

export default lexicalRichTextField;
