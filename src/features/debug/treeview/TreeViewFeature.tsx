import * as React from "react";
import { Feature } from '../../../types';
import TreeViewPlugin from './plugins';


export function TreeViewFeature(props: {enabled: boolean}): Feature {

    const {enabled = false} = props;
    

    return {
        plugins: [
            {
                component: enabled && (<TreeViewPlugin key="treeview" />),
                position: "bottom"
            }
        ],
      
    }
}