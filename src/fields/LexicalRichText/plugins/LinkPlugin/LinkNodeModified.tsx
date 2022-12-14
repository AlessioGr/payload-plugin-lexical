/** @module @lexical/link */
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
  EditorConfig,
  GridSelection,
  LexicalCommand,
  LexicalNode,
  NodeKey,
  NodeSelection,
  RangeSelection,
  SerializedElementNode,
} from "lexical";

import { addClassNamesToElement } from "@lexical/utils";
import {
  $applyNodeReplacement,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  createCommand,
  ElementNode,
  Spread,
} from "lexical";


export type LinkAttributes = {
  url?: string;
  rel?: null | string;
  newTab?: boolean;
  sponsored?: boolean;
  nofollow?: boolean;
  doc?: {
    value: string;
    relationTo: string;
  } | null;
  linkType?: "custom" | "internal";
};

export type SerializedLinkNode = Spread<
  {
    type: "link";
    version: 2;
    attributes: LinkAttributes
  },
  SerializedElementNode
>;



/** @noInheritDoc */
export class LinkNode extends ElementNode {

  __attributes: LinkAttributes;


  static getType(): string {
    return "link";
  }

  static clone(node: LinkNode): LinkNode {
    return new LinkNode(
      {
        attributes: node.__attributes,
        key: node.__key
      }
    );
  }

  constructor({attributes = {url: null, newTab: false, sponsored: false, nofollow: false, rel: null, doc: null, linkType: "custom"}, key}: {attributes: LinkAttributes , key?: NodeKey}) {
    super(key);
    this.__attributes = attributes;
  }

  createDOM(config: EditorConfig): HTMLAnchorElement {
    const element = document.createElement("a");
    if (this.__attributes?.linkType === "custom") {
      element.href = this.__attributes.url;
    }
    if (this.__attributes?.newTab) {
      element.target = "_blank";
    }

    element.rel = "";

    if (this.__attributes?.sponsored) {
      element.rel += "sponsored";
    }

    if (this.__attributes?.nofollow) {
      element.rel += " nofollow";
    }

    if (this.__attributes?.rel !== null) {
      element.rel += " " + this.__rel;
    }
    addClassNamesToElement(element, config.theme.link);
    return element;
  }

