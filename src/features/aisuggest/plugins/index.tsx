/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  GridSelection,
  NodeKey,
  NodeSelection,
  RangeSelection,
} from 'lexical';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isAtNodeEnd } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import {
  $createTextNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  $setSelection,
  COMMAND_PRIORITY_LOW,
  KEY_ARROW_RIGHT_COMMAND,
  KEY_TAB_COMMAND,
} from 'lexical';
import { useCallback, useEffect, useState } from 'react';

import { useSharedAutocompleteContext } from '../../../fields/LexicalRichText/context/SharedAutocompleteContext';
import { $createAISuggestNode, AISuggestNode } from '../nodes/AISuggestNode';
import { addSwipeRightListener } from '../../../fields/LexicalRichText/utils/swipe';

type SearchPromise = {
  dismiss: () => void;
  promise: Promise<null | string>;
};

export const uuid = Math.random()
  .toString(36)
  .replace(/[^a-z]+/g, '')
  .substr(0, 5);

// TODO lookup should be custom
function $search(
  selection: null | RangeSelection | NodeSelection | GridSelection,
): [boolean, string] {
  if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
    return [false, ''];
  }
  const node = selection.getNodes()[0];
  /*const { anchor } = selection;
  // Check siblings?
  if (!$isTextNode(node) || !node.isSimpleText() || !$isAtNodeEnd(anchor)) {
    return [false, ''];
  }*/

  // Here we make sure to not only search the current node / paragraph, but also add
  // all the PREVIOUS text, if it is short enough.
  let text = node.getTextContent();

  const parentText =
    node?.getParent()?.getParent()?.getTextContent() ??
    node?.getParent()?.getTextContent();

  if (
    parentText &&
    parentText.length < 600 &&
    parentText.length > text?.length
  ) {
    // text is parent text UNTIL text:
    text =
      text && text.length > 0
        ? parentText.substring(0, parentText.indexOf(text)) + text
        : parentText;
  } else if ((!text || text.length < 5) && parentText.length >= 600) {
    // Use only the last 600 characters of the parent text
    // text = parentText.substring(parentText.length - 600);
    // TODO: This has 2 problems: (1) for some reason it repeats the query in an endless loop and (2) it may include text AFTER the current selection. There needs to be a solution better than parentText.indexOf(text) so that this elseif isn't even needed.
  }

  if (text.length < 5) {
    return [false, ''];
  }
  return [true, text];
}

// TODO query should be custom
function useQuery(): (searchText: string) => SearchPromise {
  return useCallback((searchText: string) => {
    const server = new AutocompleteServer();
    console.time('Lexical AI Suggest query');
    const response = server.query(searchText);
    console.timeEnd('Lexical AI Suggest query');
    return response;
  }, []);
}

