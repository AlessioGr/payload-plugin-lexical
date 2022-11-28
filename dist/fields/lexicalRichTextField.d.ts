import { Field } from 'payload/types';
import { EditorConfig } from "../types";
declare function lexicalRichTextField(props: {
    name?: string;
    label?: string;
    editorConfigModifier?: (defaultEditorConfig: EditorConfig) => EditorConfig;
}): Field;
export default lexicalRichTextField;
