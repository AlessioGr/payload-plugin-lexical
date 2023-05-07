import * as React from 'react';

import { importFile } from '@lexical/file';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { EditorConfig, type Feature } from '../../../types';

function ImportAction(): JSX.Element {
  const [editor] = useLexicalComposerContext();

  return (
    <button
      className="action-button import"
      onClick={(event) => {
        event.preventDefault();
        importFile(editor);
      }}
      title="Import"
      aria-label="Import editor state from JSON"
    >
      <i className="import" />
    </button>
  );
}

export function ImportFeature(): Feature {
  return {
    actions: [<ImportAction key="import" />],
  };
}
