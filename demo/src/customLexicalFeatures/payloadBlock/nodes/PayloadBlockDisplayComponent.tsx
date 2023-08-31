import * as React from 'react';
import { Suspense, useEffect, useState } from 'react';

import { Block, Field } from 'payload/types';
import { Data, Fields } from 'payload/distadmin/components/forms/Form/types';
import Form from 'payload/distadmin/components/forms/Form';
import FormSubmit from 'payload/distadmin/components/forms/Submit';
import fieldTypes from 'payload/distadmin/components/forms/field-types';
import RenderFields from 'payload/distadmin/components/forms/RenderFields';
import buildStateFromSchema from 'payload/distadmin/components/forms/Form/buildStateFromSchema';
import { useLocale } from 'payload/components/utilities';

export default function PayloadBlockDisplayComponent({
  block,
  values,
}: {
  block: Block;
  values: Data;
}): JSX.Element {
  const locale = useLocale();

  console.log('Values', values);
  console.log('Fieldschema', block);
  let fieldsSchema = values;
  // remove undefined fields
  Object.keys(fieldsSchema).forEach((key) => {
    if (fieldsSchema[key] === undefined) {
      delete fieldsSchema[key];
    }
  });
  console.log('Fieldschema2', fieldsSchema);

  const [state, setState] = useState<Fields>(null);

  useEffect(() => {
    const buildState = async () => {
      const newState = await buildStateFromSchema({
        fieldSchema: block.fields,
        data: fieldsSchema || {},
        operation: 'update',
        locale: locale,
        t: null,
      });
      setState(newState);
    };
    buildState();
  });

  return (
    <Suspense fallback={<span>Loading block...</span>}>
      <div style={{ border: '1px solid black', padding: '10px' }}>
        {state && (
          <Form onSubmit={() => {}} initialState={state}>
            <RenderFields
              fieldTypes={fieldTypes}
              readOnly={false}
              fieldSchema={block.fields}
              forceRender
            />
            <FormSubmit>Ignore</FormSubmit>
          </Form>
        )}
        {!state && <span>Loading...</span>}
      </div>
    </Suspense>
  );
}
