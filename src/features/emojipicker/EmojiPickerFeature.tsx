import { Feature } from '../../types';
import * as React from "react";
import EmojiPickerPlugin from './plugins';


export function EmojiPickerFeature(props: {}): Feature {
    return {
        plugins: [
            {
                component: (<EmojiPickerPlugin key="emojipicker" />),
            }
        ],
        subEditorPlugins: [
            (<EmojiPickerPlugin key="emojipicker" />),
        ],
      
    }
}