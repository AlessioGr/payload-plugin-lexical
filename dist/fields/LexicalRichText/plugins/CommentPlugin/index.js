"use strict";
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
exports.useCommentsContext = exports.CommentsContext = exports.INSERT_INLINE_COMMAND = void 0;
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
const react_1 = require("react");
require("./index.scss");
require("./modal.scss");
const mark_1 = require("@lexical/mark");
const LexicalClearEditorPlugin_1 = require("@lexical/react/LexicalClearEditorPlugin");
const LexicalComposer_1 = require("@lexical/react/LexicalComposer");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const LexicalErrorBoundary_1 = __importDefault(require("@lexical/react/LexicalErrorBoundary"));
const LexicalHistoryPlugin_1 = require("@lexical/react/LexicalHistoryPlugin");
const LexicalOnChangePlugin_1 = require("@lexical/react/LexicalOnChangePlugin");
const LexicalPlainTextPlugin_1 = require("@lexical/react/LexicalPlainTextPlugin");
const selection_1 = require("@lexical/selection");
const text_1 = require("@lexical/text");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_2 = require("react");
const React = __importStar(require("react"));
const react_dom_1 = require("react-dom");
const useLayoutEffect_1 = __importDefault(require("../../shared/useLayoutEffect"));
const commenting_1 = require("../../commenting");
const CommentEditorTheme_1 = __importDefault(require("../../themes/CommentEditorTheme"));
const Button_1 = __importDefault(require("payload/dist/admin/components/elements/Button"));
const ContentEditable_1 = __importDefault(require("../../ui/ContentEditable"));
const Placeholder_1 = __importDefault(require("../../ui/Placeholder"));
const Auth_1 = require("payload/dist/admin/components/utilities/Auth");
const modal_1 = require("@faceless-ui/modal");
const Drawer_1 = require("payload/dist/admin/components/elements/Drawer");
exports.INSERT_INLINE_COMMAND = (0, lexical_1.createCommand)('INSERT_INLINE_COMMAND');
function AddCommentBox({ anchorKey, editor, onAddComment, }) {
    const boxRef = (0, react_2.useRef)(null);
    const updatePosition = (0, react_2.useCallback)(() => {
        const boxElem = boxRef.current;
        const rootElement = editor.getRootElement();
        const anchorElement = editor.getElementByKey(anchorKey);
        if (boxElem !== null && rootElement !== null && anchorElement !== null) {
            const { right } = rootElement.getBoundingClientRect();
            const { top } = anchorElement.getBoundingClientRect();
            boxElem.style.left = `${right - 20}px`;
            boxElem.style.top = `${top - 30}px`;
        }
    }, [anchorKey, editor]);
    (0, react_2.useEffect)(() => {
        window.addEventListener('resize', updatePosition);
        return () => {
            window.removeEventListener('resize', updatePosition);
        };
    }, [editor, updatePosition]);
    (0, useLayoutEffect_1.default)(() => {
        updatePosition();
    }, [anchorKey, editor, updatePosition]);
    return (React.createElement("div", { className: "CommentPlugin_AddCommentBox", ref: boxRef },
        React.createElement("button", { className: "CommentPlugin_AddCommentBox_button", onClick: onAddComment },
            React.createElement("i", { className: "icon add-comment" }))));
}
function EditorRefPlugin({ editorRef, }) {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, useLayoutEffect_1.default)(() => {
        editorRef.current = editor;
        return () => {
            editorRef.current = null;
        };
    }, [editor, editorRef]);
    return null;
}
function EscapeHandlerPlugin({ onEscape, }) {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_2.useEffect)(() => {
        return editor.registerCommand(lexical_1.KEY_ESCAPE_COMMAND, (event) => {
            return onEscape(event);
        }, 2);
    }, [editor, onEscape]);
    return null;
}
function PlainTextEditor({ className, autoFocus, onEscape, onChange, editorRef, placeholder = 'Type a comment...', }) {
    const initialConfig = {
        namespace: 'Commenting',
        nodes: [],
        onError: (error) => {
            throw error;
        },
        theme: CommentEditorTheme_1.default,
    };
    return (React.createElement(LexicalComposer_1.LexicalComposer, { initialConfig: initialConfig },
        React.createElement("div", { className: "CommentPlugin_CommentInputBox_EditorContainer" },
            React.createElement(LexicalPlainTextPlugin_1.PlainTextPlugin, { contentEditable: React.createElement(ContentEditable_1.default, { className: className }), placeholder: React.createElement(Placeholder_1.default, null, placeholder), ErrorBoundary: LexicalErrorBoundary_1.default }),
            React.createElement(LexicalOnChangePlugin_1.OnChangePlugin, { onChange: onChange }),
            React.createElement(LexicalHistoryPlugin_1.HistoryPlugin, null),
            React.createElement(EscapeHandlerPlugin, { onEscape: onEscape }),
            React.createElement(LexicalClearEditorPlugin_1.ClearEditorPlugin, null),
            editorRef !== undefined && React.createElement(EditorRefPlugin, { editorRef: editorRef }))));
}
function useOnChange(setContent, setCanSubmit) {
    return (0, react_2.useCallback)((editorState, _editor) => {
        editorState.read(() => {
            setContent((0, text_1.$rootTextContent)());
            setCanSubmit(!(0, text_1.$isRootTextContentEmpty)(_editor.isComposing(), true));
        });
    }, [setCanSubmit, setContent]);
}
function CommentInputBox({ editor, cancelAddComment, submitAddComment, }) {
    const [content, setContent] = (0, react_2.useState)('');
    const [canSubmit, setCanSubmit] = (0, react_2.useState)(false);
    const boxRef = (0, react_2.useRef)(null);
    const selectionState = (0, react_2.useMemo)(() => ({
        container: document.createElement('div'),
        elements: [],
    }), []);
    const selectionRef = (0, react_2.useRef)(null);
    const author = useCollabAuthorName();
    const updateLocation = (0, react_2.useCallback)(() => {
        editor.getEditorState().read(() => {
            const selection = (0, lexical_1.$getSelection)();
            if ((0, lexical_1.$isRangeSelection)(selection)) {
                selectionRef.current = selection.clone();
                const anchor = selection.anchor;
                const focus = selection.focus;
                const range = (0, selection_1.createDOMRange)(editor, anchor.getNode(), anchor.offset, focus.getNode(), focus.offset);
                const boxElem = boxRef.current;
                if (range !== null && boxElem !== null) {
                    const { left, bottom, width } = range.getBoundingClientRect();
                    const selectionRects = (0, selection_1.createRectsFromDOMRange)(editor, range);
                    let correctedLeft = selectionRects.length === 1 ? left + width / 2 - 125 : left - 125;
                    if (correctedLeft < 10) {
                        correctedLeft = 10;
                    }
                    boxElem.style.left = `${correctedLeft}px`;
                    boxElem.style.top = `${bottom + 20}px`;
                    const selectionRectsLength = selectionRects.length;
                    const { container } = selectionState;
                    const elements = selectionState.elements;
                    const elementsLength = elements.length;
                    for (let i = 0; i < selectionRectsLength; i++) {
                        const selectionRect = selectionRects[i];
                        let elem = elements[i];
                        if (elem === undefined) {
                            elem = document.createElement('span');
                            elements[i] = elem;
                            container.appendChild(elem);
                        }
                        const color = '255, 212, 0';
                        const style = `position:absolute;top:${selectionRect.top}px;left:${selectionRect.left}px;height:${selectionRect.height}px;width:${selectionRect.width}px;background-color:rgba(${color}, 0.3);pointer-events:none;z-index:5;`;
                        elem.style.cssText = style;
                    }
                    for (let i = elementsLength - 1; i >= selectionRectsLength; i--) {
                        const elem = elements[i];
                        container.removeChild(elem);
                        elements.pop();
                    }
                }
            }
        });
    }, [editor, selectionState]);
    (0, useLayoutEffect_1.default)(() => {
        updateLocation();
        const container = selectionState.container;
        const body = document.body;
        if (body !== null) {
            body.appendChild(container);
            return () => {
                body.removeChild(container);
            };
        }
    }, [selectionState.container, updateLocation]);
    (0, react_2.useEffect)(() => {
        window.addEventListener('resize', updateLocation);
        return () => {
            window.removeEventListener('resize', updateLocation);
        };
    }, [updateLocation]);
    const onEscape = (event) => {
        event.preventDefault();
        cancelAddComment();
        return true;
    };
    const submitComment = () => {
        if (canSubmit) {
            let quote = editor.getEditorState().read(() => {
                const selection = selectionRef.current;
                return selection ? selection.getTextContent() : '';
            });
            if (quote.length > 100) {
                quote = quote.slice(0, 99) + '…';
            }
            submitAddComment((0, commenting_1.createThread)(quote, [(0, commenting_1.createComment)(content, author)]), true, undefined, selectionRef.current);
            selectionRef.current = null;
        }
    };
    const onChange = useOnChange(setContent, setCanSubmit);
    return (React.createElement("div", { className: "CommentPlugin_CommentInputBox", ref: boxRef },
        React.createElement(PlainTextEditor, { className: "CommentPlugin_CommentInputBox_Editor", onEscape: onEscape, onChange: onChange }),
        React.createElement("div", { className: "CommentPlugin_CommentInputBox_Buttons" },
            React.createElement(Button_1.default, { onClick: cancelAddComment, className: "CommentPlugin_CommentInputBox_Button" }, "Cancel"),
            React.createElement(Button_1.default, { onClick: submitComment, disabled: !canSubmit, className: "CommentPlugin_CommentInputBox_Button primary" }, "Comment"))));
}
function CommentsComposer({ submitAddComment, thread, placeholder, }) {
    const [content, setContent] = (0, react_2.useState)('');
    const [canSubmit, setCanSubmit] = (0, react_2.useState)(false);
    const editorRef = (0, react_2.useRef)(null);
    const author = useCollabAuthorName();
    const onChange = useOnChange(setContent, setCanSubmit);
    const submitComment = () => {
        if (canSubmit) {
            submitAddComment((0, commenting_1.createComment)(content, author), false, thread);
            const editor = editorRef.current;
            if (editor !== null) {
                editor.dispatchCommand(lexical_1.CLEAR_EDITOR_COMMAND, undefined);
            }
        }
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(PlainTextEditor, { className: "CommentPlugin_CommentsPanel_Editor", autoFocus: false, onEscape: () => {
                return true;
            }, onChange: onChange, editorRef: editorRef, placeholder: placeholder }),
        React.createElement(Button_1.default, { className: "CommentPlugin_CommentsPanel_SendButton", onClick: submitComment, disabled: !canSubmit },
            React.createElement("i", { className: "send" }))));
}
const baseClass = 'lexicalRichText-comments-modal';
function ShowDeleteCommentOrThreadDrawer({ modalSlug, commentOrThread, deleteCommentOrThread, thread = undefined, }) {
    var _a;
    const { closeModal } = (0, modal_1.useModal)();
    return (React.createElement(Drawer_1.Drawer, { slug: modalSlug, key: modalSlug, className: baseClass, title: `Are you sure you want to delete this ${(_a = commentOrThread === null || commentOrThread === void 0 ? void 0 : commentOrThread.type) !== null && _a !== void 0 ? _a : 'unknown'}?` },
        React.createElement(Button_1.default, { onClick: () => {
                deleteCommentOrThread(commentOrThread, thread);
                closeModal(modalSlug);
            } }, "Delete"),
        ' ',
        React.createElement(Button_1.default, { onClick: () => {
                closeModal(modalSlug);
            } }, "Cancel")));
}
function CommentsPanelListComment({ comment, deleteComment, thread, rtf, }) {
    const seconds = Math.round((comment.timeStamp - performance.now()) / 1000);
    const minutes = Math.round(seconds / 60);
    const { openModal, isModalOpen = () => false } = (0, modal_1.useModal)();
    return (React.createElement("li", { className: "CommentPlugin_CommentsPanel_List_Comment" },
        React.createElement("div", { className: "CommentPlugin_CommentsPanel_List_Details" },
            React.createElement("span", { className: "CommentPlugin_CommentsPanel_List_Comment_Author" }, comment.author),
            React.createElement("span", { className: "CommentPlugin_CommentsPanel_List_Comment_Time" },
                "\u00B7 ",
                seconds > -10 ? 'Just now' : rtf.format(minutes, 'minute'))),
        React.createElement("p", { className: comment.deleted ? 'CommentPlugin_CommentsPanel_DeletedComment' : '' }, comment.content),
        !comment.deleted && (React.createElement(React.Fragment, null,
            React.createElement(Button_1.default, { onClick: () => {
                    openModal('lexicalRichText-comments-delete');
                }, className: "CommentPlugin_CommentsPanel_List_DeleteButton" },
                React.createElement("i", { className: "delete" })),
            isModalOpen('lexicalRichText-comments-delete') && (React.createElement(ShowDeleteCommentOrThreadDrawer, { modalSlug: "lexicalRichText-comments-delete", commentOrThread: comment, deleteCommentOrThread: deleteComment, thread: thread }))))));
}
function CommentsPanelList({ activeIDs, comments, deleteCommentOrThread, listRef, submitAddComment, markNodeMap, }) {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [counter, setCounter] = (0, react_2.useState)(0);
    const { openModal, isModalOpen = () => false } = (0, modal_1.useModal)();
    const rtf = (0, react_2.useMemo)(() => new Intl.RelativeTimeFormat('en', {
        localeMatcher: 'best fit',
        numeric: 'auto',
        style: 'short',
    }), []);
    (0, react_2.useEffect)(() => {
        // Used to keep the time stamp up to date
        const id = setTimeout(() => {
            setCounter(counter + 1);
        }, 10000);
        return () => {
            clearTimeout(id);
        };
    }, [counter]);
    return (React.createElement("ul", { className: "CommentPlugin_CommentsPanel_List", ref: listRef }, comments.map((commentOrThread) => {
        const id = commentOrThread.id;
        if (commentOrThread.type === 'thread') {
            const handleClickThread = () => {
                const markNodeKeys = markNodeMap.get(id);
                if (markNodeKeys !== undefined &&
                    (activeIDs === null || activeIDs.indexOf(id) === -1)) {
                    const activeElement = document.activeElement;
                    // Move selection to the start of the mark, so that we
                    // update the UI with the selected thread.
                    editor.update(() => {
                        const markNodeKey = Array.from(markNodeKeys)[0];
                        const markNode = (0, lexical_1.$getNodeByKey)(markNodeKey);
                        if ((0, mark_1.$isMarkNode)(markNode)) {
                            markNode.selectStart();
                        }
                    }, {
                        onUpdate() {
                            // Restore selection to the previous element
                            if (activeElement !== null) {
                                activeElement.focus();
                            }
                        },
                    });
                }
            };
            return (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            React.createElement("li", { key: id, onClick: handleClickThread, className: `CommentPlugin_CommentsPanel_List_Thread ${markNodeMap.has(id) ? 'interactive' : ''} ${activeIDs.indexOf(id) === -1 ? '' : 'active'}` },
                React.createElement("div", { className: "CommentPlugin_CommentsPanel_List_Thread_QuoteBox" },
                    React.createElement("blockquote", { className: "CommentPlugin_CommentsPanel_List_Thread_Quote" },
                        '> ',
                        React.createElement("span", null, commentOrThread.quote)),
                    React.createElement(Button_1.default, { onClick: () => {
                            openModal('lexicalRichText-thread-delete');
                        }, className: "CommentPlugin_CommentsPanel_List_DeleteButton" },
                        React.createElement("i", { className: "delete" })),
                    isModalOpen('lexicalRichText-thread-delete') && (React.createElement(ShowDeleteCommentOrThreadDrawer, { modalSlug: "lexicalRichText-thread-delete", commentOrThread: commentOrThread, deleteCommentOrThread: deleteCommentOrThread }))),
                React.createElement("ul", { className: "CommentPlugin_CommentsPanel_List_Thread_Comments" }, commentOrThread.comments.map((comment) => (React.createElement(CommentsPanelListComment, { key: comment.id, comment: comment, deleteComment: deleteCommentOrThread, thread: commentOrThread, rtf: rtf })))),
                React.createElement("div", { className: "CommentPlugin_CommentsPanel_List_Thread_Editor" },
                    React.createElement(CommentsComposer, { submitAddComment: submitAddComment, thread: commentOrThread, placeholder: "Reply to comment..." }))));
        }
        return (React.createElement(CommentsPanelListComment, { key: id, comment: commentOrThread, deleteComment: deleteCommentOrThread, rtf: rtf }));
    })));
}
function CommentsPanel({ activeIDs, deleteCommentOrThread, comments, submitAddComment, markNodeMap, }) {
    const listRef = (0, react_2.useRef)(null);
    const isEmpty = comments.length === 0;
    return (React.createElement("div", { className: "CommentPlugin_CommentsPanel" },
        React.createElement("h2", { className: "CommentPlugin_CommentsPanel_Heading" }, "Comments"),
        isEmpty ? (React.createElement("div", { className: "CommentPlugin_CommentsPanel_Empty" }, "No Comments")) : (React.createElement(CommentsPanelList, { activeIDs: activeIDs, comments: comments, deleteCommentOrThread: deleteCommentOrThread, listRef: listRef, submitAddComment: submitAddComment, markNodeMap: markNodeMap }))));
}
function useCollabAuthorName() {
    const { user } = (0, Auth_1.useAuth)();
    return (user === null || user === void 0 ? void 0 : user.email) ? user.email : 'Payload User'; //TODO Ability to set a display name instead of email
}
function CommentPlugin({}) {
    //const collabContext = useCollaborationContext();
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const { commentStore } = (0, exports.useCommentsContext)();
    const comments = (0, commenting_1.useCommentStore)(commentStore);
    const markNodeMap = (0, react_2.useMemo)(() => {
        return new Map();
    }, []);
    const [activeAnchorKey, setActiveAnchorKey] = (0, react_2.useState)();
    const [activeIDs, setActiveIDs] = (0, react_2.useState)([]);
    const [showCommentInput, setShowCommentInput] = (0, react_2.useState)(false);
    const [showComments, setShowComments] = (0, react_2.useState)(false);
    //const { yjsDocMap } = collabContext;
    (0, react_2.useEffect)(() => {
        /*if (providerFactory) {
          const provider = providerFactory("comments", yjsDocMap);
          return commentStore.registerCollaboration(provider);
        }*/
        //TODO ??
    }, [commentStore /*, yjsDocMap*/]);
    const cancelAddComment = (0, react_2.useCallback)(() => {
        editor.update(() => {
            const selection = (0, lexical_1.$getSelection)();
            // Restore selection
            if (selection !== null) {
                selection.dirty = true;
            }
        });
        setShowCommentInput(false);
    }, [editor]);
    const deleteCommentOrThread = (0, react_2.useCallback)((comment, thread) => {
        if (comment.type === 'comment') {
            const deletionInfo = commentStore.deleteCommentOrThread(comment, thread);
            if (!deletionInfo)
                return;
            const { markedComment, index } = deletionInfo;
            commentStore.addComment(markedComment, thread, index);
        }
        else {
            commentStore.deleteCommentOrThread(comment);
            // Remove ids from associated marks
            const id = thread !== undefined ? thread.id : comment.id;
            const markNodeKeys = markNodeMap.get(id);
            if (markNodeKeys !== undefined) {
                // Do async to avoid causing a React infinite loop
                setTimeout(() => {
                    editor.update(() => {
                        for (const key of markNodeKeys) {
                            const node = (0, lexical_1.$getNodeByKey)(key);
                            if ((0, mark_1.$isMarkNode)(node)) {
                                node.deleteID(id);
                                if (node.getIDs().length === 0) {
                                    (0, mark_1.$unwrapMarkNode)(node);
                                }
                            }
                        }
                    });
                });
            }
        }
    }, [commentStore, editor, markNodeMap]);
    const submitAddComment = (0, react_2.useCallback)((commentOrThread, isInlineComment, thread, selection) => {
        commentStore.addComment(commentOrThread, thread);
        if (isInlineComment) {
            editor.update(() => {
                if ((0, lexical_1.$isRangeSelection)(selection)) {
                    const isBackward = selection.isBackward();
                    const id = commentOrThread.id;
                    // Wrap content in a MarkNode
                    (0, mark_1.$wrapSelectionInMarkNode)(selection, isBackward, id);
                }
            });
            setShowCommentInput(false);
        }
    }, [commentStore, editor]);
    (0, react_2.useEffect)(() => {
        const changedElems = [];
        for (let i = 0; i < activeIDs.length; i++) {
            const id = activeIDs[i];
            const keys = markNodeMap.get(id);
            if (keys !== undefined) {
                for (const key of keys) {
                    const elem = editor.getElementByKey(key);
                    if (elem !== null) {
                        elem.classList.add('selected');
                        changedElems.push(elem);
                        setShowComments(true);
                    }
                }
            }
        }
        return () => {
            for (let i = 0; i < changedElems.length; i++) {
                const changedElem = changedElems[i];
                changedElem.classList.remove('selected');
            }
        };
    }, [activeIDs, editor, markNodeMap]);
    (0, react_2.useEffect)(() => {
        const markNodeKeysToIDs = new Map();
        return (0, utils_1.mergeRegister)((0, utils_1.registerNestedElementResolver)(editor, mark_1.MarkNode, (from) => {
            return (0, mark_1.$createMarkNode)(from.getIDs());
        }, (from, to) => {
            // Merge the IDs
            const ids = from.getIDs();
            ids.forEach((id) => {
                to.addID(id);
            });
        }), editor.registerMutationListener(mark_1.MarkNode, (mutations) => {
            editor.getEditorState().read(() => {
                for (const [key, mutation] of mutations) {
                    const node = (0, lexical_1.$getNodeByKey)(key);
                    let ids = [];
                    if (mutation === 'destroyed') {
                        ids = markNodeKeysToIDs.get(key) || [];
                    }
                    else if ((0, mark_1.$isMarkNode)(node)) {
                        ids = node.getIDs();
                    }
                    for (let i = 0; i < ids.length; i++) {
                        const id = ids[i];
                        let markNodeKeys = markNodeMap.get(id);
                        markNodeKeysToIDs.set(key, ids);
                        if (mutation === 'destroyed') {
                            if (markNodeKeys !== undefined) {
                                markNodeKeys.delete(key);
                                if (markNodeKeys.size === 0) {
                                    markNodeMap.delete(id);
                                }
                            }
                        }
                        else {
                            if (markNodeKeys === undefined) {
                                markNodeKeys = new Set();
                                markNodeMap.set(id, markNodeKeys);
                            }
                            if (!markNodeKeys.has(key)) {
                                markNodeKeys.add(key);
                            }
                        }
                    }
                }
            });
        }), editor.registerUpdateListener(({ editorState, tags }) => {
            editorState.read(() => {
                const selection = (0, lexical_1.$getSelection)();
                let hasActiveIds = false;
                let hasAnchorKey = false;
                if ((0, lexical_1.$isRangeSelection)(selection)) {
                    const anchorNode = selection.anchor.getNode();
                    if ((0, lexical_1.$isTextNode)(anchorNode)) {
                        const commentIDs = (0, mark_1.$getMarkIDs)(anchorNode, selection.anchor.offset);
                        if (commentIDs !== null) {
                            setActiveIDs(commentIDs);
                            hasActiveIds = true;
                        }
                        if (!selection.isCollapsed()) {
                            setActiveAnchorKey(anchorNode.getKey());
                            hasAnchorKey = true;
                        }
                    }
                }
                if (!hasActiveIds) {
                    setActiveIDs((_activeIds) => _activeIds.length === 0 ? _activeIds : []);
                }
                if (!hasAnchorKey) {
                    setActiveAnchorKey(null);
                }
                if (!tags.has('collaboration') && (0, lexical_1.$isRangeSelection)(selection)) {
                    setShowCommentInput(false);
                }
            });
        }), editor.registerCommand(exports.INSERT_INLINE_COMMAND, () => {
            const domSelection = window.getSelection();
            if (domSelection !== null) {
                domSelection.removeAllRanges();
            }
            setShowCommentInput(true);
            return true;
        }, lexical_1.COMMAND_PRIORITY_EDITOR));
    }, [editor, markNodeMap]);
    const onAddComment = () => {
        editor.dispatchCommand(exports.INSERT_INLINE_COMMAND, undefined);
    };
    return (React.createElement(React.Fragment, null,
        showCommentInput &&
            (0, react_dom_1.createPortal)(React.createElement(CommentInputBox, { editor: editor, cancelAddComment: cancelAddComment, submitAddComment: submitAddComment }), document.body),
        activeAnchorKey !== null &&
            activeAnchorKey !== undefined &&
            !showCommentInput &&
            (0, react_dom_1.createPortal)(React.createElement(AddCommentBox, { anchorKey: activeAnchorKey, editor: editor, onAddComment: onAddComment }), document.body),
        React.createElement(Button_1.default, { className: `CommentPlugin_ShowCommentsButton ${showComments ? 'active' : ''}`, onClick: () => setShowComments(!showComments), tooltip: showComments ? 'Hide Comments' : 'Show Comments' },
            React.createElement("i", { className: "comments" })),
        showComments &&
            (0, react_dom_1.createPortal)(React.createElement(CommentsPanel, { comments: comments, submitAddComment: submitAddComment, deleteCommentOrThread: deleteCommentOrThread, activeIDs: activeIDs, markNodeMap: markNodeMap }), document.body)));
}
exports.default = CommentPlugin;
const Context = (0, react_1.createContext)({});
const CommentsContext = ({ children, initialComments, }) => {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    let commentsContext;
    if (!initialComments) {
        commentsContext = (0, react_2.useMemo)(() => ({ commentStore: new commenting_1.CommentStore(editor) }), [editor]);
    }
    else {
        commentsContext = (0, react_2.useMemo)(() => ({ commentStore: new commenting_1.CommentStore(editor, initialComments) }), [editor]);
    }
    return (React.createElement(Context.Provider, { value: commentsContext }, children));
};
exports.CommentsContext = CommentsContext;
const useCommentsContext = () => {
    return (0, react_1.useContext)(Context);
};
exports.useCommentsContext = useCommentsContext;
//# sourceMappingURL=index.js.map