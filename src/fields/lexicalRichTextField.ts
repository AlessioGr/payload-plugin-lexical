import { Field } from 'payload/types';
import { cloneDeep } from 'lodash';
import { FieldBase } from 'payload/dist/fields/config/types';
import {
  LexicalRichTextFieldComponent,
  LexicalRichTextCell,
} from './LexicalRichText';
import { defaultEditorConfig, EditorConfig } from '../types';
import { populateLexicalRelationships } from './LexicalAfterReadHook';

export function lexicalRichTextField(
  props: Omit<FieldBase, 'name'> & {
    name?: string;
    editorConfigModifier?: (defaultEditorConfig: EditorConfig) => EditorConfig;
  },
): Field {
  const { name, label, editorConfigModifier } = props;

  const defaultEditorConfigCloned = cloneDeep(defaultEditorConfig);

  const finalEditorConfig: EditorConfig = !editorConfigModifier
    ? defaultEditorConfigCloned
    : editorConfigModifier(defaultEditorConfigCloned);

  if (props?.editorConfigModifier) {
    delete props.editorConfigModifier;
  }

  return {
    name: name || 'richText',
    type: 'richText',
    label: label || 'Rich Text',
    ...props,
    hooks: {
      ...props.hooks,
      afterRead: [populateLexicalRelationships],
    },
    admin: {
      ...props.admin,
      components: {
        Field: (args) => LexicalRichTextFieldComponent({
          ...args,
          editorConfig: finalEditorConfig,
        }),
        Cell: (args) => LexicalRichTextCell({ ...args, editorConfig: finalEditorConfig }),
      },
    },
  };
}
