import { Field } from 'payload/types';
import {
  LexicalRichTextFieldComponent,
  LexicalRichTextCell,
} from './LexicalRichText';
import { defaultEditorConfig, EditorConfig } from '../types';
import { populateLexicalRelationships } from './LexicalAfterReadHook';
import { cloneDeep } from 'lodash';

export function lexicalRichTextField(props: {
  name?: string;
  label?: string;
  localized?: boolean;
  required?: boolean;
  readOnly?: boolean;
  editorConfigModifier?: (defaultEditorConfig: EditorConfig) => EditorConfig;
}): Field {
  const { name, label, localized, required, readOnly, editorConfigModifier } =
    props;

  const defaultEditorConfigCloned = cloneDeep(defaultEditorConfig);

  const finalEditorConfig: EditorConfig = !editorConfigModifier
    ? defaultEditorConfigCloned
    : editorConfigModifier(defaultEditorConfigCloned);

  return {
    name: name ? name : 'richText',
    type: 'richText',
    label: label ? label : 'Rich Text',
    localized: localized,
    required: required,
    hooks: {
      afterRead: [populateLexicalRelationships],
    },
    admin: {
      readOnly: readOnly,
      components: {
        Field: (args) =>
          LexicalRichTextFieldComponent({
            ...args,
            editorConfig: finalEditorConfig,
          }),
        Cell: (args) =>
          LexicalRichTextCell({ ...args, editorConfig: finalEditorConfig }),
      },
    },
  };
}
