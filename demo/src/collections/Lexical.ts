import { CollectionConfig } from 'payload/types';
import {lexicalRichTextField} from '../../../src/fields/lexicalRichTextField'
//import lexicalRichTextField from '../../../dist/fields/lexicalRichTextField'

const Lexical: CollectionConfig = {
  slug: 'lexicalRichText',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true
    },
    lexicalRichTextField({
      name: 'lexicalRichTextEditor',
      label: 'Lexical Rich Text Editor',
    })
  ]
}

export default Lexical;
