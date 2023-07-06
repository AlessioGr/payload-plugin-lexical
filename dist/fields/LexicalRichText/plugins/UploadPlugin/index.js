"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INSERT_IMAGE_COMMAND = void 0;
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const canUseDOM_1 = require("../../shared/canUseDOM");
const ImageNode_1 = require("../../nodes/ImageNode");
const getDOMSelection = (targetWindow) => canUseDOM_1.CAN_USE_DOM ? (targetWindow || window).getSelection() : null;
exports.INSERT_IMAGE_COMMAND = (0, lexical_1.createCommand)('INSERT_IMAGE_COMMAND');
function UploadPlugin({ captionsEnabled, }) {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => {
        if (!editor.hasNodes([ImageNode_1.ImageNode])) {
            throw new Error('ImagesPlugin: ImageNode not registered on editor');
        }
        return (0, utils_1.mergeRegister)(editor.registerCommand(exports.INSERT_IMAGE_COMMAND, (insertImagePayload) => {
            // This is run on the browser. Can't just use 'payload' object
            console.log('Received INSERT_IMAGE_COMMAND with payload', insertImagePayload);
            editor.update(() => {
                const imageNode = (0, ImageNode_1.$createImageNode)(insertImagePayload.rawImagePayload, {
                    widthOverride: undefined,
                    heightOverride: undefined,
                }, insertImagePayload === null || insertImagePayload === void 0 ? void 0 : insertImagePayload.showCaption, insertImagePayload === null || insertImagePayload === void 0 ? void 0 : insertImagePayload.caption, insertImagePayload === null || insertImagePayload === void 0 ? void 0 : insertImagePayload.captionsEnabled);
                (0, lexical_1.$insertNodes)([imageNode]);
                if ((0, lexical_1.$isRootOrShadowRoot)(imageNode.getParentOrThrow())) {
                    (0, utils_1.$wrapNodeInElement)(imageNode, lexical_1.$createParagraphNode).selectEnd();
                }
            });
            /*const relatedCollection = collections.find((coll) => {
              console.log('coll.slug', coll.slug, 'insertImagePayload.relationTo', insertImagePayload.relationTo);
              return coll.slug === insertImagePayload.relationTo;
            });
  
            requests.get(`${serverURL}${api}/${relatedCollection?.slug}/${insertImagePayload.value?.id}`, {
              headers: {
                'Accept-Language': i18n.language,
              },
            }).then((response) => {
              response.json().then((json) => {
                console.log('JSON', json);
  
                const imagePayload: ImagePayload = {
                  altText: json?.text,
                  height: json?.height,
                  maxWidth: json?.width,
                  src: json?.url,
                };
                console.log('image payload', imagePayload);
                editor.update(() => {
                  const imageNode = $createImageNode(imagePayload);
                  $insertNodes([imageNode]);
                  if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
                    $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
                  }
                });
              });
            });
  
  
            console.log('relatedCollection', relatedCollection);
  */
            /*
            const { collections, serverURL, routes: { api } } = payload.config;
            const relatedCollection = collections.find((coll) => coll.slug === insertImagePayload.relationTo);
  
            console.log('relatedCollection', relatedCollection);
  
            // Get the referenced document
            const foundReferencedUploadDocument = payload.find(
              {
                collection: relatedCollection.slug,
                where: {
                  id: {
                    equals: insertImagePayload.value
                  },
                },
              },
            );
  
            console.log('foundReferencedUploadDocument', foundReferencedUploadDocument);
  
  
            /* const imageNode = $createImageNode(payload);
            $insertNodes([imageNode]);
            if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
              $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
            } */
            return true;
        }, lexical_1.COMMAND_PRIORITY_EDITOR), editor.registerCommand(lexical_1.DRAGSTART_COMMAND, (event) => {
            return onDragStart(event);
        }, lexical_1.COMMAND_PRIORITY_HIGH), editor.registerCommand(lexical_1.DRAGOVER_COMMAND, (event) => {
            return onDragover(event);
        }, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.DROP_COMMAND, (event) => {
            return onDrop(event, editor);
        }, lexical_1.COMMAND_PRIORITY_HIGH));
    }, [captionsEnabled, editor]);
    return null;
}
exports.default = UploadPlugin;
const TRANSPARENT_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
let img = null;
function onDragStart(event) {
    const node = getImageNodeInSelection();
    if (!node) {
        return false;
    }
    const { dataTransfer } = event;
    if (!dataTransfer) {
        return false;
    }
    dataTransfer.setData('text/plain', '_');
    if (!img) {
        img = document.createElement('img');
        img.src = TRANSPARENT_IMAGE;
    }
    dataTransfer.setDragImage(img, 0, 0);
    dataTransfer.setData('application/x-lexical-drag', JSON.stringify({
        data: {
            rawImagePayload: node.__rawImagePayload,
            extraAttributes: node.__extraAttributes,
            key: node.getKey(),
        },
        type: 'upload',
    }));
    return true;
}
function onDragover(event) {
    const node = getImageNodeInSelection();
    if (!node) {
        return false;
    }
    if (!canDropImage(event)) {
        event.preventDefault();
    }
    return true;
}
function onDrop(event, editor) {
    const node = getImageNodeInSelection();
    if (!node) {
        return false;
    }
    const data = getDragImageData(event);
    if (!data) {
        return false;
    }
    event.preventDefault();
    if (canDropImage(event)) {
        const range = getDragSelection(event);
        node.remove();
        const rangeSelection = (0, lexical_1.$createRangeSelection)();
        if (range !== null && range !== undefined) {
            rangeSelection.applyDOMRange(range);
        }
        (0, lexical_1.$setSelection)(rangeSelection);
        editor.dispatchCommand(exports.INSERT_IMAGE_COMMAND, data);
    }
    return true;
}
function getImageNodeInSelection() {
    const selection = (0, lexical_1.$getSelection)();
    if (!(0, lexical_1.$isNodeSelection)(selection)) {
        return null;
    }
    const nodes = selection.getNodes();
    const node = nodes[0];
    return (0, ImageNode_1.$isImageNode)(node) ? node : null;
}
function getDragImageData(event) {
    var _a;
    const dragData = (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData('application/x-lexical-drag');
    if (!dragData) {
        return null;
    }
    const { type, data } = JSON.parse(dragData);
    if (type !== 'upload') {
        return null;
    }
    return data;
}
function canDropImage(event) {
    const { target } = event;
    return !!(target &&
        target instanceof HTMLElement &&
        !target.closest('code, span.editor-image') &&
        target.parentElement &&
        target.parentElement.closest('div.ContentEditable__root'));
}
function getDragSelection(event) {
    let range;
    const target = event.target;
    const targetWindow = target == null
        ? null
        : target.nodeType === 9
            ? target.defaultView
            : target.ownerDocument.defaultView;
    const domSelection = getDOMSelection(targetWindow);
    if (document.caretRangeFromPoint) {
        range = document.caretRangeFromPoint(event.clientX, event.clientY);
    }
    else if (event.rangeParent && domSelection !== null) {
        domSelection.collapse(event.rangeParent, event.rangeOffset || 0);
        range = domSelection.getRangeAt(0);
    }
    else {
        throw Error('Cannot get the selection when dragging');
    }
    return range;
}
//# sourceMappingURL=index.js.map