import React, { Suspense, lazy } from "react";

import { Props } from "./types";
import { ShimmerEffect } from 'payload/dist/admin/components/elements/ShimmerEffect';


const LexicalRichTextFieldComponent2 = lazy(() => import('./PayloadBlockSuiteFieldComponent'));

export const LexicalRichTextFieldComponent: React.FC<Props> = (props) => {
  return (
      <LexicalRichTextFieldComponent2 {...props} />
  );
};

export const LexicalRichTextCell: React.FC<any> = (props) => {
  const { cellData } =
    props;
  const data = cellData;

  if (!data) {
    return <span></span>;
  }

  return <span>{data.preview}</span>;
};





