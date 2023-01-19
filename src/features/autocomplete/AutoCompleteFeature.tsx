import { Feature } from '../../types';
import * as React from "react";
import AutocompletePlugin from './plugins';
import { AutocompleteNode } from './nodes/AutocompleteNode';


export function AutoCompleteFeature(props: {}): Feature {
    return {
        plugins: [
            {
                component: (<AutocompletePlugin key="autocomplete" />),
            }
        ],
        nodes: [
            AutocompleteNode
        ],
        tableCellNodes: [
            AutocompleteNode
        ]
      
    }
}