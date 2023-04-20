/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Spread } from 'lexical';

import {
  DecoratorNode,
  EditorConfig,
  NodeKey,
  SerializedLexicalNode,
} from 'lexical';
import * as React from 'react';

import { useSharedAutocompleteContext } from '../../../fields/LexicalRichText/context/SharedAutocompleteContext';
import { uuid as UUID } from '../plugins';

declare global {
  interface Navigator {
    userAgentData?: {
      mobile: boolean;
    };
  }
}

export type SerializedAISuggestNode = Spread<
  {
    uuid: string;
  },
  SerializedLexicalNode
>;

export class AISuggestNode extends DecoratorNode<JSX.Element | null> {
  // TODO add comment
  __uuid: string;

  static clone(node: AISuggestNode): AISuggestNode {
    return new AISuggestNode(node.__key);
  }

  static getType(): 'aisuggest' {
    return 'aisuggest';
  }

  static importJSON(serializedNode: SerializedAISuggestNode): AISuggestNode {
    const node = $createAISuggestNode(serializedNode.uuid);
    return node;
  }

  exportJSON(): SerializedAISuggestNode {
    return {
      type: 'aisuggest',
      uuid: this.__uuid,
      version: 1,
    };
  }

  constructor(uuid: string, key?: NodeKey) {
    super(key);
    this.__uuid = uuid;
  }

  updateDOM(
    prevNode: unknown,
    dom: HTMLElement,
    config: EditorConfig,
  ): boolean {
    return false;
  }

  createDOM(config: EditorConfig): HTMLElement {
    return document.createElement('span');
  }

  decorate(): JSX.Element | null {
    if (this.__uuid !== UUID) {
      return null;
    }
    return <AISuggestComponent />;
  }
}

export function $createAISuggestNode(uuid: string): AISuggestNode {
  return new AISuggestNode(uuid);
}

function AISuggestComponent(): JSX.Element {
  const [suggestion] = useSharedAutocompleteContext();
  const { userAgentData } = window.navigator;
  const isMobile =
    userAgentData !== undefined
      ? userAgentData.mobile
      : window.innerWidth <= 800 && window.innerHeight <= 600;
  // TODO Move to theme
  return (
    <span style={{ color: '#ccc' }} spellCheck="false">
      {suggestion} {isMobile ? '(SWIPE \u2B95)' : '(TAB)'}
    </span>
  );
}
