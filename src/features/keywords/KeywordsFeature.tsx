import { Feature } from '../../types';
import * as React from "react";
import { KeywordNode } from './nodes/KeywordNode';
import KeywordsPlugin from './plugins';


export function KeywordsFeature(props: {}): Feature {
    return {
        plugins: [
            {
                component: (<KeywordsPlugin key="keywords" />),
            }
        ],
        subEditorPlugins: [
            <KeywordsPlugin key="keywords" />
        ],
        nodes: [
            KeywordNode
        ],
        tableCellNodes: [
            KeywordNode
        ]
      
    }
}