export default function AISuggestPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [, setSuggestion] = useSharedAutocompleteContext();
  const query = useQuery();

  useEffect(() => {
    let aiSuggestNodeKey: null | NodeKey = null;
    let lastMatch: null | string = null;
    let lastSuggestion: null | string = null;
    let searchPromise: null | SearchPromise = null;
    let lastSearchMilis = -1;
    let counter = 0;

    function $clearSuggestion() {
      const aiSuggestNode =
        aiSuggestNodeKey !== null ? $getNodeByKey(aiSuggestNodeKey) : null;
      if (aiSuggestNode !== null && aiSuggestNode.isAttached()) {
        aiSuggestNode.remove();
        aiSuggestNodeKey = null;
      }
      if (searchPromise !== null) {
        searchPromise.dismiss();
        searchPromise = null;
      }
      lastMatch = null;
      lastSuggestion = null;
      setSuggestion(null);
    }

    function updateAsyncSuggestion(
      refSearchPromise: SearchPromise,
      newSuggestion: null | string,
      thisSuggestionCounter: number,
    ) {
      if (searchPromise !== refSearchPromise || newSuggestion === null) {
        // Outdated or no suggestion
        return;
      }
      editor.update(
        () => {
          const selection = $getSelection();
          const [hasMatch, match] = $search(selection);
          if (
            !hasMatch ||
            match !== lastMatch ||
            !$isRangeSelection(selection)
          ) {
            // Outdated
            return;
          }
          //console.log('lastSearchMilis', lastSearchMilis, 'Now: ', Date.now());
          if (Date.now() < lastSearchMilis) {
            // Search has been replaced by a better search
            return;
          }

          if (thisSuggestionCounter < counter - 1) {
            // Search is being replaced by a better search
            return;
          }
          const selectionCopy = selection.clone();
          const lastText = selectionCopy.getNodes()[0].getTextContent();

          newSuggestion = lastText.endsWith(' ')
            ? newSuggestion
            : newSuggestion?.startsWith(',') || newSuggestion?.startsWith('.')
            ? newSuggestion
            : ` ${newSuggestion}`;
          lastSuggestion = newSuggestion;
          setSuggestion(newSuggestion);

          const aiSuggestNode =
            aiSuggestNodeKey !== null ? $getNodeByKey(aiSuggestNodeKey) : null;
          if (aiSuggestNode !== null && aiSuggestNode.isAttached()) {
            aiSuggestNode.remove();
          }
          const node = $createAISuggestNode(uuid);
          aiSuggestNodeKey = node.getKey();
          selection.insertNodes([node]);
          $setSelection(selectionCopy);
        },
        { tag: 'history-merge' },
      );
    }

    function handleAISuggestNodeTransform(node: AISuggestNode) {
      const key = node.getKey();
      if (node.__uuid === uuid && key !== aiSuggestNodeKey) {
        // Max one Autocomplete node per session
        $clearSuggestion();
      }
    }
    function handleUpdate() {
      editor.update(() => {
        const selection = $getSelection();
        const [hasMatch, match] = $search(selection);
        if (!hasMatch) {
          $clearSuggestion();
          return;
        }
        if (match === lastMatch) {
          return;
        }

        handleActualUpdate(match);
      });
    }

    // Must be run from inside an editor.update()
    function handleActualUpdate(match: string) {
      $clearSuggestion();
      searchPromise = query(match);
      // Searching...
      lastSearchMilis = Date.now();
      const oldCounter = counter;
      counter++;

      searchPromise.promise
        .then((newSuggestion) => {
          if (searchPromise !== null) {
            updateAsyncSuggestion(searchPromise, newSuggestion, oldCounter);
          }
        })
        .catch((e) => {
          console.error(e);
        });
      lastMatch = match;
    }

    function $handleAISuggestIntent(): boolean {
      if (lastSuggestion === null || aiSuggestNodeKey === null) {
        return false;
      }
      const aiSuggestNode = $getNodeByKey(aiSuggestNodeKey);
      if (aiSuggestNode === null) {
        return false;
      }
      const textNode = $createTextNode(lastSuggestion);
      aiSuggestNode.replace(textNode);
      textNode.selectNext();
      $clearSuggestion();
      return true;
    }
    function $handleKeypressCommand(e: Event) {
      if ($handleAISuggestIntent()) {
        e.preventDefault();
        return true;
      }
      return false;
    }
    function handleSwipeRight(_force: number, e: TouchEvent) {
      editor.update(() => {
        if ($handleAISuggestIntent()) {
          e.preventDefault();
        }
      });
    }
    function unmountSuggestion() {
      editor.update(() => {
        $clearSuggestion();
      });
    }

    const rootElem = editor.getRootElement();

    return mergeRegister(
      editor.registerNodeTransform(AISuggestNode, handleAISuggestNodeTransform),
      editor.registerUpdateListener(handleUpdate),
      editor.registerCommand(
        KEY_TAB_COMMAND,
        $handleKeypressCommand,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ARROW_RIGHT_COMMAND,
        $handleKeypressCommand,
        COMMAND_PRIORITY_LOW,
      ),
      ...(rootElem !== null
        ? [addSwipeRightListener(rootElem, handleSwipeRight)]
        : []),
      unmountSuggestion,
    );
  }, [editor, query, setSuggestion]);

  return null;
}

/*
 * Simulate an asynchronous autocomplete server (typical in more common use cases like GMail where
 * the data is not static).
 */
class AutocompleteServer {
  LATENCY = 500;

  getMessage = async (searchText: string): Promise<string> => {
    // make request to our /openai-completion endpoint
    const response = await fetch(
      `/api/openai-completion?text=${encodeURIComponent(searchText)}`,
      {
        method: 'GET',
      },
    );
    const json = await response.json();
    const match = json?.match;

    return match;
  };

  query = (searchText: string): SearchPromise => {
    let isDismissed = false;

    const dismiss = () => {
      isDismissed = true;
    };
    const promise: Promise<null | string> = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (isDismissed) {
          // TODO cache result
          return reject('Dismissed');
        }
        const searchTextLength = searchText.length;
        if (searchText === '' || searchTextLength < 4) {
          return resolve(null);
        }

        const messagePromise = this.getMessage(searchText);

        if (messagePromise === undefined) {
          return resolve(null);
        }

        resolve(messagePromise);
      }, this.LATENCY);
    });

    return {
      dismiss,
      promise,
    };
  };
}
