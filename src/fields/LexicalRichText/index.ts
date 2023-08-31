import { type FieldBase, type Field } from 'payload/types';

import { cloneDeep } from 'lodash';

import { LexicalRichTextFieldComponent, LexicalRichTextCell } from './FieldComponentLazy';
import { populateLexicalRelationships } from './LexicalAfterReadHook';
import { updateLexicalRelationships } from './LexicalBeforeChangeHook';
import { defaultEditorConfig, type EditorConfig } from '../../types';

export function lexicalRichTextField(
  args: Omit<FieldBase, 'name'> & {
    name?: string;
    editorConfigModifier?: (defaultEditorConfig: EditorConfig) => EditorConfig;
  }
): Field {
  const { name, label, admin, hooks, editorConfigModifier, ...rest } = args;

  const defaultEditorConfigCloned = cloneDeep(defaultEditorConfig);

  const finalEditorConfig: EditorConfig =
    editorConfigModifier == null
      ? defaultEditorConfigCloned
      : editorConfigModifier(defaultEditorConfigCloned);

  return {
    name: name ?? 'richText',
    type: 'richText',
    label: label ?? 'Rich Text',
    ...rest,
    hooks: {
      ...hooks,
      beforeChange: [updateLexicalRelationships],
      afterRead: [populateLexicalRelationships],
    },
    admin: {
      ...admin,
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
