/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CharacterLimitPlugin } from "@lexical/react/LexicalCharacterLimitPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import * as React from "react";
import { useState } from "react";
import { OnChangePlugin } from "./plugins/OnChangePlugin";
import { useSharedHistoryContext } from "./context/SharedHistoryContext";
import TableCellNodes from "./nodes/TableCellNodes";
import ActionsPlugin from "./plugins/ActionsPlugin";
import AutoEmbedPlugin from "./plugins/AutoEmbedPlugin";
import CodeActionMenuPlugin from "./plugins/CodeActionMenuPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import ComponentPickerPlugin from "./plugins/ComponentPickerPlugin";
import DragDropPaste from "./plugins/DragDropPastePlugin";
import DraggableBlockPlugin from "./plugins/DraggableBlockPlugin";
import FloatingTextFormatToolbarPlugin from "./plugins/FloatingTextFormatToolbarPlugin";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import MarkdownShortcutPlugin from "./plugins/MarkdownShortcutPlugin";
import TabFocusPlugin from "./plugins/TabFocusPlugin";
import TableCellActionMenuPlugin from "./plugins/TableActionMenuPlugin";
import TableCellResizer from "./plugins/TableCellResizer";
import { TablePlugin as NewTablePlugin } from "./plugins/TablePlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import PlaygroundEditorTheme from "./themes/PlaygroundEditorTheme";
import ContentEditable from "./ui/ContentEditable";
import Placeholder from "./ui/Placeholder";
import { OnChangeProps } from "./types";
import UploadPlugin from "./plugins/UploadPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import ModalPlugin from "./plugins/ModalPlugin";
import CommentPlugin from "./plugins/CommentPlugin";
import { Settings } from './settings/Settings';

export const Editor: React.FC<OnChangeProps> = (props) => {
  const { onChange, initialJSON, editorConfig, initialComments } = props;

  const { historyState } = useSharedHistoryContext();

  const {
    isRichText,
    isCharLimit,
    isCharLimitUtf8,
  } = Settings;


  const text = isRichText
    ? "Enter some rich text..."
    : "Enter some plain text...";
  const placeholder = <Placeholder>{text}</Placeholder>;
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const cellEditorConfig = {
    namespace: "Playground",
    nodes: [...TableCellNodes(editorConfig)],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  return (
    <React.Fragment>
      <ModalPlugin editorConfig={editorConfig} />
      {isRichText && <ToolbarPlugin editorConfig={editorConfig} />}
      <div
        className={`editor-container ${editorConfig.debug ? "tree-view" : ""} ${!isRichText ? "plain-text" : ""
          }`}
      >
        {editorConfig.features.map(feature => {
          if (feature.plugins && feature.plugins.length > 0) {
            return feature.plugins.map(plugin => {
              if (!plugin.position || plugin.position === "normal") {
                return plugin.component;
              }
            })
          }
        })}

        <DragDropPaste />
        <ClearEditorPlugin />
        <ComponentPickerPlugin editorConfig={editorConfig} />
        <AutoEmbedPlugin editorConfig={editorConfig} />
        <HashtagPlugin />
        {editorConfig.toggles.comments.enabled && <CommentPlugin />}
        {isRichText ? (
          <React.Fragment>
            <HistoryPlugin externalHistoryState={historyState} />
            <RichTextPlugin
              contentEditable={
                <div className="editor-scroller">
                  <div className="editor" ref={onRef}>
                    <ContentEditable />
                  </div>
                </div>
              }
              placeholder={placeholder}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <MarkdownShortcutPlugin editorConfig={editorConfig} />
            <CodeHighlightPlugin />
            <ListPlugin />
            <CheckListPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            {editorConfig.toggles.tables.enabled && <TablePlugin />}
            {editorConfig.toggles.tables.enabled && <TableCellResizer />}
            {editorConfig.toggles.tables.enabled && (
              <NewTablePlugin cellEditorConfig={cellEditorConfig}>
                <RichTextPlugin
                  contentEditable={
                    <ContentEditable className="TableNode__contentEditable" />
                  }
                  placeholder={null}
                  ErrorBoundary={LexicalErrorBoundary}
                />
                <React.Fragment>
                  {editorConfig.features.map(feature => {
                    if (feature.tablePlugins && feature.tablePlugins.length > 0) {
                      return feature.tablePlugins.map(tablePlugin => {
                        return tablePlugin;
                      })
                    }
                  })}
                </React.Fragment>
                <HistoryPlugin />
                <UploadPlugin captionsEnabled={false} />
                <FloatingTextFormatToolbarPlugin editorConfig={editorConfig} />
              </NewTablePlugin>
            )}
            {editorConfig.toggles.upload.enabled && (
              <UploadPlugin captionsEnabled={false} />
            )}
            <OnChangePlugin
              onChange={(editorState, editor, commentStore) => {
                onChange(editorState, editor, commentStore);
              }}
            />

            <TabFocusPlugin />
            <TabIndentationPlugin />
            {floatingAnchorElem && (
              <React.Fragment>
                <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
                {editorConfig.features.map(feature => {
                  if (feature.floatingAnchorElemPlugins && feature.floatingAnchorElemPlugins.length > 0) {
                    return feature.floatingAnchorElemPlugins.map(plugin => {
                      return plugin(floatingAnchorElem);
                    })
                  }
                })}
                {editorConfig.toggles.tables.enabled && (
                  <TableCellActionMenuPlugin anchorElem={floatingAnchorElem} />
                )}
                <FloatingTextFormatToolbarPlugin
                  anchorElem={floatingAnchorElem}
                  editorConfig={editorConfig}
                />
              </React.Fragment>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <PlainTextPlugin
              contentEditable={<ContentEditable />}
              placeholder={placeholder}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin externalHistoryState={historyState} />
          </React.Fragment>
        )}
        {(isCharLimit || isCharLimitUtf8) && (
          <CharacterLimitPlugin
            charset={isCharLimit ? 'UTF-16' : 'UTF-8'}
            maxLength={5}
          />
        )}
        {editorConfig.features.map(feature => {
        if (feature.plugins && feature.plugins.length > 0) {
          return feature.plugins.map(plugin => {
            if (plugin.position === "bottomInContainer") {
              return plugin.component;
            }
          })
        }
      })}
        <ActionsPlugin isRichText={isRichText} editorConfig={editorConfig} />
      </div>
      {editorConfig.features.map(feature => {
        if (feature.plugins && feature.plugins.length > 0) {
          return feature.plugins.map(plugin => {
            if (plugin.position === "bottom") {
              return plugin.component;
            }
          })
        }
      })}
    </React.Fragment>
  );
};
