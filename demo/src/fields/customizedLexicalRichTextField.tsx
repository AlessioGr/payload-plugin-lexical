import { Field } from 'payload/types';
import blocksuiteField from '../../../src/fields/blocksuiteField'




function lexicalRichText(props?: { name?: string, label?: string, debug?: boolean }): Field {
    return blocksuiteField({
        name: props?.name ? props?.name : 'blocksuite',
        label: props?.label ? props?.label : 'Rich Text',
        localized: true,
    })
}


export default lexicalRichText;
