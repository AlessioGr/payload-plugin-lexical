import * as React from 'react';

import { exportFile } from '@lexical/file';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { EditorConfig, type Feature } from '../../../types';

function ExportAction(): JSX.Element {
  const [editor] = useLexicalComposerContext();

  return (
    <button
      className="action-button export"
      onClick={(event) => {
        event.preventDefault();
        exportFile(editor, {
          fileName: `Playground ${new Date().toISOString()}`,
          source: 'Playground',
        });
      }}
      title="Export"
      aria-label="Export editor state to JSON"
    >
      <i className="export" />
    </button>
  );
}

export function ExportFeature(): Feature {
  return {
    actions: [<ExportAction key="export" />],
  };
}
