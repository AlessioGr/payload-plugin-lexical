# Payload Lexical Plugin

A plugin for [Payload CMS](https://github.com/payloadcms/payload) whichs adds a [lexical](https://lexical.dev/)-based richtext editor.

![203127349-2be29de4-aff3-4e13-9ebe-56be5fc3fc97 (1)](https://user-images.githubusercontent.com/70709113/204068103-a09f39e1-14e4-45fc-868a-68558380b74e.png)
![203127640-caa1f279-1555-48e6-9465-8c441ea65149](https://user-images.githubusercontent.com/70709113/204068104-8dcf337a-b18e-47b8-8ba3-3e777a1f834c.png)


MINIMUM REQUIRED PAYLOAD VERSION: 1.4.0

Important: I currently do not shy away from breaking things in this plugin at this stage. So, please be careful when you update this plugin.

## How to use - example collection

1. Add the files inside of the src folder of this repo manually into your payload project. NPM building is currently broken, feel free to help fix it! Until then, just copy the plugin into your payload folder instead of installing it via npm.

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

## Example: with more customization and own, custom node:
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
            label: 'cool richtext editor',
            localized: true,
            editorConfigModifier: defaultEditorConfig => {
                defaultEditorConfig.debug = false;
                defaultEditorConfig.featuresold.textColor.enabled = false;
                defaultEditorConfig.featuresold.textBackground.enabled = false;
                defaultEditorConfig.featuresold.figma.enabled = false;
                defaultEditorConfig.featuresold.fontSize.enabled = false;
                defaultEditorConfig.featuresold.font.enabled = false;
                defaultEditorConfig.featuresold.align.enabled = false;
                
                // A feature can consist of nodes, plugins, modals, toolbar elements and more!
                defaultEditorConfig.features.push(YourOwnCustomFeature({}))


                return defaultEditorConfig;
            }
        })
    ]
}

export default Lexical;

```

## Serializing

Feel free to use my serializer in the [serialize-example](https://github.com/AlessioGr/payload-plugin-lexical/tree/master/serialize-example) folder of this repo. Lexical is using bitwise operations for the node formats.

This currently serialized the most important stuff, but not everything. Feel free to contribute to it if you add more!

## Idea list:

- [x] Update slash commands to reflect the toolbar
- [x] Add wordcount, charactercount & preview to the json output
- [x] Commenting functionality
- [x] Upload plugin/node captions
- [ ] Ability to add custom fields to uploads like captions
- [ ] (relationship node?)
- [ ] Fix internal collection search for internal link editor
- [ ] Edit Upload Button
- [ ] Improve design & UX of links. For example, clicking on the link button should open the link drawer immediately
- [ ] lazy loading lexical editor to reduce load times. or maybe just the images?
- [ ] New format/node: "highlight"/"mark"
- [ ] Increase customizability & DX. Plugins should all be set in the config. Slash commands & Toolbar items should come from the same place.
- [ ] Add ExcaliDraw
- [ ] Take a closer look at AutoLink. Is it necessary and what does it do?
- [ ] Make extranodes, extraplugins ... config options hold the ENTIRE nodes, and rename to just "nodes" and "plugins". Makes it easier to remove them and start from scratch, or to insert one at a special position, instead of just pushing it to the end. Especially useful for the Toolbar plugin.
- [ ] extraFloatingToolbarElements

## Updating lexical

Since this is based on their playground, you gotta upstream their changes. Then, the following is additionally copied over outside of the playground package - needs to be considered in lexical updates as well:

- https://github.com/facebook/lexical/blob/main/packages/lexical-react/src/LexicalOnChangePlugin.ts
- https://github.com/facebook/lexical/blob/main/packages/lexical-react/src/LexicalLinkPlugin.ts
- https://github.com/facebook/lexical/blob/main/packages/lexical-react/src/LexicalAutoLinkPlugin.ts
- https://github.com/facebook/lexical/tree/main/packages/shared
- https://github.com/facebook/lexical/blob/main/packages/lexical-link/src/index.ts
