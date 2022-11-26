/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

import { $applyNodeReplacement, DecoratorNode } from 'lexical';
import * as React from 'react';



const RawImageComponent = React.lazy(
    () => import('./RawImageComponent'),
);

/* export interface ImagePayload {
  altText: string;
  caption?: LexicalEditor;
  height?: number;
  key?: NodeKey;
  maxWidth?: number;
  showCaption?: boolean;
  src: string;
  width?: number;
  captionsEnabled?: boolean;
} */

export interface RawImagePayload {
  value: {
    id: string;
  };
  relationTo: string;
}

export interface ExtraAttributes {
  widthOverride: undefined|number;
  heightOverride: undefined|number;
}

function convertImageElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLImageElement) {
    //const { alt: altText, src } = domNode;
    //const node = $createImageNode({ altText, src });
    //return { node };
    //TODO: Auto-upload functionality here!
  }
  return null;
}

 export type SerializedImageNode = Spread<
  {
    rawImagePayload: RawImagePayload;
    extraAttributes: ExtraAttributes;
    type: 'upload';
    version: 1;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __rawImagePayload: RawImagePayload;
  __extraAttributes: ExtraAttributes = {
    widthOverride: undefined,
    heightOverride: undefined
  };

  static getType(): string {
    return 'upload';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__rawImagePayload,
      node.__extraAttributes
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { rawImagePayload, type, version, extraAttributes } = serializedNode;
    const node = $createImageNode(rawImagePayload, extraAttributes);

    /* const nestedEditor = node.__caption;
    const editorState = nestedEditor.parseEditorState(caption.editorState);
    if (!editorState.isEmpty()) {
      nestedEditor.setEditorState(editorState);
    } */
    return node;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('img');
    // element.setAttribute('src', this.__src);
    // element.setAttribute('alt', this.__altText); //TODO
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (node: Node) => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    };
  }

  constructor(
    rawImagePayload: RawImagePayload,
    extraAttributes: ExtraAttributes,
  ) {
    super(undefined); //TODO: Do I need a key?
    this.__rawImagePayload = rawImagePayload;
    this.__extraAttributes = extraAttributes;
  }

  exportJSON(): SerializedImageNode {
    console.warn("Exported", {
      type: "upload",
      version: 1,
      rawImagePayload: this.__rawImagePayload,
      extraAttributes: this.__extraAttributes,
    })
    return {
      type: "upload",
      version: 1,
      rawImagePayload: this.__rawImagePayload,
      extraAttributes: this.__extraAttributes,
    };
  }

  setWidthAndHeightOverride(
      width: undefined | number,
      height: undefined | number,
  ): void {
    const writable = this.getWritable();
    if(!writable.__extraAttributes){
      writable.__extraAttributes = {
        widthOverride: width,
        heightOverride: height
      }
    }else {
      writable.__extraAttributes.widthOverride = width;
      writable.__extraAttributes.heightOverride = height;
    }

  }



  // View

  // eslint-disable-next-line class-methods-use-this
  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    const { theme } = config;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  // eslint-disable-next-line class-methods-use-this
  updateDOM(): false {
    return false;
  }



  decorate(): JSX.Element {
    console.log("decorate Image...")

    return (
        <RawImageComponent
            rawImagePayload={this.__rawImagePayload}
            extraAttributes={this.__extraAttributes}
            nodeKey={this.getKey()}
        />
    );
  }
}

export function $createImageNode(rawImagePayload: RawImagePayload, extraAttributes: ExtraAttributes): ImageNode {
  console.log("$createImageNode")
  return $applyNodeReplacement(
    new ImageNode(
        rawImagePayload,
        extraAttributes
    ),
  );
}

export function $isImageNode(
  node: LexicalNode | null | undefined,
): node is ImageNode {
  return node instanceof ImageNode;
}
