/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { requests } from 'payload/dist/admin/api';

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedEditor,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

import { $applyNodeReplacement, createEditor, DecoratorNode } from 'lexical';
import * as React from 'react';
import {Suspense, useEffect, useState} from 'react';
import {useConfig} from "payload/dist/admin/components/utilities/Config";
import {useTranslation} from "react-i18next";

const ImageComponent = React.lazy(
  () => import('./ImageComponent'),
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
  type: string;
  value: {
    id: string;
  };
  relationTo: string;
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
    type: 'image';
    version: 1;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __rawImagePayload: RawImagePayload;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__rawImagePayload
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { rawImagePayload, type, version } = serializedNode;
    const node = $createImageNode(rawImagePayload);
    /* const nestedEditor = node.__caption;
    const editorState = nestedEditor.parseEditorState(caption.editorState);
    if (!editorState.isEmpty()) {
      nestedEditor.setEditorState(editorState);
    } */
    return node;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('img');
    element.setAttribute('src', this.__src);
    element.setAttribute('alt', this.__altText); //TODO
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
    rawImagePayload: RawImagePayload
  ) {
    super(undefined); //TODO: Do I need a key?
    this.__rawImagePayload = rawImagePayload;
  }

  exportJSON(): SerializedImageNode {
    return {
      rawImagePayload: this.__rawImagePayload,
      type: 'image',
      version: 1,
    };
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

    const { collections, serverURL, routes: { api } } = useConfig();
    console.log("decorate Image 1...")

    const { i18n } = useTranslation();
    console.log("decorate Image 2...")


    const [imageData, setImageData] = useState<any>(null)
    console.log("decorate Image 3...")


    useEffect(() => {
      const { collections, serverURL, routes: { api } } = useConfig();
      console.log("UseEffect")
      async function loadImageData() {
        console.log("loadImageData")


        const relatedCollection = collections.find((coll) => {
          console.log('coll.slug', coll.slug, 'insertImagePayload.relationTo', this.__rawImagePayload.relationTo);
          return coll.slug === this.__rawImagePayload.relationTo;
        });

        const response = await requests.get(`${serverURL}${api}/${relatedCollection?.slug}/${this.__rawImagePayload.value?.id}`, {
          headers: {
            'Accept-Language': i18n.language,
          },
        });
        const json = await response.json();
        console.log('JSON', json);

        const imagePayload = {
          altText: json?.text,
          height: json?.height,
          maxWidth: json?.width,
          src: json?.url,
        };

        setImageData(imagePayload);
        console.log('image payload', imagePayload);



        console.log('relatedCollection', relatedCollection);
      }

      loadImageData()
    }, [])


    return (
      <Suspense fallback={<p>Loading image...</p>}>
        <ImageComponent
          src={imageData.src}
          altText={imageData.altText}
          width={undefined}
          height={imageData.height}
          maxWidth={imageData.maxWidth}
          nodeKey={this.getKey()}
          showCaption={false}
          caption={undefined}
          captionsEnabled={false}
          resizable
        />
      </Suspense>
    );
  }
}

export function $createImageNode(rawImagePayload: RawImagePayload): ImageNode {
  console.log("$createImageNode")
  return $applyNodeReplacement(
    new ImageNode(
        rawImagePayload
    ),
  );
}

export function $isImageNode(
  node: LexicalNode | null | undefined,
): node is ImageNode {
  return node instanceof ImageNode;
}
