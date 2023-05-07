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
import { Editor } from './LexicalRichText';
import PlaygroundNodes from './nodes/PlaygroundNodes';
import { CommentsContext } from './plugins/CommentPlugin';
import { TableContext } from './plugins/TablePlugin';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';
import { type OnChangeProps } from './types';
import { type EditorConfig } from '../../types';
import { defaultEditorConfig } from '../../types';

import './index.scss';

const LexicalEditor: React.FC<OnChangeProps> = (props) => {
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

export const LexicalEditorComponent: React.FC<OnChangeProps> = (props) => {
  const { onChange, initialJSON, editorConfig, initialComments, value, setValue } = props;

  return (
    // <SettingsContext>
    <LexicalEditor
      onChange={onChange}
      initialJSON={initialJSON}
      editorConfig={editorConfig}
      initialComments={initialComments}
      value={value}
      setValue={setValue}
    />
    // </SettingsContext>
  );
};

function generateQuickGuid(): string {
  return (
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  ).toString();
}
interface ContextType {
  editorConfig: EditorConfig;
  uuid: string;
}

const Context: React.Context<ContextType> = createContext({
  editorConfig: defaultEditorConfig,
  uuid: generateQuickGuid(),
});

export const EditorConfigProvider = ({
  children,
  editorConfig,
}: {
  children: React.ReactNode;
  editorConfig: EditorConfig;
}): JSX.Element => {
  const [editor] = useLexicalComposerContext();
  const editorContext = useMemo(() => ({ editorConfig, uuid: generateQuickGuid() }), [editor]);

  return <Context.Provider value={editorContext}>{children}</Context.Provider>;
};

export function useEditorConfigContext(): ContextType {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useTheme must be used within an EditorConfigProvider');
  }
  return context;
}
