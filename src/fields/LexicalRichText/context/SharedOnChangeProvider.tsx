// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import * as React from 'react';
import { createContext, type ReactNode, useContext, useMemo } from 'react';

import type { CommentStore } from '../commenting';
import type { EditorState, LexicalEditor } from 'lexical';

interface ContextType {
  onChange?: (
    editorState: EditorState,
    editor: LexicalEditor,
    tags: Set<string>,
    commentStore?: CommentStore
  ) => void;
}

const Context: React.Context<ContextType> = createContext({});

export const SharedOnChangeProvider = ({
  children,
  onChange,
}: {
  children: ReactNode;
  onChange: (
    editorState: EditorState,
    editor: LexicalEditor,
    tags: Set<string>,
    commentStore?: CommentStore
  ) => void;
}): JSX.Element => {
  const sharedOnChangeContext = useMemo(() => ({ onChange }), []);
  return <Context.Provider value={sharedOnChangeContext}>{children}</Context.Provider>;
};

export const useSharedOnChange = (): ContextType => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useSharedOnChange must be used within an SharedOnChangeProvider');
  } else {
    return context;
  }
};
