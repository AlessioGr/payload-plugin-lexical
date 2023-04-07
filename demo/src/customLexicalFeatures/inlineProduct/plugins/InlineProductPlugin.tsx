/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { COMMAND_PRIORITY_LOW, createCommand, LexicalCommand } from 'lexical';
import { useEffect } from 'react';

import {
  InlineProductAttributes,
  InlineProductNode,
  toggleInlineProduct,
} from '../nodes/InlineProductNode';

type Props = {};

export const TOGGLE_INLINE_PRODUCT_COMMAND: LexicalCommand<InlineProductAttributes> =
  createCommand('TOGGLE_INLINE_PRODUCT_COMMAND');

export function InlineProductPlugin({}: Props): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([InlineProductNode])) {
      throw new Error(
        'InlineProductPlugin: InlineProductNode not registered on editor',
      );
    }
    return mergeRegister(
      editor.registerCommand(
        TOGGLE_INLINE_PRODUCT_COMMAND,
        (payload) => {
          let inlineProductData: InlineProductAttributes = {
            doc: null,
            display: null,
            customLabel: null,
          };

          const receivedLinkData: InlineProductAttributes =
            payload as InlineProductAttributes;

          inlineProductData.doc = receivedLinkData.doc;
          if (!inlineProductData.doc) {
            inlineProductData = null;
          }

          inlineProductData.display = receivedLinkData.display;

          inlineProductData.customLabel = receivedLinkData.customLabel;

          toggleInlineProduct(inlineProductData);
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor]);

  return null;
}
