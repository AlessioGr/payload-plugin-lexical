import { Feature } from '../../types';
import * as React from 'react';
import TableOfContentsPlugin from './plugins';

export function TableOfContentsFeature(props: { enabled: boolean }): Feature {
  const { enabled = false } = props;

  return {
    plugins: [
      {
        component: enabled && (
          <div key="tableofcontents">
            <TableOfContentsPlugin />
          </div>
        ),
        position: 'bottomInContainer',
      },
    ],
  };
}
