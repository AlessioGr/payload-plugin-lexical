/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';

import {
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalNode,
  type SerializedLexicalNode,
  type Spread,
  type LexicalEditor,
  type SerializedEditor,
  createEditor,
  $applyNodeReplacement,
  DecoratorNode,
} from 'lexical';

const RawImageComponent = React.lazy(async () => await import('./RawImageComponent'));

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

export interface ImagePayload {
  rawImagePayload: RawImagePayload;
  caption?: LexicalEditor;
  showCaption?: boolean;
  captionsEnabled?: boolean;
}

export interface ExtraAttributes {
  widthOverride: undefined | number;
  heightOverride: undefined | number;
}

function convertImageElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLImageElement) {
    // const { alt: altText, src } = domNode;
    // const node = $createImageNode({ altText, src });
    // return { node };
    // TODO: Auto-upload functionality here!
  }
  return null;
}

export type SerializedImageNode = Spread<
  {
    rawImagePayload: RawImagePayload;
    extraAttributes: ExtraAttributes;
    caption: SerializedEditor;
    showCaption: boolean;
    data?: any; // Populated in afterRead hook
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __rawImagePayload: RawImagePayload;

  __extraAttributes: ExtraAttributes = {
    widthOverride: undefined,
    heightOverride: undefined,
  };

  __showCaption: boolean;

  __caption: LexicalEditor;

  // Captions cannot yet be used within editor cells
  __captionsEnabled: boolean;

  static getType(): string {
    return 'upload';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__rawImagePayload,
      node.__extraAttributes,
      node.__showCaption,
      node.__caption,
      node.__captionsEnabled
    );
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
    showCaption?: boolean,
    caption?: LexicalEditor,
    captionsEnabled?: boolean
  ) {
    super(undefined); // TODO: Do I need a key?
    this.__rawImagePayload = rawImagePayload;
    this.__extraAttributes = extraAttributes;
    this.__showCaption = showCaption ?? false;
    this.__caption = caption != null ? caption : createEditor();
    this.__captionsEnabled = captionsEnabled ?? captionsEnabled === undefined;
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { rawImagePayload, type, version, extraAttributes, caption, showCaption } =
      serializedNode;
    const node = $createImageNode(
      rawImagePayload,
      extraAttributes,
      showCaption,
      undefined,
      undefined
    );

    const nestedEditor = node.__caption;

    try {
      const editorState = nestedEditor?.parseEditorState(caption.editorState);

      if (!editorState.isEmpty()) {
        nestedEditor.setEditorState(editorState);
      }
    } catch (e) {
      console.error(e);
    }

    return node;
  }

  exportJSON(): SerializedImageNode {
    return {
      type: 'upload',
      version: 1,
      rawImagePayload: this.__rawImagePayload,
      extraAttributes: this.__extraAttributes,
      caption: this.__caption.toJSON(),
      showCaption: this.__showCaption,
    };
  }

  setWidthAndHeightOverride(width: undefined | number, height: undefined | number): void {
    const writable = this.getWritable();
    if (writable.__extraAttributes == null) {
      writable.__extraAttributes = {
        widthOverride: width,
        heightOverride: height,
      };
    } else {
      writable.__extraAttributes.widthOverride = width;
      writable.__extraAttributes.heightOverride = height;
    }
  }

  setShowCaption(showCaption: boolean): void {
    const writable = this.getWritable();
    writable.__showCaption = showCaption;
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
    return (
      <RawImageComponent
        rawImagePayload={this.__rawImagePayload}
        extraAttributes={this.__extraAttributes}
        nodeKey={this.getKey()}
        showCaption={this.__showCaption}
        caption={this.__caption}
        captionsEnabled={this.__captionsEnabled}
      />
    );
  }
}

export function $createImageNode(
  rawImagePayload: RawImagePayload,
  extraAttributes: ExtraAttributes,
  showCaption,
  caption,
  captionsEnabled
): ImageNode {
  return $applyNodeReplacement(
    new ImageNode(rawImagePayload, extraAttributes, showCaption, caption, captionsEnabled)
  );
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode;
}
