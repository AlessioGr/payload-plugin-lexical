import { EditorConfig, Feature } from '../../../types';

import * as React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { importFile } from '@lexical/file';

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
      aria-label="Import editor state from JSON">
      <i className="import" />
    </button>
  );
}

export function ImportFeature(props: {}): Feature {
  return {
    actions: [<ImportAction key="import" />],
  };
}
