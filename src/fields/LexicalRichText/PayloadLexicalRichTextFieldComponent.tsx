import FieldDescription from 'payload/dist/admin/components/forms/FieldDescription';
import Label from 'payload/dist/admin/components/forms/Label';
import Error from 'payload/dist/admin/components/forms/Error';
import { Comments, CommentStore } from './commenting';
const baseClass = 'lexicalRichTextEditor';
import { $generateHtmlFromNodes } from '@lexical/html';

import { useField, withCondition } from 'payload/components/forms';
import { LexicalEditorComponent } from './LexicalEditorComponent';
import React, { useCallback } from 'react';

import {
  $getRoot,
  EditorState,
  LexicalEditor,
  SerializedEditorState,
} from 'lexical';
import { Props } from './types';
import { Validate } from 'payload/types';
import defaultValue from './settings/defaultValue';
import { deepEqual } from '../../tools/deepEqual';
import './payload.scss';
import { $convertToMarkdownString } from '@lexical/markdown';

const LexicalRichTextFieldComponent2: React.FC<Props> = (props) => {
  const {
    editorConfig,
    path: pathFromProps,
    required,
    validate = lexicalValidate,
    defaultValue: defaultValueFromProps, // TODO: Accept different defaultValue
    name,
    label,
    admin: {
      readOnly,
      style,
      className,
      width,
      placeholder, // TODO: Accept different placeholder for richtext editor
      description,
      condition,
      hideGutter,
    } = {},
  } = props;

  const path = pathFromProps || name;

  const memoizedValidate = useCallback(
    (value, validationOptions) => {
      return lexicalValidate(value, { ...validationOptions, required }); //TODO use "validate" here so people can customize their validate. Sadly that breaks for some reason (it uses no validate rather than lexical as default one if that's done)
    },
    [validate, required],
  );

  const field = useField<{
    jsonContent: SerializedEditorState;
    preview: string;
    characters: number;
    words: number;
    comments: Comments;
    html?: string;
    markdown?: string;
  }>({
    path: path, // required
    validate: memoizedValidate,
    condition,
  });

  // Here is what `useField` sends back
  const {
    showError, // whether the field should show as errored
    errorMessage, // the error message to show, if showError
    value = {
      jsonContent: defaultValue,
      preview: 'none',
      characters: 0,
      words: 0,
      comments: undefined,
    }, // the current value of the field from the form
    setValue, // method to set the field's value in form state
    initialValue, // TODO: the initial value that the field mounted with,
  } = field;

  const classes = [
    baseClass,
    'field-type',
    className,
    showError && 'error',
    readOnly && `${baseClass}--read-only`,
    !hideGutter && `${baseClass}--gutter`,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      style={{
        ...style,
        width,
      }}>
      <div className={`${baseClass}__wrap`}>
        <Error showError={showError} message={errorMessage} />
        <Label
          htmlFor={`field-${path.replace(/\./gi, '__')}`}
          label={label}
          required={required}
        />

        <LexicalEditorComponent
          onChange={(
            editorState: EditorState,
            editor: LexicalEditor,
            tags: Set<string>,
            commentStore: CommentStore,
          ) => {
            const json = editorState.toJSON();
            const valueJsonContent = getJsonContentFromValue(value);
            if (
              !readOnly &&
              valueJsonContent &&
              !deepEqual(json, valueJsonContent)
            ) {
              const textContent = editor.getEditorState().read(() => {
                return $getRoot().getTextContent();
              });
              const preview =
                textContent?.length > 100
                  ? `${textContent.slice(0, 100)}\u2026`
                  : textContent;

              let html: string;
              if (editorConfig?.output?.html?.enabled) {
                html = editor.getEditorState().read(() => {
                  return $generateHtmlFromNodes(editor, null);
                });
              }

              let markdown: string;
              if (editorConfig?.output?.markdown?.enabled) {
                markdown = editor.getEditorState().read(() => {
                  return $convertToMarkdownString();
                });
              }

              setValue({
                jsonContent: json,
                preview: preview,
                characters: textContent?.length,
                words: textContent?.split(' ').length,
                comments: commentStore.getComments(),
                html: html,
                markdown: markdown,
              });
            }
          }}
          initialJSON={getJsonContentFromValue(value)}
          editorConfig={editorConfig}
          initialComments={value?.comments}
          value={value}
          setValue={setValue}
        />
        <FieldDescription value={value} description={description} />
      </div>
    </div>
  );
};

export const lexicalValidate: Validate<unknown, unknown, any> = (
  value,
  { t, required },
) => {
  if (required) {
    const jsonContent = getJsonContentFromValue(value);

    if (jsonContent && !deepEqual(jsonContent, defaultValue)) {
      return true;
    }
    return t('validation:required');
  }

  return true;
};

export function getJsonContentFromValue(value) {
  if (!value?.jsonContent) {
    return value;
  }
  if (value?.jsonContent?.jsonContent) {
    return getJsonContentFromValue(value?.jsonContent);
  }

  return value?.jsonContent;
}

export default withCondition(LexicalRichTextFieldComponent2);
