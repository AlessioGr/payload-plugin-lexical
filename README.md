# Payload Lexical Plugin

A plugin for [Payload CMS](https://github.com/payloadcms/payload) to add a lexical-based editor.

![203127349-2be29de4-aff3-4e13-9ebe-56be5fc3fc97 (1)](https://user-images.githubusercontent.com/70709113/204068103-a09f39e1-14e4-45fc-868a-68558380b74e.png)
![203127640-caa1f279-1555-48e6-9465-8c441ea65149](https://user-images.githubusercontent.com/70709113/204068104-8dcf337a-b18e-47b8-8ba3-3e777a1f834c.png)


MINIMUM REQUIRED PAYLOAD VERSION: 1.2.1

## How to use - example collection

1. Add the src files manually into your payload project. NPM building is currently broken, feel free to help fix it! Until then, just copy the plugin into your payload folder instead of installing it via npm.

2. :
```ts
import { CollectionConfig } from 'payload/types';
import lexicalRichTextField from '../folder-where-you-copied-this-plugin-in/fields/lexicalRichTextField'

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
