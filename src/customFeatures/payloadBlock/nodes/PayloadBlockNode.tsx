/** @module @lexical/link */
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  EditorConfig,
  GridSelection,
  LexicalNode,
  NodeKey,
  NodeSelection,
  RangeSelection,
  SerializedLexicalNode,
} from "lexical";

import { $wrapNodeInElement, addClassNamesToElement } from "@lexical/utils";
import {
  $applyNodeReplacement,
  $getSelection,
  $isRangeSelection,
  Spread,
} from "lexical";
import { DecoratorNode } from 'lexical';
import * as React from 'react';
import { Block } from 'payload/types';
import { Data } from 'payload/dist/admin/components/forms/Form/types';
const PayloadBlockDisplayComponent = React.lazy(() => import("./PayloadBlockDisplayComponent"));

export type PayloadBlockAttributes = {
  block?: Block,
  values?: Data
};

export type SerializedPayloadBlockNode = Spread<
  {
    type: "payloadBlock";
    version: 1;
    attributes: PayloadBlockAttributes
  },
  SerializedLexicalNode
>;

/** @noInheritDoc */
export class PayloadBlockNode extends DecoratorNode<JSX.Element> {

  __attributes: PayloadBlockAttributes;

  static getType(): string {
    return "payloadBlock";
  }

  static clone(node: PayloadBlockNode): PayloadBlockNode {
    return new PayloadBlockNode(
      {
        attributes: node.__attributes,
        key: node.__key
      }
    );
  }

  constructor({attributes = {}, key}: {attributes: PayloadBlockAttributes, key?: NodeKey}) {
    super(key);
    this.__attributes = attributes;
  }


  createDOM(config: EditorConfig): HTMLSpanElement {
    const element = document.createElement("span");

    addClassNamesToElement(element, /*config.theme.payloadBlock*/ 'PlaygroundEditorTheme__payloadBlock');
    return element;
  }

  updateDOM(prevNode: PayloadBlockNode): boolean {
    // If the inline property changes, replace the element
    return false;
  }


  static importJSON(
    serializedNode: SerializedPayloadBlockNode
  ): PayloadBlockNode {
    const node = $createPayloadBlockNode(serializedNode.attributes);
    return node;
  }


  exportJSON(): SerializedPayloadBlockNode {
    return {
      type: "payloadBlock",
      version: 1,
      attributes: this.getAttributes()
    };
  }

  decorate(): JSX.Element {

    return (
      <PayloadBlockDisplayComponent
        block={this.__attributes?.block}
        values={this.__attributes?.values}
      />
    );
  }




  getAttributes(): PayloadBlockAttributes {
    return this.getLatest().__attributes;
  }
  setAttributes(attributes: PayloadBlockAttributes): void {
    const writable = this.getWritable();
    writable.__attributes = attributes;
  }
  



  canInsertTextBefore(): false {
    return false;
  }

  canInsertTextAfter(): false {
    return false;
  }

  canBeEmpty(): false {
    return false;
  }

  isInline(): false {
    return false;
  } //TODO: Could be made configurable depending on the payload block?

  extractWithChild(
    child: LexicalNode,
    selection: RangeSelection | NodeSelection | GridSelection,
    destination: "clone" | "html"
  ): boolean {
    if (!$isRangeSelection(selection)) {
      return false;
    }

    const anchorNode = selection.anchor.getNode();
    const focusNode = selection.focus.getNode();

    return (
      this.isParentOf(anchorNode) &&
      this.isParentOf(focusNode) &&
      selection.getTextContent().length > 0
    );
  }
}


export function $createPayloadBlockNode(
  attributes?: PayloadBlockAttributes
): PayloadBlockNode {
  return $applyNodeReplacement(new PayloadBlockNode({attributes: attributes}));
}

export function $isPayloadBlockNode(
  node: LexicalNode | null | undefined
): node is PayloadBlockNode {
  return node instanceof PayloadBlockNode;
}



export function togglePayloadBlock(payloadBlockData: PayloadBlockAttributes): void {
 
  const selection = $getSelection();

  const inlineProductNode = $createPayloadBlockNode(payloadBlockData);

  $insertNodes([inlineProductNode]);
  if ($isRootOrShadowRoot(inlineProductNode.getParentOrThrow())) {
    $wrapNodeInElement(inlineProductNode, $createParagraphNode).selectEnd();
  }

}


