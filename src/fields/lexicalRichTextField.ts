import { Field } from 'payload/types';
import {LexicalRichTextField, LexicalRichTextCell, populateLexicalRelationships} from './LexicalRichText'

function lexicalRichTextField(props: {name?: string, label?: string}): Field {
    const {name, label} = props;
    return {
        name: name ? name : 'richText',
        type: 'richText',
        label: label ? label : 'Rich Text',
        hooks: {
            afterRead: [
                populateLexicalRelationships
            ]
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
