import { Feature } from '../../types';
import { MaxLengthPlugin } from './plugins';
import * as React from 'react';

export function MaxLengthFeature(props: {
  enabled: boolean;
  maxLength: number;
}): Feature {
  return {
    plugins: [
      {
        component: props.enabled && (
          <MaxLengthPlugin key="maxlength" maxLength={props.maxLength} />
        ),
      },
    ],
  };
}
