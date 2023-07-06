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
require("./ImageNode.scss");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const LexicalErrorBoundary_1 = __importDefault(require("@lexical/react/LexicalErrorBoundary"));
const LexicalHashtagPlugin_1 = require("@lexical/react/LexicalHashtagPlugin");
const LexicalHistoryPlugin_1 = require("@lexical/react/LexicalHistoryPlugin");
const LexicalNestedComposer_1 = require("@lexical/react/LexicalNestedComposer");
const LexicalRichTextPlugin_1 = require("@lexical/react/LexicalRichTextPlugin");
const useLexicalNodeSelection_1 = require("@lexical/react/useLexicalNodeSelection");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const React = __importStar(require("react"));
const react_1 = require("react");
const SharedHistoryContext_1 = require("../context/SharedHistoryContext");
const plugins_1 = __importDefault(require("../../../features/debug/treeview/plugins"));
const ContentEditable_1 = __importDefault(require("../ui/ContentEditable"));
const ImageResizer_1 = __importDefault(require("../ui/ImageResizer"));
const Placeholder_1 = __importDefault(require("../ui/Placeholder"));
const ImageNode_1 = require("./ImageNode");
const LexicalEditorComponent_1 = require("../LexicalEditorComponent");
const Settings_1 = require("../settings/Settings");
const imageCache = new Set();
function useSuspenseImage(src) {
    if (!imageCache.has(src)) {
        throw new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                imageCache.add(src);
                resolve(null);
            };
        });
    }
}
function LazyImage({ altText, className, imageRef, src, width, height, maxWidth, }) {
    useSuspenseImage(src);
    return (React.createElement("img", { className: className || undefined, src: src, alt: altText, ref: imageRef, style: {
            height,
            maxWidth,
            width,
        }, draggable: "false" }));
}
function ImageComponent({ src, altText, nodeKey, width, height, maxWidth, resizable, showCaption, caption, captionsEnabled, }) {
    const imageRef = (0, react_1.useRef)(null);
    const buttonRef = (0, react_1.useRef)(null);
    const [isSelected, setSelected, clearSelection] = (0, useLexicalNodeSelection_1.useLexicalNodeSelection)(nodeKey);
    const [isResizing, setIsResizing] = (0, react_1.useState)(false);
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [selection, setSelection] = (0, react_1.useState)(null);
    const activeEditorRef = (0, react_1.useRef)(null);
    const onDelete = (0, react_1.useCallback)((payload) => {
        if (isSelected && (0, lexical_1.$isNodeSelection)((0, lexical_1.$getSelection)())) {
            const event = payload;
            event.preventDefault();
            const node = (0, lexical_1.$getNodeByKey)(nodeKey);
            if ((0, ImageNode_1.$isImageNode)(node)) {
                node.remove();
            }
            setSelected(false);
        }
        return false;
    }, [isSelected, nodeKey, setSelected]);
    const onEnter = (0, react_1.useCallback)((event) => {
        const latestSelection = (0, lexical_1.$getSelection)();
        const buttonElem = buttonRef.current;
        if (isSelected &&
            (0, lexical_1.$isNodeSelection)(latestSelection) &&
            latestSelection.getNodes().length === 1) {
            if (showCaption) {
                // Move focus into nested editor
                (0, lexical_1.$setSelection)(null);
                event.preventDefault();
                caption.focus();
                return true;
            }
            if (buttonElem !== null && buttonElem !== document.activeElement) {
                event.preventDefault();
                buttonElem.focus();
                return true;
            }
        }
        return false;
    }, [caption, isSelected, showCaption]);
    const onEscape = (0, react_1.useCallback)((event) => {
        if (activeEditorRef.current === caption ||
            buttonRef.current === event.target) {
            (0, lexical_1.$setSelection)(null);
            editor.update(() => {
                setSelected(true);
                const parentRootElement = editor.getRootElement();
                if (parentRootElement !== null) {
                    parentRootElement.focus();
                }
            });
            return true;
        }
        return false;
    }, [caption, editor, setSelected]);
    (0, react_1.useEffect)(() => {
        let isMounted = true;
        const unregister = (0, utils_1.mergeRegister)(editor.registerUpdateListener(({ editorState }) => {
            if (isMounted) {
                setSelection(editorState.read(() => (0, lexical_1.$getSelection)()));
            }
        }), editor.registerCommand(lexical_1.SELECTION_CHANGE_COMMAND, (_, activeEditor) => {
            activeEditorRef.current = activeEditor;
            return false;
        }, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.CLICK_COMMAND, (payload) => {
            const event = payload;
            if (isResizing) {
                return true;
            }
            if (event.target === imageRef.current) {
                if (event.shiftKey) {
                    setSelected(!isSelected);
                }
                else {
                    clearSelection();
                    setSelected(true);
                }
                return true;
            }
            return false;
        }, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.DRAGSTART_COMMAND, (event) => {
            if (event.target === imageRef.current) {
                // TODO This is just a temporary workaround for FF to behave like other browsers.
                // Ideally, this handles drag & drop too (and all browsers).
                event.preventDefault();
                return true;
            }
            return false;
        }, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_DELETE_COMMAND, onDelete, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_BACKSPACE_COMMAND, onDelete, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_ENTER_COMMAND, onEnter, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_ESCAPE_COMMAND, onEscape, lexical_1.COMMAND_PRIORITY_LOW));
        return () => {
            isMounted = false;
            unregister();
        };
    }, [
        clearSelection,
        editor,
        isResizing,
        isSelected,
        nodeKey,
        onDelete,
        onEnter,
        onEscape,
        setSelected,
    ]);
    const setShowCaption = () => {
        editor.update(() => {
            const node = (0, lexical_1.$getNodeByKey)(nodeKey);
            if ((0, ImageNode_1.$isImageNode)(node)) {
                node.setShowCaption(true);
            }
        });
    };
    const onResizeEnd = (nextWidth, nextHeight) => {
        // Delay hiding the resize bars for click case
        setTimeout(() => {
            setIsResizing(false);
        }, 200);
        editor.update(() => {
            const node = (0, lexical_1.$getNodeByKey)(nodeKey);
            if ((0, ImageNode_1.$isImageNode)(node)) {
                node.setWidthAndHeightOverride(nextWidth, nextHeight);
            }
        });
    };
    const onResizeStart = () => {
        setIsResizing(true);
    };
    const { historyState } = (0, SharedHistoryContext_1.useSharedHistoryContext)();
    const { showNestedEditorTreeView } = Settings_1.Settings;
    const draggable = isSelected && (0, lexical_1.$isNodeSelection)(selection) && !isResizing;
    const isFocused = isSelected || isResizing;
    const { editorConfig } = (0, LexicalEditorComponent_1.useEditorConfigContext)();
    return (React.createElement(react_1.Suspense, { fallback: null },
        React.createElement(React.Fragment, null,
            React.createElement("div", { draggable: draggable },
                React.createElement(LazyImage, { className: isFocused
                        ? `focused ${(0, lexical_1.$isNodeSelection)(selection) ? 'draggable' : ''}`
                        : null, src: src, altText: altText, imageRef: imageRef, width: width, height: height, maxWidth: maxWidth })),
            showCaption && (React.createElement("div", { className: "image-caption-container" },
                React.createElement(LexicalNestedComposer_1.LexicalNestedComposer, { initialEditor: caption },
                    editorConfig.features.map((feature) => {
                        if (feature.subEditorPlugins &&
                            feature.subEditorPlugins.length > 0) {
                            return feature.subEditorPlugins.map((subEditorPlugin) => {
                                return subEditorPlugin;
                            });
                        }
                    }),
                    React.createElement(LexicalHashtagPlugin_1.HashtagPlugin, null),
                    React.createElement(LexicalHistoryPlugin_1.HistoryPlugin, { externalHistoryState: historyState }),
                    React.createElement(LexicalRichTextPlugin_1.RichTextPlugin, { contentEditable: React.createElement(ContentEditable_1.default, { className: "ImageNode__contentEditable" }), placeholder: React.createElement(Placeholder_1.default, { className: "ImageNode__placeholder" }, "Enter a caption..."), ErrorBoundary: LexicalErrorBoundary_1.default }),
                    showNestedEditorTreeView === true ? React.createElement(plugins_1.default, null) : null))),
            resizable && (0, lexical_1.$isNodeSelection)(selection) && isFocused && (React.createElement(ImageResizer_1.default, { showCaption: showCaption, setShowCaption: setShowCaption, editor: editor, buttonRef: buttonRef, imageRef: imageRef, maxWidth: maxWidth, onResizeStart: onResizeStart, onResizeEnd: onResizeEnd, captionsEnabled: captionsEnabled })))));
}
exports.default = ImageComponent;
//# sourceMappingURL=ImageComponent.js.map