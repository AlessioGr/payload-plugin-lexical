/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import { createContext, type ReactNode, useContext, useMemo } from 'react';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { SharedAutocompleteContext } from './context/SharedAutocompleteContext';
import { SharedHistoryContext } from './context/SharedHistoryContext';
import { Editor } from './Editor';
import { EditorConfigProvider } from './EditorConfigProvider';
import PlaygroundNodes from './nodes/PlaygroundNodes';
import { CommentsContext } from './plugins/CommentPlugin';
import { TableContext } from './plugins/TablePlugin';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';
import { type OnChangeProps } from './types';
import { type EditorConfig } from '../../types';
import { defaultEditorConfig } from '../../types';

export const EditorProviders: React.FC<OnChangeProps> = (props) => {
  const { onChange, initialJSON, editorConfig, initialComments, value, setValue } = props;

  const initialConfig = {
    editorState: initialJSON != null ? JSON.stringify(initialJSON) : undefined,
    namespace: 'Playground',
    nodes: [...PlaygroundNodes(editorConfig)],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <EditorConfigProvider editorConfig={editorConfig}>
        <SharedHistoryContext>
          <TableContext>
            <SharedAutocompleteContext>
              <CommentsContext initialComments={initialComments}>
                <div className="editor-shell">
                  <Editor
                    onChange={onChange}
                    initialJSON={initialJSON}
                    editorConfig={editorConfig}
                    initialComments={initialComments}
                    value={value}
                    setValue={setValue}
                  />
                </div>
                {editorConfig.features.map((feature) => {
                  if (feature.plugins != null && feature.plugins.length > 0) {
                    return feature.plugins.map((plugin) => {
                      if (plugin.position === 'outside') {
                        return plugin.component;
                      } else {
                        return null;
                      }
                    });
                  } else {
                    return null;
                  }
                })}
              </CommentsContext>
            </SharedAutocompleteContext>
          </TableContext>
        </SharedHistoryContext>
      </EditorConfigProvider>
    </LexicalComposer>
  );
};
