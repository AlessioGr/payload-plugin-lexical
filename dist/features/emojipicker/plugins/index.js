"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const LexicalTypeaheadMenuPlugin_1 = require("@lexical/react/LexicalTypeaheadMenuPlugin");
const lexical_1 = require("lexical");
const React = __importStar(require("react"));
const react_1 = require("react");
const ReactDOM = __importStar(require("react-dom"));
require("./index.scss");
class EmojiOption extends LexicalTypeaheadMenuPlugin_1.TypeaheadOption {
    constructor(title, emoji, options) {
        super(title);
        this.title = title;
        this.emoji = emoji;
        this.keywords = options.keywords || [];
    }
}
function EmojiMenuItem({ index, isSelected, onClick, onMouseEnter, option, }) {
    let className = 'item';
    if (isSelected) {
        className += ' selected';
    }
    return (React.createElement("li", { key: option.key, tabIndex: -1, className: className, ref: option.setRefElement, role: "option", "aria-selected": isSelected, id: `typeahead-item-${index}`, onMouseEnter: onMouseEnter, onClick: onClick },
        React.createElement("span", { className: "text" },
            option.emoji,
            " ",
            option.title)));
}
const MAX_EMOJI_SUGGESTION_COUNT = 10;
function EmojiPickerPlugin() {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [queryString, setQueryString] = (0, react_1.useState)(null);
    const [emojis, setEmojis] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        // @ts-ignore
        Promise.resolve().then(() => __importStar(require('./emoji-list'))).then((file) => setEmojis(file.default));
    }, []);
    const emojiOptions = (0, react_1.useMemo)(() => emojis != null
        ? emojis.map(({ emoji, aliases, tags }) => new EmojiOption(aliases[0], emoji, {
            keywords: [...aliases, ...tags],
        }))
        : [], [emojis]);
    const checkForTriggerMatch = (0, LexicalTypeaheadMenuPlugin_1.useBasicTypeaheadTriggerMatch)(':', {
        minLength: 0,
    });
    const options = (0, react_1.useMemo)(() => {
        return emojiOptions
            .filter((option) => {
            return queryString != null
                ? new RegExp(queryString, 'gi').exec(option.title) ||
                    option.keywords != null
                    ? option.keywords.some((keyword) => new RegExp(queryString, 'gi').exec(keyword))
                    : false
                : emojiOptions;
        })
            .slice(0, MAX_EMOJI_SUGGESTION_COUNT);
    }, [emojiOptions, queryString]);
    const onSelectOption = (0, react_1.useCallback)((selectedOption, nodeToRemove, closeMenu) => {
        editor.update(() => {
            const selection = (0, lexical_1.$getSelection)();
            if (!(0, lexical_1.$isRangeSelection)(selection) || selectedOption == null) {
                return;
            }
            if (nodeToRemove) {
                nodeToRemove.remove();
            }
            selection.insertNodes([(0, lexical_1.$createTextNode)(selectedOption.emoji)]);
            closeMenu();
        });
    }, [editor]);
    return (React.createElement(LexicalTypeaheadMenuPlugin_1.LexicalTypeaheadMenuPlugin, { onQueryChange: setQueryString, onSelectOption: onSelectOption, triggerFn: checkForTriggerMatch, options: options, menuRenderFn: (anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) => {
            if (anchorElementRef.current == null || options.length === 0) {
                return null;
            }
            return anchorElementRef.current && options.length
                ? ReactDOM.createPortal(React.createElement("div", { className: "typeahead-popover emoji-menu" },
                    React.createElement("ul", null, options.map((option, index) => (React.createElement("div", { key: option.key },
                        React.createElement(EmojiMenuItem, { index: index, isSelected: selectedIndex === index, onClick: () => {
                                setHighlightedIndex(index);
                                selectOptionAndCleanUp(option);
                            }, onMouseEnter: () => {
                                setHighlightedIndex(index);
                            }, option: option })))))), anchorElementRef.current)
                : null;
        } }));
}
exports.default = EmojiPickerPlugin;
//# sourceMappingURL=index.js.map