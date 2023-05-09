import * as React from 'react';
import { useMemo, useContext, createContext } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { defaultEditorConfig } from '../../types';

import type { EditorConfig } from '../../types';

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

export const useEditorConfigContext = (): ContextType => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useEditorConfigContext must be used within an EditorConfigProvider');
  }
  return context;
};
