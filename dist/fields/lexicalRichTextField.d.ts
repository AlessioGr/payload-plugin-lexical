import { Field } from 'payload/types';
import { FieldBase } from 'payload/dist/fields/config/types';
import { EditorConfig } from '../types';
export declare function lexicalRichTextField(props: Omit<FieldBase, 'name'> & {
    name?: string;
    editorConfigModifier?: (defaultEditorConfig: EditorConfig) => EditorConfig;
}): Field;
