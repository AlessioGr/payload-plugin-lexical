import * as React from 'react';
import { useEffect, useState } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { type LexicalEditor } from 'lexical';

import { EditorConfig, type Feature } from '../../../types';

async function sendEditorState(editor: LexicalEditor): Promise<void> {
  const stringifiedEditorState = JSON.stringify(editor.getEditorState());
  try {
    await fetch('http://localhost:1235/setEditorState', {
      body: stringifiedEditorState,
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      method: 'POST',
    });
  } catch {
    // NO-OP
  }
}

async function validateEditorState(editor: LexicalEditor): Promise<void> {
  const stringifiedEditorState = JSON.stringify(editor.getEditorState());
  let response;
  try {
    response = await fetch('http://localhost:1235/validateEditorState', {
      body: stringifiedEditorState,
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      method: 'POST',
    });
  } catch {
    // NO-OP
  }
  if (response != null && response.status === 403) {
    throw new Error('Editor state validation failed! Server did not accept changes.');
  }
}

function ReadOnlyModeAction(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      })
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ dirtyElements, prevEditorState, tags }) => {
      // If we are in read only mode, send the editor state
      // to server and ask for validation if possible.
      if (
        !isEditable &&
        dirtyElements.size > 0 &&
        !tags.has('historic') &&
        !tags.has('collaboration')
      ) {
        void validateEditorState(editor);
      }
    });
  }, [editor, isEditable]);

  return (
    <button
      className={`action-button ${!isEditable ? 'unlock' : 'lock'}`}
      onClick={(event) => {
        event.preventDefault();
        // Send latest editor state to commenting validation server
        if (isEditable) {
          void sendEditorState(editor);
        }
        editor.setEditable(!editor.isEditable());
      }}
      title="Read-Only Mode"
      aria-label={`${!isEditable ? 'Unlock' : 'Lock'} read-only mode`}
    >
      <i className={!isEditable ? 'unlock' : 'lock'} />
    </button>
  );
}

export function ReadOnlyModeFeature(): Feature {
  return {
    actions: [<ReadOnlyModeAction key="readonly" />],
  };
}
