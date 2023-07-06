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
const canUseDOM_1 = require("./shared/canUseDOM");
const OnChangePlugin_1 = require("./plugins/OnChangePlugin");
const SharedHistoryContext_1 = require("./context/SharedHistoryContext");
const TableCellNodes_1 = __importDefault(require("./nodes/TableCellNodes"));
const ActionsPlugin_1 = __importDefault(require("./plugins/ActionsPlugin"));
const AutoEmbedPlugin_1 = __importDefault(require("./plugins/AutoEmbedPlugin"));
const CodeActionMenuPlugin_1 = __importDefault(require("./plugins/CodeActionMenuPlugin"));
const CodeHighlightPlugin_1 = __importDefault(require("./plugins/CodeHighlightPlugin"));
const ComponentPickerPlugin_1 = __importDefault(require("./plugins/ComponentPickerPlugin"));
const DragDropPastePlugin_1 = __importDefault(require("./plugins/DragDropPastePlugin"));
const DraggableBlockPlugin_1 = __importDefault(require("./plugins/DraggableBlockPlugin"));
const FloatingTextFormatToolbarPlugin_1 = __importDefault(require("./plugins/FloatingTextFormatToolbarPlugin"));
const ListMaxIndentLevelPlugin_1 = __importDefault(require("./plugins/ListMaxIndentLevelPlugin"));
const MarkdownShortcutPlugin_1 = __importDefault(require("./plugins/MarkdownShortcutPlugin"));
const TabFocusPlugin_1 = __importDefault(require("./plugins/TabFocusPlugin"));
const TableActionMenuPlugin_1 = __importDefault(require("./plugins/TableActionMenuPlugin"));
const TableCellResizer_1 = __importDefault(require("./plugins/TableCellResizer"));
const TablePlugin_1 = require("./plugins/TablePlugin");
const ToolbarPlugin_1 = __importDefault(require("./plugins/ToolbarPlugin"));
const PlaygroundEditorTheme_1 = __importDefault(require("./themes/PlaygroundEditorTheme"));
const ContentEditable_1 = __importDefault(require("./ui/ContentEditable"));
const Placeholder_1 = __importDefault(require("./ui/Placeholder"));
const UploadPlugin_1 = __importDefault(require("./plugins/UploadPlugin"));
const LexicalTabIndentationPlugin_1 = require("@lexical/react/LexicalTabIndentationPlugin");
const ModalPlugin_1 = __importDefault(require("./plugins/ModalPlugin"));
const CommentPlugin_1 = __importDefault(require("./plugins/CommentPlugin"));
const Settings_1 = require("./settings/Settings");
const useLexicalEditable_1 = __importDefault(require("@lexical/react/useLexicalEditable"));
const Editor = (props) => {
    const { onChange, initialJSON, editorConfig, initialComments, value, setValue, } = props;
    const { historyState } = (0, SharedHistoryContext_1.useSharedHistoryContext)();
    const { isRichText, isCharLimit, isCharLimitUtf8, tableCellMerge, tableCellBackgroundColor, } = Settings_1.Settings;
    const isEditable = (0, useLexicalEditable_1.default)();
    const text = isRichText
        ? 'Enter some rich text...'
        : 'Enter some plain text...';
    const placeholder = React.createElement(Placeholder_1.default, null, text);
    const [floatingAnchorElem, setFloatingAnchorElem] = (0, react_1.useState)(null);
    const [isSmallWidthViewport, setIsSmallWidthViewport] = (0, react_1.useState)(false);
    const onRef = (_floatingAnchorElem) => {
        if (_floatingAnchorElem !== null) {
            setFloatingAnchorElem(_floatingAnchorElem);
        }
    };
    const cellEditorConfig = {
        namespace: 'Playground',
        nodes: [...(0, TableCellNodes_1.default)(editorConfig)],
        onError: (error) => {
            throw error;
        },
        theme: PlaygroundEditorTheme_1.default,
    };
    (0, react_1.useEffect)(() => {
        const updateViewPortWidth = () => {
            const isNextSmallWidthViewport = canUseDOM_1.CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches;
            if (isNextSmallWidthViewport !== isSmallWidthViewport) {
                setIsSmallWidthViewport(isNextSmallWidthViewport);
            }
        };
        window.addEventListener('resize', updateViewPortWidth);
        return () => {
            window.removeEventListener('resize', updateViewPortWidth);
        };
    }, [isSmallWidthViewport]);
    let hasAnyActionButtons = false;
    editorConfig.features.forEach((feature) => {
        if (feature.actions && feature.actions.length > 0) {
            hasAnyActionButtons = true;
        }
    });
    return (React.createElement(React.Fragment, null,
        React.createElement(ModalPlugin_1.default, { editorConfig: editorConfig }),
        isRichText && React.createElement(ToolbarPlugin_1.default, { editorConfig: editorConfig }),
        React.createElement("div", { className: `editor-container ${editorConfig.debug ? 'tree-view' : ''} ${!isRichText ? 'plain-text' : ''}` },
            editorConfig.features.map((feature) => {
                if (feature.plugins && feature.plugins.length > 0) {
                    return feature.plugins.map((plugin) => {
                        if (!plugin.position || plugin.position === 'normal') {
                            if (!plugin.onlyIfNotEditable) {
                                return plugin.component;
                            }
                            else {
                                return !isEditable && plugin.component;
                            }
                        }
                    });
                }
            }),
            React.createElement(DragDropPastePlugin_1.default, null),
            React.createElement(LexicalClearEditorPlugin_1.ClearEditorPlugin, null),
            React.createElement(ComponentPickerPlugin_1.default, { editorConfig: editorConfig }),
            React.createElement(AutoEmbedPlugin_1.default, { editorConfig: editorConfig }),
            React.createElement(LexicalHashtagPlugin_1.HashtagPlugin, null),
            editorConfig.toggles.comments.enabled && React.createElement(CommentPlugin_1.default, null),
            isRichText ? (React.createElement(React.Fragment, null,
                React.createElement(LexicalHistoryPlugin_1.HistoryPlugin, { externalHistoryState: historyState }),
                React.createElement(LexicalRichTextPlugin_1.RichTextPlugin, { contentEditable: React.createElement("div", { className: "editor-scroller" },
                        React.createElement("div", { className: "editor", ref: onRef },
                            React.createElement(ContentEditable_1.default, null))), placeholder: placeholder, ErrorBoundary: LexicalErrorBoundary_1.default }),
                React.createElement(MarkdownShortcutPlugin_1.default, { editorConfig: editorConfig }),
                React.createElement(CodeHighlightPlugin_1.default, null),
                React.createElement(LexicalListPlugin_1.ListPlugin, null),
                React.createElement(LexicalCheckListPlugin_1.CheckListPlugin, null),
                React.createElement(ListMaxIndentLevelPlugin_1.default, { maxDepth: 7 }),
                editorConfig.toggles.tables.enabled && (React.createElement(LexicalTablePlugin_1.TablePlugin, { hasCellMerge: tableCellMerge, hasCellBackgroundColor: tableCellBackgroundColor })),
                editorConfig.toggles.tables.enabled && React.createElement(TableCellResizer_1.default, null),
                editorConfig.toggles.tables.enabled && (React.createElement(TablePlugin_1.TablePlugin, { cellEditorConfig: cellEditorConfig },
                    React.createElement(LexicalRichTextPlugin_1.RichTextPlugin, { contentEditable: React.createElement(ContentEditable_1.default, { className: "TableNode__contentEditable" }), placeholder: null, ErrorBoundary: LexicalErrorBoundary_1.default }),
                    React.createElement(React.Fragment, null, editorConfig.features.map((feature) => {
                        if (feature.tablePlugins &&
                            feature.tablePlugins.length > 0) {
                            return feature.tablePlugins.map((tablePlugin) => {
                                return tablePlugin;
                            });
                        }
                    })),
                    React.createElement(LexicalHistoryPlugin_1.HistoryPlugin, null),
                    React.createElement(UploadPlugin_1.default, { captionsEnabled: false }),
                    React.createElement(FloatingTextFormatToolbarPlugin_1.default, { editorConfig: editorConfig }))),
                editorConfig.toggles.upload.enabled && (React.createElement(UploadPlugin_1.default, { captionsEnabled: false })),
                React.createElement(OnChangePlugin_1.OnChangePlugin, { onChange: (editorState, editor, tags, commentStore) => {
                        onChange(editorState, editor, tags, commentStore);
                    }, value: value }),
                React.createElement(TabFocusPlugin_1.default, null),
                React.createElement(LexicalTabIndentationPlugin_1.TabIndentationPlugin, null),
                floatingAnchorElem && !isSmallWidthViewport && (React.createElement(React.Fragment, null,
                    React.createElement(DraggableBlockPlugin_1.default, { anchorElem: floatingAnchorElem }),
                    React.createElement(CodeActionMenuPlugin_1.default, { anchorElem: floatingAnchorElem }),
                    editorConfig.features.map((feature) => {
                        if (feature.floatingAnchorElemPlugins &&
                            feature.floatingAnchorElemPlugins.length > 0) {
                            return feature.floatingAnchorElemPlugins.map((plugin) => {
                                return plugin(floatingAnchorElem);
                            });
                        }
                    }),
                    editorConfig.toggles.tables.enabled && (React.createElement(TableActionMenuPlugin_1.default, { anchorElem: floatingAnchorElem, cellMerge: true })),
                    React.createElement(FloatingTextFormatToolbarPlugin_1.default, { anchorElem: floatingAnchorElem, editorConfig: editorConfig }))))) : (React.createElement(React.Fragment, null,
                React.createElement(LexicalPlainTextPlugin_1.PlainTextPlugin, { contentEditable: React.createElement(ContentEditable_1.default, null), placeholder: placeholder, ErrorBoundary: LexicalErrorBoundary_1.default }),
                React.createElement(LexicalHistoryPlugin_1.HistoryPlugin, { externalHistoryState: historyState }))),
            (isCharLimit || isCharLimitUtf8) && (React.createElement(LexicalCharacterLimitPlugin_1.CharacterLimitPlugin, { charset: isCharLimit ? 'UTF-16' : 'UTF-8', maxLength: 5 })),
            editorConfig.features.map((feature) => {
                if (feature.plugins && feature.plugins.length > 0) {
                    return feature.plugins.map((plugin) => {
                        if (plugin.position === 'bottomInContainer') {
                            if (!plugin.onlyIfNotEditable) {
                                return plugin.component;
                            }
                            else {
                                return !isEditable && plugin.component;
                            }
                        }
                    });
                }
            }),
            hasAnyActionButtons && (React.createElement(ActionsPlugin_1.default, { isRichText: isRichText, editorConfig: editorConfig }))),
        editorConfig.features.map((feature) => {
            if (feature.plugins && feature.plugins.length > 0) {
                return feature.plugins.map((plugin) => {
                    if (plugin.position === 'bottom') {
                        if (!plugin.onlyIfNotEditable) {
                            return plugin.component;
                        }
                        else {
                            return !isEditable && plugin.component;
                        }
                    }
                });
            }
        })));
};
exports.Editor = Editor;
//# sourceMappingURL=LexicalRichText.js.map