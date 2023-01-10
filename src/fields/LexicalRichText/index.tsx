import React, { Suspense, useEffect } from "react";
import {
  $getRoot,
  EditorState,
  LexicalEditor,
  SerializedEditorState,
  SerializedLexicalNode,
} from "lexical";
import { Props } from "./types";
import { LexicalEditorComponent } from "./LexicalEditorComponent";

import "./index.scss";
import Loading from "payload/dist/admin/components/elements/Loading";

const baseClass = "lexicalRichTextEditor";

import { useField } from "payload/components/forms";
import { RawImagePayload } from "./nodes/ImageNode";
import payload from "payload";
import { FieldHook, RichTextField, Validate } from "payload/types";
import FieldDescription from "payload/dist/admin/components/forms/FieldDescription";
import Label from "payload/dist/admin/components/forms/Label";
import Error from "payload/dist/admin/components/forms/Error";
import { Comments, CommentStore } from "./commenting";
type LexicalRichTextFieldAfterReadFieldHook = FieldHook<
  any,
  SerializedEditorState,
  any
>;
export const populateLexicalRelationships2: LexicalRichTextFieldAfterReadFieldHook =
  async ({ value, req }): Promise<SerializedEditorState> => {
    if (value && value.root && value.root.children) {
      const newChildren = [];
      for (let childNode of value.root.children) {
        newChildren.push(await traverseLexicalField(childNode, ""));
      }
      value.root.children = newChildren;
    }

    return value;
  };
async function loadUploadData(
  rawImagePayload: RawImagePayload,
  locale: string
) {
  const foundUpload = await payload.findByID({
    collection: rawImagePayload.relationTo, // required
    id: rawImagePayload.value.id, // required
    depth: 2,
    locale: locale,
  });

  return foundUpload;
}

async function loadInternalLinkDocData(
  value: string,
  relationTo: string,
  locale: string
) {
  //TODO: Adjustable depth

  const foundDoc = await payload.findByID({
    collection: relationTo, // required
    id: value, // required
    depth: 2,
    locale: locale,
  });

  return foundDoc;
}
export async function traverseLexicalField(
  node: SerializedLexicalNode,
  locale: string
): Promise<SerializedLexicalNode> {
  //Find replacements
  if (node.type === "upload") {
    const rawImagePayload: RawImagePayload = node["rawImagePayload"];
    //const extraAttributes: ExtraAttributes = node["extraAttributes"];
    const uploadData = await loadUploadData(rawImagePayload, locale);
    if (uploadData) {
      node["data"] = uploadData;
    }
  } else if (
    node.type === "link" &&
    node["linkType"] &&
    node["linkType"] === "internal"
  ) {
    const doc: {
      value: string;
      relationTo: string;
    } = node["doc"];

    const foundDoc = await loadInternalLinkDocData(
      doc.value,
      doc.relationTo,
      locale
    );
    if (foundDoc) {
      node["doc"]["data"] = foundDoc;
    }
  }

  //Run for its children
  if (node["children"] && node["children"].length > 0) {
    let newChildren = [];
    for (let childNode of node["children"]) {
      newChildren.push(await traverseLexicalField(childNode, locale));
    }
    node["children"] = newChildren;
  }

  return node;
}

export const LexicalRichTextCell: React.FC<any> = (props) => {
  const { cellData } =
    props;
  const data = cellData;

  if (!data) {
    return <span></span>;
  }

  return <span>{data.preview}</span>;
};

export const LexicalRichTextFieldComponent: React.FC<Props> = (props) => {
  return (
    <Suspense fallback={<Loading />}>
      <LexicalRichTextFieldComponent2 {...props} />
    </Suspense>
  );
};

export const lexicalValidate: Validate<unknown, unknown, RichTextField> = (
  value,
  { t, required }
) => {
  if (required) {
    /* const stringifiedDefaultValue = JSON.stringify(defaultRichTextValue);
        if (value && JSON.stringify(value) !== stringifiedDefaultValue) return true;
        return t('validation:required'); */
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

const LexicalRichTextFieldComponent2: React.FC<Props> = (props: Props) => {
  const {
    editorConfig,
    path,
    required,
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

  const field = useField<{
    jsonContent: SerializedEditorState;
    preview: string;
    characters: number;
    words: number;
    comments: Comments;
  }>({
    path: path, // required
    validate: lexicalValidate,
    // validate: myValidateFunc, // optional
    // disableFormData?: false, // if true, the field's data will be ignored
    // condition?: myConditionHere, // optional, used to skip validation if condition fails
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
