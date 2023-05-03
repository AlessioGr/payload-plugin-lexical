import * as React from 'react';
import { useCallback } from 'react';

import { $createCodeNode, $isCodeNode } from '@lexical/code';
import { $convertFromMarkdownString, $convertToMarkdownString } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createTextNode, $getRoot } from 'lexical';

import { useEditorConfigContext } from '../../..';
import { PLAYGROUND_TRANSFORMERS } from '../../../fields/LexicalRichText/plugins/MarkdownTransformers';
import { type Feature } from '../../../types';

function ConvertFromMarkdownAction(): JSX.Element {
  const [editor] = useLexicalComposerContext();

  const { editorConfig } = useEditorConfigContext();

  const handleMarkdownToggle = useCallback(() => {
    editor.update(() => {
      const root = $getRoot();
      const firstChild = root.getFirstChild();
      if ($isCodeNode(firstChild) && firstChild.getLanguage() === 'markdown') {
        $convertFromMarkdownString(
          firstChild.getTextContent(),
          PLAYGROUND_TRANSFORMERS(editorConfig)
        );
      } else {
        const markdown = $convertToMarkdownString(PLAYGROUND_TRANSFORMERS(editorConfig));
        root.clear().append($createCodeNode('markdown').append($createTextNode(markdown)));
      }
      root.selectEnd();
    });
  }, [editor]);

  return (
    <button
      className="action-button"
      onClick={(event) => {
        event.preventDefault();
        handleMarkdownToggle();
      }}
      title="Convert From Markdown"
      aria-label="Convert from markdown"
    >
      <i className="markdown" />
    </button>
  );
}

export function ConvertFromMarkdownFeature(): Feature {
  return {
    actions: [<ConvertFromMarkdownAction key="convertfrommarkdown" />],
  };
}
