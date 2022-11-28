import { EditorState, LexicalEditor } from 'lexical';
import type {EditorConfig} from "../../types";
import {FieldWithPath} from "payload/types";

export type Props = FieldWithPath & {
  editorConfig: EditorConfig,
}

export type OnChangeProps = {
  onChange: (editorState: EditorState, editor: LexicalEditor) => void;
  initialJSON: any;
};
