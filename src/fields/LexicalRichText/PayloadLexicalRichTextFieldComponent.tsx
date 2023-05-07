import React, { useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { useField, withCondition } from 'payload/components/forms';
import Error from 'payload/dist/admin/components/forms/Error';
import FieldDescription from 'payload/dist/admin/components/forms/FieldDescription';
import Label from 'payload/dist/admin/components/forms/Label';
import { type Validate } from 'payload/types';

import { $generateHtmlFromNodes } from '@lexical/html';
import { $convertToMarkdownString } from '@lexical/markdown';
import {
  $getRoot,
  type EditorState,
  type LexicalEditor,
  type SerializedEditorState,
} from 'lexical';

import { type Comments, type CommentStore } from './commenting';
import { LexicalEditorComponent } from './LexicalEditorComponent';
import defaultValue from './settings/defaultValue';
import { type Props } from './types';
import { deepEqual } from '../../tools/deepEqual';

import './payload.scss';

const baseClass = 'lexicalRichTextEditor';

function fallbackRender({ error, resetErrorBoundary }): JSX.Element {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
}

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

  const path = pathFromProps ?? name;

  const memoizedValidate = useCallback(
    async (value, validationOptions) => {
      return await lexicalValidate(value, { ...validationOptions, required }); // TODO use "validate" here so people can customize their validate. Sadly that breaks for some reason (it uses no validate rather than lexical as default one if that's done)
    },
    [validate, required]
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
    path, // required
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
    (readOnly ?? false) && `${baseClass}--read-only`,
    !(hideGutter ?? false) && `${baseClass}--gutter`,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      style={{
        ...style,
        width,
      }}
    >
      <div className={`${baseClass}__wrap`}>
        <Error showError={showError} message={errorMessage ?? ''} />
        <Label htmlFor={`field-${path.replace(/\./gi, '__')}`} label={label} required={required} />

        <ErrorBoundary
          fallbackRender={fallbackRender}
          onReset={(details) => {
            // Reset the state of your app so the error doesn't happen again
          }}
        >
          <LexicalEditorComponent
            onChange={(
              editorState: EditorState,
              editor: LexicalEditor,
              tags: Set<string>,
              commentStore: CommentStore
            ) => {
              const json = editorState.toJSON();
              const valueJsonContent = getJsonContentFromValue(value);
              if (
                !(readOnly ?? false) &&
                Boolean(valueJsonContent) &&
                !deepEqual(json, valueJsonContent)
              ) {
                const textContent = editor.getEditorState().read(() => {
                  return $getRoot().getTextContent();
                });
                const preview =
                  textContent?.length > 100 ? `${textContent.slice(0, 100)}\u2026` : textContent;

                let html: string = '';
                if (editorConfig?.output?.html?.enabled != null) {
                  html = editor.getEditorState().read(() => {
                    return $generateHtmlFromNodes(editor, null);
                  });
                }

                let markdown: string = '';
                if (editorConfig?.output?.markdown?.enabled != null) {
                  markdown = editor.getEditorState().read(() => {
                    return $convertToMarkdownString();
                  });
                }

                setValue({
                  jsonContent: json,
                  preview,
                  characters: textContent?.length,
                  words: textContent?.split(' ').length,
                  comments: commentStore.getComments(),
                  html,
                  markdown,
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
        </ErrorBoundary>
      </div>
    </div>
  );
};

export const lexicalValidate: Validate<unknown, unknown, any> = (value, { t, required }) => {
  if (required != null) {
    const jsonContent = getJsonContentFromValue(value);

    if (jsonContent != null && !deepEqual(jsonContent, defaultValue)) {
      return true;
    }
    return t('validation:required');
  }

  return true;
};

export function getJsonContentFromValue(value): any {
  if (value?.jsonContent == null) {
    return value;
  }
  if (value?.jsonContent?.jsonContent != null) {
    return getJsonContentFromValue(value?.jsonContent);
  }

  return value?.jsonContent;
}

export default withCondition(LexicalRichTextFieldComponent2);
