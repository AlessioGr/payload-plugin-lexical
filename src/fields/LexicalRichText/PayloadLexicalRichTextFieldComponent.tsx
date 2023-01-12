import FieldDescription from "payload/dist/admin/components/forms/FieldDescription";
import Label from "payload/dist/admin/components/forms/Label";
import Error from "payload/dist/admin/components/forms/Error";
import { Comments, CommentStore } from "./commenting";
const baseClass = "lexicalRichTextEditor";

import { useField, withCondition } from "payload/components/forms";
import { LexicalEditorComponent } from "./LexicalEditorComponent";
import React, { useCallback } from 'react';

import {
  $getRoot,
  EditorState,
  LexicalEditor,
  SerializedEditorState,
} from "lexical";
import { Props } from "./types";
import { RichTextField, Validate } from 'payload/types';
import defaultValue from './settings/defaultValue';


const LexicalRichTextFieldComponent2: React.FC<Props> = (props) => {
    const {
      editorConfig,
      path,
      required,
      validate = lexicalValidate,
      name,
      label,
      admin,
      admin: {
        readOnly,
        style,
        className,
        width,
        placeholder,
        description,
        condition,
        hideGutter,
      } = {},
    } = props;
  
    //const { value, setValue } = useField<Props>({ path });

    const memoizedValidate = useCallback((value, validationOptions) => {
      return validate(value, { ...validationOptions, required });
    }, [validate, required]);
  
    const field = useField<{
      jsonContent: SerializedEditorState;
      preview: string;
      characters: number;
      words: number;
      comments: Comments;
    }>({
      path: path, // required
      validate: memoizedValidate,
      
    });
  
    // Here is what `useField` sends back
    const {
      showError, // whether the field should show as errored
      errorMessage, // the error message to show, if showError
      value, // the current value of the field from the form
      formSubmitted, // if the form has been submitted
      formProcessing, // if the form is currently processing
      setValue, // method to set the field's value in form state
      initialValue, // the initial value that the field mounted with,
    } = field;
  
  
    const classes = [
      baseClass,
      "field-type",
      className,
      showError && "error",
      readOnly && `${baseClass}--read-only`,
      !hideGutter && `${baseClass}--gutter`,
    ]
      .filter(Boolean)
      .join(" ");
  
    if (!value?.preview) {
      //Convert...
      setValue({
        jsonContent: value,
        preview: "none",
        characters: 0,
        words: 0,
        comments: undefined,
      });
    }
  
    return (
      <div
        className={classes}
        style={{
          ...style,
          width,
        }}
      >
        <div className={`${baseClass}__wrap`}>
          <Error showError={showError} message={errorMessage} />
          <Label
            htmlFor={`field-${path.replace(/\./gi, "__")}`}
            label={label}
            required={required}
          />
  
          <LexicalEditorComponent
            onChange={(
              editorState: EditorState,
              editor: LexicalEditor,
              commentStore: CommentStore
            ) => {
              const json = editorState.toJSON();
              const valueJsonContent = getJsonContentFromValue(value);
              if (
                !readOnly &&
                /* json !== defaultValue && */ json != valueJsonContent &&
                JSON.stringify(json) !== JSON.stringify(valueJsonContent)
              ) {
                const textContent = editor.getEditorState().read(() => {
                  return $getRoot().getTextContent();
                });
                const preview =
                  textContent?.length > 100
                    ? `${textContent.slice(0, 100)}\u2026`
                    : textContent;
  
                setValue({
                  jsonContent: json,
                  preview: preview,
                  characters: textContent?.length,
                  words: textContent?.split(" ").length,
                  comments: commentStore.getComments(),
                });
              }
            }}
            initialJSON={getJsonContentFromValue(value)}
            editorConfig={editorConfig}
            initialComments={value?.comments}
          />
          <FieldDescription value={value} description={description} />
        </div>
      </div>
    );
  };


  export const lexicalValidate: Validate<unknown, unknown, RichTextField> = (value, { t, required }) => {
    if (required) {
      const stringifiedDefaultValue = JSON.stringify(defaultValue);
      if (value && JSON.stringify(value) !== stringifiedDefaultValue) return true;
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