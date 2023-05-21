/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';

import { LexicalComposer } from '@lexical/react/LexicalComposer';

import { SharedAutocompleteContext } from './context/SharedAutocompleteContext';
import { SharedHistoryContext } from './context/SharedHistoryContext';
import { SharedOnChangeProvider } from './context/SharedOnChangeProvider';
import { Editor } from './Editor';
import { EditorConfigProvider } from './EditorConfigProvider';
import PlaygroundNodes from './nodes/PlaygroundNodes';
import { CommentsContext } from './plugins/CommentPlugin';
import { TableContext } from './plugins/TablePlugin';
import LexicalEditorTheme from './themes/LexicalEditorTheme';
import { type OnChangeProps } from './types';

export const EditorProviders: React.FC<OnChangeProps> = (props) => {
  const { onChange, initialJSON, editorConfig, initialComments, value, setValue } = props;

  const initialConfig = {
    editorState: initialJSON != null ? JSON.stringify(initialJSON) : undefined,
    namespace: 'Playground',
    nodes: [...PlaygroundNodes(editorConfig)],
    onError: (error: Error) => {
      throw error;
    },
    theme: LexicalEditorTheme,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <EditorConfigProvider editorConfig={editorConfig}>
        <SharedHistoryContext>
          <TableContext>
            <SharedAutocompleteContext>
              <SharedOnChangeProvider onChange={onChange}>
                <CommentsContext initialComments={initialComments}>
                  <div className="editor-shell">
                    <Editor
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
              </SharedOnChangeProvider>
            </SharedAutocompleteContext>
          </TableContext>
        </SharedHistoryContext>
      </EditorConfigProvider>
    </LexicalComposer>
  );
};
