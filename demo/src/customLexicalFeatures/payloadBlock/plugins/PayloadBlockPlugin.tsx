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
  PayloadBlockAttributes,
  PayloadBlockNode,
  togglePayloadBlock,
} from '../nodes/PayloadBlockNode';

type Props = {};

export const TOGGLE_PAYLOAD_BLOCK_COMMAND: LexicalCommand<PayloadBlockAttributes> =
  createCommand('TOGGLE_PAYLOAD_BLOCK_COMMAND');

export function PayloadBlockPlugin({}: Props): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([PayloadBlockNode])) {
      throw new Error(
        'PayloadBlockPlugin: PayloadBlockPlugin not registered on editor',
      );
    }
    return mergeRegister(
      editor.registerCommand(
        TOGGLE_PAYLOAD_BLOCK_COMMAND,
        (payload) => {
          let payloadBlockData: PayloadBlockAttributes = {
            block: null,
            values: null,
          };

          const receivedPayloadBlockData: PayloadBlockAttributes =
            payload as PayloadBlockAttributes;

          payloadBlockData.block = receivedPayloadBlockData.block;
          if (!payloadBlockData.block) {
            payloadBlockData = null;
          }

          payloadBlockData.values = receivedPayloadBlockData.values;

          togglePayloadBlock(payloadBlockData);
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor]);

  return null;
}
