import * as React from "react";
import { Feature } from '../../../types';
import PasteLogPlugin from './plugins';


export function PasteLogFeature(props: {enabled: boolean}): Feature {

    const {enabled = false} = props;
    

    return {
        plugins: [
            {
                component: enabled && (<PasteLogPlugin key="pastelog" />),
                position: "outside"
            }
        ],
      
    }
}