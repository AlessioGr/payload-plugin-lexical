import { type RichTextField } from 'payload/types';

import { type EditorState, type LexicalEditor } from 'lexical';

import { type Comments, type CommentStore } from './commenting';

import type { EditorConfig } from '../../types';


export type Props = Omit<RichTextField, 'type'> & {
  editorConfig: EditorConfig;
  path?: string;
};

export interface OnChangeProps {
  onChange: (
    editorState: EditorState,
    editor: LexicalEditor,
    tags: Set<string>,
    commentStore: CommentStore,
  ) => void;
  initialJSON: any;
  editorConfig: EditorConfig;
  initialComments: Comments;
  value: any;
  setValue: (value: any) => void;
}
