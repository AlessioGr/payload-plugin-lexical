import * as React from "react";
import { Feature } from '../../../types';
import TypingPerfPlugin from './plugins';


export function TypingPerfFeature(props: {enabled: boolean}): Feature {

    const {enabled = false} = props;
    

    return {
        plugins: [
            {
                component: enabled && (<TypingPerfPlugin key="typingperf" />),
                position: "outside"
            }
        ],
      
    }
}