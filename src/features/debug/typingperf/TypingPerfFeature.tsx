import * as React from 'react';

import TypingPerfPlugin from './plugins';
import { type Feature } from '../../../types';

export function TypingPerfFeature(props: { enabled: boolean }): Feature {
  const { enabled = false } = props;

  return {
    plugins: [
      {
        component: enabled ? <TypingPerfPlugin key="typingperf" /> : <></>,
        position: 'outside',
      },
    ],
  };
}
