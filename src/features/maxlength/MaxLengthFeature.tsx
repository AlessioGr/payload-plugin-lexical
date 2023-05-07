import * as React from 'react';

import { MaxLengthPlugin } from './plugins';
import { type Feature } from '../../types';

export function MaxLengthFeature(props: { enabled: boolean; maxLength: number }): Feature {
  return {
    plugins: [
      {
        component: props.enabled ? (
          <MaxLengthPlugin key="maxlength" maxLength={props.maxLength} />
        ) : (
          <></>
        ),
      },
    ],
  };
}
