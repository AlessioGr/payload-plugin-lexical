/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import * as React from 'react';
import { createContext, ReactNode, useContext, useMemo } from 'react';
import { EditorConfig } from '../../types';

import { SharedAutocompleteContext } from './context/SharedAutocompleteContext';
import { SharedHistoryContext } from './context/SharedHistoryContext';
import { Editor } from './LexicalRichText';
import PlaygroundNodes from './nodes/PlaygroundNodes';
import { CommentsContext } from './plugins/CommentPlugin';
import { TableContext } from './plugins/TablePlugin';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';
import { OnChangeProps } from './types';
import './index.scss';

const LexicalEditor: React.FC<OnChangeProps> = (props) => {
  const {
    onChange,
    initialJSON,
    editorConfig,
    initialComments,
    value,
    setValue,
  } = props;

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
      <EditorConfigContext editorConfig={editorConfig}>
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
                  if (feature.plugins && feature.plugins.length > 0) {
                    return feature.plugins.map((plugin) => {
                      if (plugin.position === 'outside') {
                        return plugin.component;
                      }
                    });
                  }
                })}
              </CommentsContext>
            </SharedAutocompleteContext>
          </TableContext>
        </SharedHistoryContext>
      </EditorConfigContext>
    </LexicalComposer>
  );
};

export const LexicalEditorComponent: React.FC<OnChangeProps> = (props) => {
  const {
    onChange,
    initialJSON,
    editorConfig,
    initialComments,
    value,
    setValue,
  } = props;

  return (
    //<SettingsContext>
    <LexicalEditor
      onChange={onChange}
      initialJSON={initialJSON}
      editorConfig={editorConfig}
      initialComments={initialComments}
      value={value}
      setValue={setValue}
    />
    //</SettingsContext>
  );
};

type ContextShape = {
  editorConfig?: EditorConfig;
  uuid?: string;
};

const Context: React.Context<ContextShape> = createContext({});
function generateQuickGuid() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
export const EditorConfigContext = ({
  children,
  editorConfig,
}: {
  children: ReactNode;
  editorConfig: EditorConfig;
}): JSX.Element => {
  const [editor] = useLexicalComposerContext();

  let editorContextShape: ContextShape;

  if (!editorConfig) {
    throw new Error('editorConfig is required');
  } else {
    let uuid = (editorContextShape = useMemo(
      () => ({ editorConfig: editorConfig, uuid: '' + generateQuickGuid() }),
      [editor],
    ));
  }

  return (
    <Context.Provider value={editorContextShape}>{children}</Context.Provider>
  );
};

export const useEditorConfigContext = (): ContextShape => {
  return useContext(Context);
};
