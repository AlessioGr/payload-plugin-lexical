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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Editor = void 0;
const LexicalAutoFocusPlugin_1 = require("@lexical/react/LexicalAutoFocusPlugin");
const LexicalCharacterLimitPlugin_1 = require("@lexical/react/LexicalCharacterLimitPlugin");
const LexicalCheckListPlugin_1 = require("@lexical/react/LexicalCheckListPlugin");
const LexicalClearEditorPlugin_1 = require("@lexical/react/LexicalClearEditorPlugin");
const LexicalErrorBoundary_1 = __importDefault(require("@lexical/react/LexicalErrorBoundary"));
const LexicalHashtagPlugin_1 = require("@lexical/react/LexicalHashtagPlugin");
const LexicalHistoryPlugin_1 = require("@lexical/react/LexicalHistoryPlugin");
const LexicalListPlugin_1 = require("@lexical/react/LexicalListPlugin");
const LexicalPlainTextPlugin_1 = require("@lexical/react/LexicalPlainTextPlugin");
const LexicalRichTextPlugin_1 = require("@lexical/react/LexicalRichTextPlugin");
const LexicalTablePlugin_1 = require("@lexical/react/LexicalTablePlugin");
const React = __importStar(require("react"));
const react_1 = require("react");
const LexicalOnChangePlugin_1 = require("@lexical/react/LexicalOnChangePlugin");
const LinkPlugin_1 = __importDefault(require("./plugins/LinkPlugin"));
const SettingsContext_1 = require("./context/SettingsContext");
const SharedHistoryContext_1 = require("./context/SharedHistoryContext");
const TableCellNodes_1 = __importDefault(require("./nodes/TableCellNodes"));
const ActionsPlugin_1 = __importDefault(require("./plugins/ActionsPlugin"));
const AutocompletePlugin_1 = __importDefault(require("./plugins/AutocompletePlugin"));
const AutoEmbedPlugin_1 = __importDefault(require("./plugins/AutoEmbedPlugin"));
const AutoLinkPlugin_1 = __importDefault(require("./plugins/AutoLinkPlugin"));
const ClickableLinkPlugin_1 = __importDefault(require("./plugins/ClickableLinkPlugin"));
const CodeActionMenuPlugin_1 = __importDefault(require("./plugins/CodeActionMenuPlugin"));
const CodeHighlightPlugin_1 = __importDefault(require("./plugins/CodeHighlightPlugin"));
const CollapsiblePlugin_1 = __importDefault(require("./plugins/CollapsiblePlugin"));
const ComponentPickerPlugin_1 = __importDefault(require("./plugins/ComponentPickerPlugin"));
const DragDropPastePlugin_1 = __importDefault(require("./plugins/DragDropPastePlugin"));
const DraggableBlockPlugin_1 = __importDefault(require("./plugins/DraggableBlockPlugin"));
const EmojiPickerPlugin_1 = __importDefault(require("./plugins/EmojiPickerPlugin"));
const EmojisPlugin_1 = __importDefault(require("./plugins/EmojisPlugin"));
const EquationsPlugin_1 = __importDefault(require("./plugins/EquationsPlugin"));
const FigmaPlugin_1 = __importDefault(require("./plugins/FigmaPlugin"));
const LinkEditorPlugin_1 = __importDefault(require("./plugins/LinkEditorPlugin"));
const FloatingTextFormatToolbarPlugin_1 = __importDefault(require("./plugins/FloatingTextFormatToolbarPlugin"));
const HorizontalRulePlugin_1 = __importDefault(require("./plugins/HorizontalRulePlugin"));
const KeywordsPlugin_1 = __importDefault(require("./plugins/KeywordsPlugin"));
const ListMaxIndentLevelPlugin_1 = __importDefault(require("./plugins/ListMaxIndentLevelPlugin"));
const MarkdownShortcutPlugin_1 = __importDefault(require("./plugins/MarkdownShortcutPlugin"));
const MaxLengthPlugin_1 = require("./plugins/MaxLengthPlugin");
const MentionsPlugin_1 = __importDefault(require("./plugins/MentionsPlugin"));
const SpeechToTextPlugin_1 = __importDefault(require("./plugins/SpeechToTextPlugin"));
const TabFocusPlugin_1 = __importDefault(require("./plugins/TabFocusPlugin"));
const TableActionMenuPlugin_1 = __importDefault(require("./plugins/TableActionMenuPlugin"));
const TableCellResizer_1 = __importDefault(require("./plugins/TableCellResizer"));
const TableOfContentsPlugin_1 = __importDefault(require("./plugins/TableOfContentsPlugin"));
const TablePlugin_1 = require("./plugins/TablePlugin");
const ToolbarPlugin_1 = __importDefault(require("./plugins/ToolbarPlugin"));
const TreeViewPlugin_1 = __importDefault(require("./plugins/TreeViewPlugin"));
const TwitterPlugin_1 = __importDefault(require("./plugins/TwitterPlugin"));
const YouTubePlugin_1 = __importDefault(require("./plugins/YouTubePlugin"));
const PlaygroundEditorTheme_1 = __importDefault(require("./themes/PlaygroundEditorTheme"));
const ContentEditable_1 = __importDefault(require("./ui/ContentEditable"));
const Placeholder_1 = __importDefault(require("./ui/Placeholder"));
const UploadPlugin_1 = __importDefault(require("./plugins/UploadPlugin"));
const Editor = (props) => {
    const { onChange, initialJSON, } = props;
    const { historyState } = (0, SharedHistoryContext_1.useSharedHistoryContext)();
    const { settings: { isAutocomplete, isMaxLength, isCharLimit, isCharLimitUtf8, isRichText, showTreeView, showTableOfContents, }, } = (0, SettingsContext_1.useSettings)();
    const text = isRichText
        ? 'Enter some rich text...'
        : 'Enter some plain text...';
    const placeholder = React.createElement(Placeholder_1.default, null, text);
    const [floatingAnchorElem, setFloatingAnchorElem] = (0, react_1.useState)(null);
    const onRef = (_floatingAnchorElem) => {
        if (_floatingAnchorElem !== null) {
            setFloatingAnchorElem(_floatingAnchorElem);
        }
    };
    const cellEditorConfig = {
        namespace: 'Playground',
        nodes: [...TableCellNodes_1.default],
        onError: (error) => {
            throw error;
        },
        theme: PlaygroundEditorTheme_1.default,
    };
    return (React.createElement(React.Fragment, null,
        isRichText && React.createElement(ToolbarPlugin_1.default, null),
        React.createElement("div", { className: `editor-container ${showTreeView ? 'tree-view' : ''} ${!isRichText ? 'plain-text' : ''}` },
            isMaxLength && React.createElement(MaxLengthPlugin_1.MaxLengthPlugin, { maxLength: 30 }),
            React.createElement(DragDropPastePlugin_1.default, null),
            React.createElement(LexicalAutoFocusPlugin_1.AutoFocusPlugin, null),
            React.createElement(LexicalClearEditorPlugin_1.ClearEditorPlugin, null),
            React.createElement(ComponentPickerPlugin_1.default, null),
            React.createElement(EmojiPickerPlugin_1.default, null),
            React.createElement(AutoEmbedPlugin_1.default, null),
            React.createElement(MentionsPlugin_1.default, null),
            React.createElement(EmojisPlugin_1.default, null),
            React.createElement(LexicalHashtagPlugin_1.HashtagPlugin, null),
            React.createElement(KeywordsPlugin_1.default, null),
            React.createElement(SpeechToTextPlugin_1.default, null),
            React.createElement(AutoLinkPlugin_1.default, null),
            isRichText ? (React.createElement(React.Fragment, null,
                React.createElement(LexicalHistoryPlugin_1.HistoryPlugin, { externalHistoryState: historyState }),
                React.createElement(LexicalRichTextPlugin_1.RichTextPlugin, { contentEditable: (React.createElement("div", { className: "editor-scroller" },
                        React.createElement("div", { className: "editor", ref: onRef },
                            React.createElement(ContentEditable_1.default, null)))), placeholder: placeholder, ErrorBoundary: LexicalErrorBoundary_1.default }),
                React.createElement(MarkdownShortcutPlugin_1.default, null),
                React.createElement(CodeHighlightPlugin_1.default, null),
                React.createElement(LexicalListPlugin_1.ListPlugin, null),
                React.createElement(LexicalCheckListPlugin_1.CheckListPlugin, null),
                React.createElement(ListMaxIndentLevelPlugin_1.default, { maxDepth: 7 }),
                React.createElement(LexicalTablePlugin_1.TablePlugin, null),
                React.createElement(TableCellResizer_1.default, null),
                React.createElement(TablePlugin_1.TablePlugin, { cellEditorConfig: cellEditorConfig },
                    React.createElement(LexicalAutoFocusPlugin_1.AutoFocusPlugin, null),
                    React.createElement(LexicalRichTextPlugin_1.RichTextPlugin, { contentEditable: React.createElement(ContentEditable_1.default, { className: "TableNode__contentEditable" }), placeholder: "", ErrorBoundary: LexicalErrorBoundary_1.default }),
                    React.createElement(MentionsPlugin_1.default, null),
                    React.createElement(LexicalHistoryPlugin_1.HistoryPlugin, null),
                    React.createElement(UploadPlugin_1.default, { captionsEnabled: false }),
                    React.createElement(LinkPlugin_1.default, null),
                    React.createElement(ClickableLinkPlugin_1.default, null),
                    React.createElement(FloatingTextFormatToolbarPlugin_1.default, null)),
                React.createElement(UploadPlugin_1.default, { captionsEnabled: false }),
                React.createElement(LinkPlugin_1.default, null),
                React.createElement(TwitterPlugin_1.default, null),
                React.createElement(YouTubePlugin_1.default, null),
                React.createElement(LexicalOnChangePlugin_1.OnChangePlugin, { onChange: (editorState, editor) => {
                        onChange(editorState, editor);
                    } }),
                React.createElement(FigmaPlugin_1.default, null),
                React.createElement(ClickableLinkPlugin_1.default, null),
                React.createElement(HorizontalRulePlugin_1.default, null),
                React.createElement(EquationsPlugin_1.default, null),
                React.createElement(TabFocusPlugin_1.default, null),
                React.createElement(CollapsiblePlugin_1.default, null),
                floatingAnchorElem && (React.createElement(React.Fragment, null,
                    React.createElement(DraggableBlockPlugin_1.default, { anchorElem: floatingAnchorElem }),
                    React.createElement(CodeActionMenuPlugin_1.default, { anchorElem: floatingAnchorElem }),
                    React.createElement(LinkEditorPlugin_1.default, { anchorElem: floatingAnchorElem }),
                    React.createElement(TableActionMenuPlugin_1.default, { anchorElem: floatingAnchorElem }),
                    React.createElement(FloatingTextFormatToolbarPlugin_1.default, { anchorElem: floatingAnchorElem }))))) : (React.createElement(React.Fragment, null,
                React.createElement(LexicalPlainTextPlugin_1.PlainTextPlugin, { contentEditable: React.createElement(ContentEditable_1.default, null), placeholder: placeholder, ErrorBoundary: LexicalErrorBoundary_1.default }),
                React.createElement(LexicalHistoryPlugin_1.HistoryPlugin, { externalHistoryState: historyState }))),
            (isCharLimit || isCharLimitUtf8) && (React.createElement(LexicalCharacterLimitPlugin_1.CharacterLimitPlugin, { charset: isCharLimit ? 'UTF-16' : 'UTF-8' })),
            isAutocomplete && React.createElement(AutocompletePlugin_1.default, null),
            React.createElement("div", null, showTableOfContents && React.createElement(TableOfContentsPlugin_1.default, null)),
            React.createElement(ActionsPlugin_1.default, { isRichText: isRichText })),
        showTreeView && React.createElement(TreeViewPlugin_1.default, null)));
};
exports.Editor = Editor;
//# sourceMappingURL=LexicalRichText.js.map