  updateDOM(
    prevNode: LinkNode,
    anchor: HTMLAnchorElement,
    config: EditorConfig
  ): boolean {
    const url = this.__attributes?.url;
    const newTab = this.__attributes?.newTab;
    const sponsored = this.__attributes?.sponsored;
    const nofollow = this.__attributes?.nofollow;
    const rel = this.__attributes?.rel;
    if (url !== prevNode.__attributes?.url && this.__attributes?.linkType === "custom") {
      anchor.href = url;
    }
    if (this.__attributes?.linkType === "internal" && prevNode.__attributes?.linkType === "custom") {
      anchor.removeAttribute("href");
    }

    if (newTab !== prevNode.__attributes?.newTab) {
      if (newTab) {
        anchor.target = "_blank";
      } else {
        anchor.removeAttribute("target");
      }
    }

    if(!anchor.rel){
      anchor.rel = "";
    }

    if (sponsored !== prevNode.__attributes.sponsored) {
      if (sponsored) {
        anchor.rel += "sponsored";
      } else {
        anchor.rel.replace(" sponsored", "").replace("sponsored", "")
      }
    }

    if (nofollow !== prevNode.__attributes.nofollow) {
      if (nofollow) {
        anchor.rel += "nofollow";
      } else {
        anchor.rel.replace(" nofollow", "").replace("nofollow", "")
      }
    }

    if (rel !== prevNode.__attributes.rel) {
      if (rel) {
        anchor.rel += rel;
      } else {
        anchor.removeAttribute("rel");
      }
    }
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      a: (node: Node) => ({
        conversion: convertAnchorElement,
        priority: 1,
      }),
    };
  }

  static importJSON(
    serializedNode: SerializedLinkNode | SerializedAutoLinkNode
  ): LinkNode {
    const node = $createLinkNode({
      attributes: serializedNode.attributes
    });
    node.setFormat(serializedNode.format);
    node.setIndent(serializedNode.indent);
    node.setDirection(serializedNode.direction);
    return node;
  }

  exportJSON(): SerializedLinkNode | SerializedAutoLinkNode {
    return {
      ...super.exportJSON(),
      attributes: this.getAttributes(),
      type: "link",
      version: 2,
    };
  }

  getAttributes(): LinkAttributes {
    return this.getLatest().__attributes;
  }

  setAttributes(attributes: LinkAttributes): void {
    const writable = this.getWritable();
    writable.__attributes = attributes;
  }

  insertNewAfter(
    selection: RangeSelection,
    restoreSelection = true
  ): null | ElementNode {
    const element = this.getParentOrThrow().insertNewAfter(
      selection,
      restoreSelection
    );
    if ($isElementNode(element)) {
      const linkNode = $createLinkNode({attributes: this.__attributes});
      element.append(linkNode);
      return linkNode;
    }
    return null;
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

function convertAnchorElement(domNode: Node): DOMConversionOutput {
  let node = null;
  if (domNode instanceof HTMLAnchorElement) {
    const content = domNode.textContent;
    if (content !== null && content !== "") {
      node = $createLinkNode({attributes: {
        url: domNode.getAttribute("href") || "",
        rel: domNode.getAttribute("rel"),
        newTab: domNode.getAttribute("target") === "_blank",
        sponsored: domNode.getAttribute("rel")?.includes("sponsored") || false,
        nofollow: domNode.getAttribute("rel")?.includes("nofollow") || false,
        linkType: "custom",
        doc: null,
      }});
    }
  }
  return { node };
}

export function $createLinkNode(
  {attributes}: {attributes?: LinkAttributes}
): LinkNode {
  return $applyNodeReplacement(new LinkNode({attributes: attributes}));
}

export function $isLinkNode(
  node: LexicalNode | null | undefined
): node is LinkNode {
  return node instanceof LinkNode;
}

export type SerializedAutoLinkNode = Spread<
  {
    type: "autolink";
    version: 1;
  },
  SerializedLinkNode
>;

// Custom node type to override `canInsertTextAfter` that will
// allow typing within the link
export class AutoLinkNode extends LinkNode {
  static getType(): string {
    return "autolink";
  }

  static clone(node: AutoLinkNode): AutoLinkNode {
    return new AutoLinkNode({attributes: node.__attributes, key: node.__key});
  }

  static importJSON(serializedNode: SerializedAutoLinkNode): AutoLinkNode {
    const node = $createAutoLinkNode({attributes: serializedNode.attributes});
    
    node.setFormat(serializedNode.format);
    node.setIndent(serializedNode.indent);
    node.setDirection(serializedNode.direction);
    return node;
  }

  static importDOM(): null {
    // TODO: Should link node should handle the import over autolink?
    return null;
  }

  exportJSON(): SerializedAutoLinkNode {
    return {
      ...super.exportJSON(),
      type: "autolink",
      version: 1,
    };
  }

  insertNewAfter(
    selection: RangeSelection,
    restoreSelection = true
  ): null | ElementNode {
    const element = this.getParentOrThrow().insertNewAfter(
      selection,
      restoreSelection
    );
    if ($isElementNode(element)) {
      const linkNode = $createAutoLinkNode({attributes: this.__attributes});
      element.append(linkNode);
      return linkNode;
    }
    return null;
  }
}

export function $createAutoLinkNode(
  {attributes}: {attributes?: LinkAttributes}
): AutoLinkNode {
  return $applyNodeReplacement(new AutoLinkNode({attributes: attributes}));
}
export function $isAutoLinkNode(
  node: LexicalNode | null | undefined
): node is AutoLinkNode {
  return node instanceof AutoLinkNode;
}

export const TOGGLE_LINK_COMMAND: LexicalCommand<LinkAttributes | null
> = createCommand("TOGGLE_LINK_COMMAND");

export function toggleLink(linkAttributes: LinkAttributes): void {

  const selection = $getSelection();

  if (!$isRangeSelection(selection)) {
    return;
  }
  const nodes = selection.extract();

  if (linkAttributes === null) {
    // Remove LinkNodes
    nodes.forEach((node) => {
      const parent = node.getParent();

      if ($isLinkNode(parent)) {
        const children = parent.getChildren();

        for (let i = 0; i < children.length; i += 1) {
          parent.insertBefore(children[i]);
        }

        parent.remove();
      }
    });
  } else {
    // Add or merge LinkNodes
    if (nodes.length === 1) {
      const firstNode = nodes[0];
      // if the first node is a LinkNode or if its
      // parent is a LinkNode, we update the URL, target and rel.
      const linkNode = $isLinkNode(firstNode)
        ? firstNode
        : $getLinkAncestor(firstNode);
      if (linkNode !== null) {     
        linkNode.setAttributes(linkAttributes);

        return;
      }
    }

    let prevParent: ElementNode | LinkNode | null = null;
    let linkNode: LinkNode | null = null;

    nodes.forEach((node) => {
      const parent = node.getParent();

      if (
        parent === linkNode ||
        parent === null ||
        ($isElementNode(node) && !node.isInline())
      ) {
        return;
      }

      if ($isLinkNode(parent)) {
        linkNode = parent;
        parent.setAttributes(linkAttributes)

        return;
      }

      if (!parent.is(prevParent)) {
        prevParent = parent;
        linkNode = $createLinkNode({attributes: linkAttributes});

        if ($isLinkNode(parent)) {
          if (node.getPreviousSibling() === null) {
            parent.insertBefore(linkNode);
          } else {
            parent.insertAfter(linkNode);
          }
        } else {
          node.insertBefore(linkNode);
        }
      }

      if ($isLinkNode(node)) {
        if (node.is(linkNode)) {
          return;
        }
        if (linkNode !== null) {
          const children = node.getChildren();

          for (let i = 0; i < children.length; i += 1) {
            linkNode.append(children[i]);
          }
        }

        node.remove();
        return;
      }

      if (linkNode !== null) {
        linkNode.append(node);
      }
    });
  }
}

function $getLinkAncestor(node: LexicalNode): null | LexicalNode {
  return $getAncestor(node, (ancestor) => $isLinkNode(ancestor));
}

function $getAncestor(
  node: LexicalNode,
  predicate: (ancestor: LexicalNode) => boolean
): null | LexicalNode {
  let parent: null | LexicalNode = node;
  while (
    parent !== null &&
    (parent = parent.getParent()) !== null &&
    !predicate(parent)
  );
  return parent;
}
