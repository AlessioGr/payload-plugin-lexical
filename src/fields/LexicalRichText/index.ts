import { type FieldBase } from 'payload/dist/fields/config/types';
import { type Field } from 'payload/types';

import { cloneDeep } from 'lodash';

import { LexicalRichTextFieldComponent, LexicalRichTextCell } from './FieldComponentLazy';
import { populateLexicalRelationships } from './LexicalAfterReadHook';
import { defaultEditorConfig, type EditorConfig } from '../../types';

export function lexicalRichTextField(
  props: Omit<FieldBase, 'name'> & {
    name?: string;
    editorConfigModifier?: (defaultEditorConfig: EditorConfig) => EditorConfig;
  }
): Field {
  const { name, label, editorConfigModifier } = props;

  const defaultEditorConfigCloned = cloneDeep(defaultEditorConfig);

  const finalEditorConfig: EditorConfig =
    editorConfigModifier == null
      ? defaultEditorConfigCloned
      : editorConfigModifier(defaultEditorConfigCloned);

  if (props?.editorConfigModifier != null) {
    delete props.editorConfigModifier;
  }

  return {
    name: name ?? 'richText',
    type: 'richText',
    label: label ?? 'Rich Text',
    ...props,
    hooks: {
      ...props.hooks,
      afterRead: [populateLexicalRelationships],
    },
    admin: {
      ...props.admin,
      components: {
        Field: (args) =>
          LexicalRichTextFieldComponent({
            ...args,
            editorConfig: finalEditorConfig,
          }),
        Cell: (args) => LexicalRichTextCell({ ...args, editorConfig: finalEditorConfig }),
      },
    },
  };
}
