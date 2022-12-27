import { EditorState, LexicalEditor } from 'lexical';
import type {EditorConfig} from "../../types";
import {FieldWithPath, RichTextField} from "payload/types";
import { Comments, CommentStore } from './commenting';

export type Props = FieldWithPath & Omit<RichTextField, 'type'> & {
  editorConfig: EditorConfig,
}

export type OnChangeProps = {
  onChange: (editorState: EditorState, editor: LexicalEditor, commentStore: CommentStore) => void;
  initialJSON: any;
  editorConfig: EditorConfig,
  initialComments: Comments,
};
