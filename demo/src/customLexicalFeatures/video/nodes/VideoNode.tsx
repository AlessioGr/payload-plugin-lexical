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
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
} from 'lexical';

import { $wrapNodeInElement, addClassNamesToElement } from '@lexical/utils';
import { $applyNodeReplacement, $getSelection, $isRangeSelection, Spread } from 'lexical';
import { DecoratorNode } from 'lexical';
import VideoComponent from './VideoComponent';
import React from 'react';

export type VideoAttributes = {
  source: 'youtube' | 'vimeo';
  id: string;
};

export type SerializedVideoNode = Spread<
  {
    attributes: VideoAttributes;
  },
  SerializedLexicalNode
>;

export class VideoNode extends DecoratorNode<JSX.Element> {
  __attributes: VideoAttributes;

  static getType(): string {
    return 'video';
  }

  static clone(node: VideoNode): VideoNode {
    return new VideoNode({
      attributes: node.__attributes,
      key: node.__key,
    });
  }

  constructor({ attributes, key }: { attributes: VideoAttributes; key?: NodeKey }) {
    super(key);
    this.__attributes = attributes;
  }

  createDOM(config: EditorConfig): HTMLSpanElement {
    const element = document.createElement('span');

    addClassNamesToElement(element, /*config.theme.inlineProduct*/ 'PlaygroundEditorTheme__video');
    return element;
  }

  updateDOM(prevNode: VideoNode): boolean {
    // If the inline property changes, replace the element
    return false;
  }

  static importJSON(serializedNode: SerializedVideoNode): VideoNode {
    const node = $createVideoNode(serializedNode.attributes);
    return node;
  }

  exportJSON(): SerializedVideoNode {
    return {
      type: 'video',
      version: 1,
      attributes: this.getAttributes(),
    };
  }

  decorate(): JSX.Element {
    return <VideoComponent attributes={this.getAttributes()} />;
  }

  getAttributes(): VideoAttributes {
    return this.getLatest().__attributes;
  }
  setAttributes(attributes: VideoAttributes): void {
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
}

export function $createVideoNode(attributes?: VideoAttributes): VideoNode {
  return $applyNodeReplacement(new VideoNode({ attributes: attributes }));
}

export function $isVideoNode(node: LexicalNode | null | undefined): node is VideoNode {
  return node instanceof VideoNode;
}

export function toggleVideo(videoAttributes: VideoAttributes): void {
  const selection = $getSelection();

  const videoNode = $createVideoNode(videoAttributes);

  $insertNodes([videoNode]);
  if ($isRootOrShadowRoot(videoNode.getParentOrThrow())) {
    $wrapNodeInElement(videoNode, $createParagraphNode).selectEnd();
  }
}
