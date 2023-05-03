import React, { Suspense, lazy } from 'react';

import { ShimmerEffect } from 'payload/dist/admin/components/elements/ShimmerEffect';

import { type Props } from './types';

const LexicalRichTextFieldComponent2 = lazy(
  async () => await import('./PayloadLexicalRichTextFieldComponent')
);

export const LexicalRichTextFieldComponent: React.FC<Props> = (props) => {
  return (
    <Suspense fallback={<ShimmerEffect height="35vh" />}>
      <LexicalRichTextFieldComponent2 {...props} />
    </Suspense>
  );
};

export const LexicalRichTextCell: React.FC<any> = (props) => {
  const { cellData } = props;
  const data = cellData;

  if (data == null) {
    return <span></span>;
  }

  return <span>{data.preview}</span>;
};
