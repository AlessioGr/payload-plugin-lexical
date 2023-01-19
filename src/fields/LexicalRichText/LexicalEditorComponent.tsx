/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import * as React from "react";
import { createContext, ReactNode, useContext, useMemo } from "react";
import { EditorConfig } from '../../types';

import { SettingsContext, useSettings } from "./context/SettingsContext";
import { SharedAutocompleteContext } from "./context/SharedAutocompleteContext";
import { SharedHistoryContext } from "./context/SharedHistoryContext";
import { Editor } from "./LexicalRichText";
import PlaygroundNodes from "./nodes/PlaygroundNodes";
import { CommentsContext } from './plugins/CommentPlugin';
import PasteLogPlugin from "./plugins/PasteLogPlugin";
import { TableContext } from "./plugins/TablePlugin";
import TestRecorderPlugin from "./plugins/TestRecorderPlugin";
import TypingPerfPlugin from "./plugins/TypingPerfPlugin";
import Settings from "./settings/Settings";
import PlaygroundEditorTheme from "./themes/PlaygroundEditorTheme";
import { OnChangeProps } from "./types";

const LexicalEditor: React.FC<OnChangeProps> = (props) => {
  const { onChange, initialJSON, editorConfig, initialComments } = props;

  const {
    settings: { measureTypingPerf },
  } = useSettings();

  const initialConfig = {
    editorState: initialJSON != null ? JSON.stringify(initialJSON) : undefined,
    namespace: "Playground",
    nodes: [...PlaygroundNodes(editorConfig)],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  // TODO: When should {true ? <PasteLogPlugin /> : null} be enabled? Do we need it?
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
                  />
                </div>
                {editorConfig.debug && <Settings />}
                {editorConfig.debug && <PasteLogPlugin />}
                {editorConfig.debug && <TestRecorderPlugin />}
                {measureTypingPerf && editorConfig.debug && <TypingPerfPlugin />}
              </CommentsContext>
            </SharedAutocompleteContext>
          </TableContext>
        </SharedHistoryContext>
      </EditorConfigContext>
    </LexicalComposer>
  );
};

export const LexicalEditorComponent: React.FC<OnChangeProps> = (props) => {
  const { onChange, initialJSON, editorConfig, initialComments } = props;

  return (
    <SettingsContext>
      <LexicalEditor
        onChange={onChange}
        initialJSON={initialJSON}
        editorConfig={editorConfig}
        initialComments={initialComments}
      />
    </SettingsContext>
  );
};


type ContextShape = {
  editorConfig?: EditorConfig;
};

const Context: React.Context<ContextShape> = createContext({});

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
    throw new Error("editorConfig is required");
  } else {
    editorContextShape = useMemo(
      () => ({ editorConfig: editorConfig }),
      [editor]
    );
  }

  return (
    <Context.Provider value={editorContextShape}>{children}</Context.Provider>
  );
};

export const useEditorConfigContext = (): ContextShape => {
  return useContext(Context);
};
