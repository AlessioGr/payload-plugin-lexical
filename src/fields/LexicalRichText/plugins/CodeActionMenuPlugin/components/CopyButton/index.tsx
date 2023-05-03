/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import * as React from 'react';
import { useState } from 'react';

import { $isCodeNode } from '@lexical/code';
import {
  $getNearestNodeFromDOMNode,
  $getSelection,
  $setSelection,
  type LexicalEditor,
} from 'lexical';

import { useDebounce } from '../../utils';

interface Props {
  editor: LexicalEditor;
  getCodeDOMNode: () => HTMLElement | null;
}

export function CopyButton({ editor, getCodeDOMNode }: Props): JSX.Element {
  const [isCopyCompleted, setCopyCompleted] = useState<boolean>(false);

  const removeSuccessIcon = useDebounce(() => {
    setCopyCompleted(false);
  }, 1000);

  async function handleClick(): Promise<void> {
    const codeDOMNode = getCodeDOMNode();

    if (codeDOMNode == null) {
      return;
    }

    let content = '';

    editor.update(() => {
      const codeNode = $getNearestNodeFromDOMNode(codeDOMNode);

      if ($isCodeNode(codeNode)) {
        content = codeNode.getTextContent();
      }

      const selection = $getSelection();
      $setSelection(selection);
    });

    try {
      await navigator.clipboard.writeText(content);
      setCopyCompleted(true);
      removeSuccessIcon();
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  return (
    <button
      className="menu-item"
      // TODO: revisit this
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={async (event) => {
        event.preventDefault();
        await handleClick();
      }}
      aria-label="copy"
      title="Copy"
    >
      {isCopyCompleted ? <i className="format success" /> : <i className="format copy" />}
    </button>
  );
}
