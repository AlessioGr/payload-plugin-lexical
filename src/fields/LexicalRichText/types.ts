import { EditorState, LexicalEditor } from 'lexical';
import type {EditorConfig} from "../../types";
import {FieldWithPath, RichTextField} from "payload/types";

export type Props = FieldWithPath & Omit<RichTextField, 'type'> & {
  editorConfig: EditorConfig,
}

export type OnChangeProps = {
  onChange: (editorState: EditorState, editor: LexicalEditor) => void;
  initialJSON: any;
  editorConfig: EditorConfig,
};
