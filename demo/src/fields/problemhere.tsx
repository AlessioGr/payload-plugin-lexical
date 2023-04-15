import React from "react";

// React component:
export const someComponent = () => {
  // This works:
  // import payload from 'payload';
  const a = payload;

  // But this doesn't:
  // import { useField } from "payload/components/forms";
  const b = useField<{}>({ path: "somePath" });

  return <div>Text</div>;
};
