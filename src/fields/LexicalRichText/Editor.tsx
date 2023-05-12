/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import { useEffect, useState } from 'react';

import { CharacterLimitPlugin } from '@lexical/react/LexicalCharacterLimitPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import useLexicalEditable from '@lexical/react/useLexicalEditable';

import { useSharedHistoryContext } from './context/SharedHistoryContext';
import TableCellNodes from './nodes/TableCellNodes';
import ActionsPlugin from './plugins/ActionsPlugin';
import AutoEmbedPlugin from './plugins/AutoEmbedPlugin';
import CodeActionMenuPlugin from './plugins/CodeActionMenuPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import CommentPlugin from './plugins/CommentPlugin';
import ComponentPickerPlugin from './plugins/ComponentPickerPlugin';
import DragDropPaste from './plugins/DragDropPastePlugin';
import DraggableBlockPlugin from './plugins/DraggableBlockPlugin';
import FloatingTextFormatToolbarPlugin from './plugins/FloatingTextFormatToolbarPlugin';
import InlineImagePlugin from './plugins/InlineImagePlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import MarkdownShortcutPlugin from './plugins/MarkdownShortcutPlugin';
import ModalPlugin from './plugins/ModalPlugin';
import { OnChangePlugin } from './plugins/OnChangePlugin';
import TabFocusPlugin from './plugins/TabFocusPlugin';
import TableCellActionMenuPlugin from './plugins/TableActionMenuPlugin';
import TableCellResizer from './plugins/TableCellResizer';
import { TablePlugin as NewTablePlugin } from './plugins/TablePlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import UploadPlugin from './plugins/UploadPlugin';
import { Settings } from './settings/Settings';
import { CAN_USE_DOM } from './shared/canUseDOM';
import LexicalEditorTheme from './themes/LexicalEditorTheme';
import { type OnChangeProps } from './types';
import ContentEditable from './ui/ContentEditable';
import Placeholder from './ui/Placeholder';

import './Editor.scss';

export const Editor: React.FC<OnChangeProps> = (props) => {
  const { onChange, initialJSON, editorConfig, initialComments, value, setValue } = props;
  const { historyState } = useSharedHistoryContext();
  const { isRichText, isCharLimit, isCharLimitUtf8, tableCellMerge, tableCellBackgroundColor } =
    Settings;
  const isEditable = useLexicalEditable();
  const text = isRichText ? 'Enter some rich text...' : 'Enter some plain text...';
  const placeholder = <Placeholder>{text}</Placeholder>;
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] = useState<boolean>(false);
  const onRef = (_floatingAnchorElem: HTMLDivElement): void => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const cellEditorConfig = {
    namespace: 'Playground',
    nodes: [...TableCellNodes(editorConfig)],
    onError: (error: Error) => {
      throw error;
    },
    theme: LexicalEditorTheme,
  };

  useEffect(() => {
    const updateViewPortWidth = (): void => {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };
    updateViewPortWidth();
    window.addEventListener('resize', updateViewPortWidth);

    return () => {
      window.removeEventListener('resize', updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

  let hasAnyActionButtons = false;
  editorConfig.features.forEach((feature) => {
    if (feature.actions != null && feature.actions.length > 0) {
      hasAnyActionButtons = true;
    }
  });

  return (
    <React.Fragment>
      <ModalPlugin editorConfig={editorConfig} />
      {isRichText && <ToolbarPlugin editorConfig={editorConfig} />}
      <div
        className={`editor-container ${editorConfig.debug ? 'tree-view' : ''} ${
          !isRichText ? 'plain-text' : ''
        }`}
      >
        {editorConfig.features.map((feature) => {
          if (feature.plugins != null && feature.plugins.length > 0) {
            return feature.plugins.map((plugin) => {
              if (plugin.position == null || plugin.position === 'normal') {
                if (plugin.onlyIfNotEditable == null) {
                  return plugin.component;
                } else {
                  return !isEditable && plugin.component;
                }
              }
              return null;
            });
          }
          return null;
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
            {editorConfig.toggles.tables.enabled && (
              <TablePlugin
                hasCellMerge={tableCellMerge}
                hasCellBackgroundColor={tableCellBackgroundColor}
              />
            )}
            {editorConfig.toggles.tables.enabled && <TableCellResizer />}
            {editorConfig.toggles.tables.enabled && (
              <NewTablePlugin cellEditorConfig={cellEditorConfig}>
                <RichTextPlugin
                  contentEditable={<ContentEditable className="TableNode__contentEditable" />}
                  placeholder={null}
                  ErrorBoundary={LexicalErrorBoundary}
                />
                <React.Fragment>
                  {editorConfig.features.map((feature) => {
                    if (feature.tablePlugins != null && feature.tablePlugins.length > 0) {
                      return feature.tablePlugins.map((tablePlugin) => {
                        return tablePlugin;
                      });
                    }
                    return null;
                  })}
                </React.Fragment>
                <HistoryPlugin />
                <UploadPlugin captionsEnabled={false} />
                <FloatingTextFormatToolbarPlugin editorConfig={editorConfig} />
              </NewTablePlugin>
            )}
            {editorConfig.toggles.upload.enabled && (
              <>
                <UploadPlugin captionsEnabled={false} />
                <InlineImagePlugin collection="media" />
              </>
            )}
            <OnChangePlugin
              onChange={(editorState, editor, tags, commentStore) => {
                // Ignore any onChange event triggered by focus only
                if (!tags.has('focus') || tags.size > 1) {
                  onChange(editorState, editor, tags, commentStore);
                }
              }}
              value={value}
            />

            <TabFocusPlugin />
            <TabIndentationPlugin />
            {floatingAnchorElem != null && !isSmallWidthViewport && (
              <React.Fragment>
                <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
                {editorConfig.features.map((feature) => {
                  if (
                    feature.floatingAnchorElemPlugins != null &&
                    feature.floatingAnchorElemPlugins.length > 0
                  ) {
                    return feature.floatingAnchorElemPlugins.map((plugin) => {
                      return plugin(floatingAnchorElem);
                    });
                  }
                  return null;
                })}
                {editorConfig.toggles.tables.enabled && (
                  <TableCellActionMenuPlugin anchorElem={floatingAnchorElem} cellMerge={true} />
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
          <CharacterLimitPlugin charset={isCharLimit ? 'UTF-16' : 'UTF-8'} maxLength={5} />
        )}
        {editorConfig.features.map((feature) => {
          if (feature.plugins != null && feature.plugins.length > 0) {
            return feature.plugins.map((plugin) => {
              if (plugin.position === 'bottomInContainer') {
                if (plugin.onlyIfNotEditable == null) {
                  return plugin.component;
                } else {
                  return !isEditable && plugin.component;
                }
              }
              return null;
            });
          }
          return null;
        })}
        {hasAnyActionButtons && (
          <ActionsPlugin isRichText={isRichText} editorConfig={editorConfig} />
        )}
      </div>
      {editorConfig.features.map((feature) => {
        if (feature.plugins != null && feature.plugins.length > 0) {
          return feature.plugins.map((plugin) => {
            if (plugin.position === 'bottom') {
              if (plugin.onlyIfNotEditable == null) {
                return plugin.component;
              } else {
                return !isEditable && plugin.component;
              }
            }
            return null;
          });
        }
        return null;
      })}
    </React.Fragment>
  );
};
