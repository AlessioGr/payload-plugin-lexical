import * as React from "react";
import { Suspense, useEffect, useState } from "react";


import { Block, Field } from 'payload/types';
import { Data, Fields } from 'payload/dist/admin/components/forms/Form/types';
import Form from "payload/dist/admin/components/forms/Form";
import FormSubmit from "payload/dist/admin/components/forms/Submit";
import fieldTypes from "payload/dist/admin/components/forms/field-types";
import RenderFields from "payload/dist/admin/components/forms/RenderFields";

export default function PayloadBlockDisplayComponent({
  block,
  values
}: {
  block: Block,
  values: Data
}): JSX.Element {

  console.log("Values", values)
  console.log("Fieldschema", block)
  let fieldsSchema: Fields = values;
  // remove undefined fields
  Object.keys(fieldsSchema).forEach((key) => {
    if (fieldsSchema[key] === undefined) {
      delete fieldsSchema[key];
    }
  });
  console.log("Fieldschema2", fieldsSchema)


  return (
    <Suspense fallback={<span>Loading block...</span>}>
        <div style={{ border: "1px solid black", padding: "10px" }}>
            <Form onSubmit={() => {}} initialState={fieldsSchema}>
                <RenderFields
                    fieldTypes={fieldTypes}
                    readOnly={false}
                    fieldSchema={block.fields}
                    forceRender
                />
                <FormSubmit>Ignore</FormSubmit>
            </Form>
        </div>
    </Suspense>
  );
}
