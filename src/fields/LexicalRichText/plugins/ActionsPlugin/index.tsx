/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';

import { type EditorConfig } from '../../../../types';

export default function ActionsPlugin({
  isRichText,
  editorConfig,
}: {
  isRichText: boolean;
  editorConfig: EditorConfig;
}): JSX.Element {
  return (
    <div className="actions">
      {editorConfig.features.map((feature) => {
        if (feature?.actions != null && feature.actions.length > 0) {
          return feature.actions.map((action) => {
            return action;
          });
        }
        return null;
      })}
    </div>
  );
}
