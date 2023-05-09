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
} from 'lexical';

import { $wrapNodeInElement, addClassNamesToElement } from '@lexical/utils';
import { $applyNodeReplacement, $getSelection, $isRangeSelection, Spread } from 'lexical';
import { DecoratorNode } from 'lexical';
import * as React from 'react';
const ProductDisplayComponent = React.lazy(() => import('./ProductDisplayComponent'));

export type Display =
  | 'name'
  | 'price_best_shop'
  | 'price_range_all_shops'
  | 'name_price_best_shop_brackets'
  | 'name_price_range_all_shops_brackets'
  | 'affiliate_link_best_shop_label_name'
  | 'affiliate_link_best_shop_label_name_and_price';

export type InlineProductAttributes = {
  doc?: {
    value: string;
    relationTo: string;
  } | null;
  display?: Display;
  customLabel?: string;
};

export type SerializedInlineProductNode = Spread<
  {
    attributes: InlineProductAttributes;
  },
  SerializedLexicalNode
>;

/** @noInheritDoc */
export class InlineProductNode extends DecoratorNode<JSX.Element> {
  __attributes: InlineProductAttributes;

  static getType(): string {
    return 'inlineProduct';
  }

  static clone(node: InlineProductNode): InlineProductNode {
    return new InlineProductNode({
      attributes: node.__attributes,
      key: node.__key,
    });
  }

  constructor({ attributes = {}, key }: { attributes: InlineProductAttributes; key?: NodeKey }) {
    super(key);
    this.__attributes = attributes;
  }

  createDOM(config: EditorConfig): HTMLSpanElement {
    const element = document.createElement('span');

    addClassNamesToElement(
      element,
      /*config.theme.inlineProduct*/ 'PlaygroundEditorTheme__inlineProduct'
    );
    return element;
  }

  updateDOM(prevNode: InlineProductNode): boolean {
    // If the inline property changes, replace the element
    return false;
  }

  static importJSON(serializedNode: SerializedInlineProductNode): InlineProductNode {
    const node = $createInlineProductNode(serializedNode.attributes);
    return node;
  }

  exportJSON(): SerializedInlineProductNode {
    return {
      type: 'inlineProduct',
      version: 1,
      attributes: this.getAttributes(),
    };
  }

  decorate(): JSX.Element {
    return (
      <ProductDisplayComponent
        doc={this.__attributes?.doc}
        display={this.__attributes?.display}
        customLabel={this.__attributes?.customLabel}
      />
    );
  }

  getAttributes(): InlineProductAttributes {
    return this.getLatest().__attributes;
  }
  setAttributes(attributes: InlineProductAttributes): void {
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

  isInline(): true {
    return true;
  }

  extractWithChild(
    child: LexicalNode,
    selection: RangeSelection | NodeSelection | GridSelection,
    destination: 'clone' | 'html'
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

export function $createInlineProductNode(attributes?: InlineProductAttributes): InlineProductNode {
  return $applyNodeReplacement(new InlineProductNode({ attributes: attributes }));
}

export function $isInlineProductNode(
  node: LexicalNode | null | undefined
): node is InlineProductNode {
  return node instanceof InlineProductNode;
}

export function toggleInlineProduct(inlineProductData: InlineProductAttributes): void {
  const selection = $getSelection();

  const inlineProductNode = $createInlineProductNode(inlineProductData);

  $insertNodes([inlineProductNode]);
  if ($isRootOrShadowRoot(inlineProductNode.getParentOrThrow())) {
    $wrapNodeInElement(inlineProductNode, $createParagraphNode).selectEnd();
  }
}
