import { Feature } from '../../types';
import * as React from "react";
import EmojiPickerPlugin from './plugins';
import {TextMatchTransformer} from "@lexical/markdown";
import {$createTextNode} from "lexical";
import emojiList from "./plugins/emoji-list";


export function EmojiPickerFeature(props: {}): Feature {

    const emojiMarkdownTextMatchTransformer: TextMatchTransformer = {
        dependencies: [],
        export: () => null,
        importRegExp: /:([a-z0-9_]+):/,
        regExp: /:([a-z0-9_]+):/,
        replace: (textNode, [, name]) => {
            const emoji = emojiList.find((e) => e.aliases.includes(name))?.emoji;
            if (emoji) {
                textNode.replace($createTextNode(emoji));
            }
        },
        trigger: ':',
        type: 'text-match',
    };


    return {
        plugins: [
            {
                component: (<EmojiPickerPlugin key="emojipicker" />),
            }
        ],
        subEditorPlugins: [
            (<EmojiPickerPlugin key="emojipicker" />),
        ],
        markdownTransformers: [emojiMarkdownTextMatchTransformer],
    }
}
