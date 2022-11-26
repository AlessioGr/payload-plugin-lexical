# Payload Lexical Plugin

[![NPM](https://img.shields.io/npm/v/payload-plugin-lexical)](https://www.npmjs.com/package/payload-plugin-lexical)

A plugin for [Payload CMS](https://github.com/payloadcms/payload) to add a lexical-based editor.

MINIMUM REQUIRED PAYLOAD VERSION: 1.2.1

This plugin is super-alpha.

## How to use - example collection

1. yarn add payload-plugin-lexical

2. :
```ts
import { CollectionConfig } from 'payload/types';
import lexicalRichTextField from 'payload-plugin-lexical/dist/fields/lexicalRichTextField'

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

```
