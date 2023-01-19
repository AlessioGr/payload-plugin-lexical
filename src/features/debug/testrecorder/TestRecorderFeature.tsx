import * as React from "react";
import { Feature } from '../../../types';
import TestRecorderPlugin from './plugins';


export function TestRecorderFeature(props: {enabled: boolean}): Feature {

    const {enabled = false} = props;
    

    return {
        plugins: [
            {
                component: enabled && (<TestRecorderPlugin key="testrecorder" />),
                position: "outside"
            }
        ],
      
    }
}