import { EditorState, LexicalEditor } from 'lexical';
import type { EditorConfig } from '../../types';
import { RichTextField } from 'payload/types';
import { Comments, CommentStore } from './commenting';

export type Props = Omit<RichTextField, 'type'> & {
  editorConfig: EditorConfig;
  path?: string;
};

export type OnChangeProps = {
  onChange: (
    editorState: EditorState,
    editor: LexicalEditor,
    tags: Set<string>,
    commentStore: CommentStore,
  ) => void;
  initialJSON: any;
  editorConfig: EditorConfig;
  initialComments: Comments;
};
