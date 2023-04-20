import { EditorConfig, Feature } from '../../../types';

import * as React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { exportFile } from '@lexical/file';

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
      aria-label="Export editor state to JSON">
      <i className="export" />
    </button>
  );
}

export function ExportFeature(props: {}): Feature {
  return {
    actions: [<ExportAction key="export" />],
  };
}
