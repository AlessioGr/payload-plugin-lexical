import * as React from 'react';

import TestRecorderPlugin from './plugins';
import { type Feature } from '../../../types';

export function TestRecorderFeature(props: { enabled: boolean }): Feature {
  const { enabled = false } = props;

  return {
    plugins: [
      {
        component: enabled ? <TestRecorderPlugin key="testrecorder" /> : <></>,
        position: 'outside',
      },
    ],
  };
}
