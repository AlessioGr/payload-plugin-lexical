import FieldDescription from "payload/dist/admin/components/forms/FieldDescription";
import Label from "payload/dist/admin/components/forms/Label";
import Error from "payload/dist/admin/components/forms/Error";
const baseClass = "lexicalRichTextEditor";
import { useField, withCondition } from "payload/components/forms";
import React, { useCallback } from 'react';
import { Props } from "./types";
import { Validate } from 'payload/types';
import { deepEqual } from '../../tools/deepEqual';

import { BlockSuiteProvider, createBlockSuiteStore } from '@blocksuite/react';
import { Workspace } from '@blocksuite/store';
import { IndexedDBDocProvider } from '@blocksuite/store';
import BlockSuiteComponent from "./BlockSuiteComponent";


const LexicalRichTextFieldComponent2: React.FC<Props> = (props) => {
    const {
      editorConfig,
      path,
      required,
      validate,
      defaultValue: defaultValueFromProps, // TODO: Accept different defaultValue
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

    const field = useField<any>({
      path: path, // required

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


  const localWorkspace = new Workspace({
    id: 'local-room',
    isSSR: typeof window === 'undefined',
    providers: typeof window === 'undefined' ? [] : [IndexedDBDocProvider],
  });

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

          <BlockSuiteProvider
              createStore={() => createBlockSuiteStore(localWorkspace)}
          >
            <BlockSuiteComponent />
          </BlockSuiteProvider>
          <FieldDescription value={value} description={description} />
        </div>
      </div>
    );
  };








export default withCondition(LexicalRichTextFieldComponent2);
