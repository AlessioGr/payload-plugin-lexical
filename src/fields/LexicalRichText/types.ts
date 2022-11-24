import { EditorState, LexicalEditor } from 'lexical';

export type Props = {
  path: string
}

export type OnChangeProps = {
  onChange: (editorState: EditorState, editor: LexicalEditor) => void;
  initialJSON: any;
};
