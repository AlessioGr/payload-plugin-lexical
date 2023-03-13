import { Field } from "payload/types";
import {
  LexicalRichTextFieldComponent,
  LexicalRichTextCell,
} from "./blocksuite";
import { populateLexicalRelationships } from "./BlockSuiteAfterReadHook";

function blocksuiteField(props: {
  name?: string;
  label?: string;
  localized?: boolean;
  required?: boolean;
}): Field {
  const { name, label, localized, required } = props;


  return {
    name: name ? name : "richText",
    type: "richText",
    label: label ? label : "Rich Text",
    localized: localized,
    required: required,
    hooks: {
      afterRead: [populateLexicalRelationships],
    },
    admin: {
      components: {
        Field: (args) =>
          LexicalRichTextFieldComponent({
            ...args,
          }),
        Cell: (args) =>
          LexicalRichTextCell({ ...args }),
      },
    },
  };
}

export default blocksuiteField;
