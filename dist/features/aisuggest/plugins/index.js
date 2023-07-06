"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuid = void 0;
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const SharedAutocompleteContext_1 = require("../../../fields/LexicalRichText/context/SharedAutocompleteContext");
const AISuggestNode_1 = require("../nodes/AISuggestNode");
const swipe_1 = require("../../../fields/LexicalRichText/utils/swipe");
exports.uuid = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 5);
// TODO lookup should be custom
function $search(selection) {
    var _a, _b, _c, _d;
    if (!(0, lexical_1.$isRangeSelection)(selection) || !selection.isCollapsed()) {
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
    const parentText = (_c = (_b = (_a = node === null || node === void 0 ? void 0 : node.getParent()) === null || _a === void 0 ? void 0 : _a.getParent()) === null || _b === void 0 ? void 0 : _b.getTextContent()) !== null && _c !== void 0 ? _c : (_d = node === null || node === void 0 ? void 0 : node.getParent()) === null || _d === void 0 ? void 0 : _d.getTextContent();
    if (parentText &&
        parentText.length < 600 &&
        parentText.length > (text === null || text === void 0 ? void 0 : text.length)) {
        // text is parent text UNTIL text:
        text =
            text && text.length > 0
                ? parentText.substring(0, parentText.indexOf(text)) + text
                : parentText;
    }
    else if ((!text || text.length < 5) && parentText.length >= 600) {
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
function useQuery() {
    return (0, react_1.useCallback)((searchText) => {
        const server = new AutocompleteServer();
        console.time('Lexical AI Suggest query');
        const response = server.query(searchText);
        console.timeEnd('Lexical AI Suggest query');
        return response;
    }, []);
}
function AISuggestPlugin() {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [, setSuggestion] = (0, SharedAutocompleteContext_1.useSharedAutocompleteContext)();
    const query = useQuery();
    (0, react_1.useEffect)(() => {
        let aiSuggestNodeKey = null;
        let lastMatch = null;
        let lastSuggestion = null;
        let searchPromise = null;
        let lastSearchMilis = -1;
        let counter = 0;
        function $clearSuggestion() {
            const aiSuggestNode = aiSuggestNodeKey !== null ? (0, lexical_1.$getNodeByKey)(aiSuggestNodeKey) : null;
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
        function updateAsyncSuggestion(refSearchPromise, newSuggestion, thisSuggestionCounter) {
            if (searchPromise !== refSearchPromise || newSuggestion === null) {
                // Outdated or no suggestion
                return;
            }
            editor.update(() => {
                const selection = (0, lexical_1.$getSelection)();
                const [hasMatch, match] = $search(selection);
                if (!hasMatch ||
                    match !== lastMatch ||
                    !(0, lexical_1.$isRangeSelection)(selection)) {
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
                    : (newSuggestion === null || newSuggestion === void 0 ? void 0 : newSuggestion.startsWith(',')) || (newSuggestion === null || newSuggestion === void 0 ? void 0 : newSuggestion.startsWith('.'))
                        ? newSuggestion
                        : ` ${newSuggestion}`;
                lastSuggestion = newSuggestion;
                setSuggestion(newSuggestion);
                const aiSuggestNode = aiSuggestNodeKey !== null ? (0, lexical_1.$getNodeByKey)(aiSuggestNodeKey) : null;
                if (aiSuggestNode !== null && aiSuggestNode.isAttached()) {
                    aiSuggestNode.remove();
                }
                const node = (0, AISuggestNode_1.$createAISuggestNode)(exports.uuid);
                aiSuggestNodeKey = node.getKey();
                selection.insertNodes([node]);
                (0, lexical_1.$setSelection)(selectionCopy);
            }, { tag: 'history-merge' });
        }
        function handleAISuggestNodeTransform(node) {
            const key = node.getKey();
            if (node.__uuid === exports.uuid && key !== aiSuggestNodeKey) {
                // Max one Autocomplete node per session
                $clearSuggestion();
            }
        }
        function handleUpdate() {
            editor.update(() => {
                const selection = (0, lexical_1.$getSelection)();
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
        function handleActualUpdate(match) {
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
        function $handleAISuggestIntent() {
            if (lastSuggestion === null || aiSuggestNodeKey === null) {
                return false;
            }
            const aiSuggestNode = (0, lexical_1.$getNodeByKey)(aiSuggestNodeKey);
            if (aiSuggestNode === null) {
                return false;
            }
            const textNode = (0, lexical_1.$createTextNode)(lastSuggestion);
            aiSuggestNode.replace(textNode);
            textNode.selectNext();
            $clearSuggestion();
            return true;
        }
        function $handleKeypressCommand(e) {
            if ($handleAISuggestIntent()) {
                e.preventDefault();
                return true;
            }
            return false;
        }
        function handleSwipeRight(_force, e) {
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
        return (0, utils_1.mergeRegister)(editor.registerNodeTransform(AISuggestNode_1.AISuggestNode, handleAISuggestNodeTransform), editor.registerUpdateListener(handleUpdate), editor.registerCommand(lexical_1.KEY_TAB_COMMAND, $handleKeypressCommand, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_ARROW_RIGHT_COMMAND, $handleKeypressCommand, lexical_1.COMMAND_PRIORITY_LOW), ...(rootElem !== null
            ? [(0, swipe_1.addSwipeRightListener)(rootElem, handleSwipeRight)]
            : []), unmountSuggestion);
    }, [editor, query, setSuggestion]);
    return null;
}
exports.default = AISuggestPlugin;
/*
 * Simulate an asynchronous autocomplete server (typical in more common use cases like GMail where
 * the data is not static).
 */
class AutocompleteServer {
    constructor() {
        this.LATENCY = 500;
        this.getMessage = (searchText) => __awaiter(this, void 0, void 0, function* () {
            // make request to our /openai-completion endpoint
            const response = yield fetch(`/api/openai-completion?text=${encodeURIComponent(searchText)}`, {
                method: 'GET',
            });
            const json = yield response.json();
            const match = json === null || json === void 0 ? void 0 : json.match;
            return match;
        });
        this.query = (searchText) => {
            let isDismissed = false;
            const dismiss = () => {
                isDismissed = true;
            };
            const promise = new Promise((resolve, reject) => {
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
}
//# sourceMappingURL=index.js.map