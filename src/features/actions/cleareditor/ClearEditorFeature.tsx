import * as React from 'react';
import { useState, useEffect } from 'react';

import { formatDrawerSlug } from 'payload/dist/admin/components/elements/Drawer';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $isParagraphNode } from 'lexical';

import { ClearEditorDrawer } from './drawer';
import { OPEN_MODAL_COMMAND } from '../../../fields/LexicalRichText/plugins/ModalPlugin';
import { type Feature } from '../../../types';

function ClearEditorAction(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);

  useEffect(() => {
    // Not sure if this here is needed
    return editor.registerUpdateListener(({ dirtyElements, prevEditorState, tags }) => {
      editor.getEditorState().read(() => {
        const root = $getRoot();
        const children = root.getChildren();

        if (children.length > 1) {
          setIsEditorEmpty(false);
        } else if ($isParagraphNode(children[0])) {
          const paragraphChildren = children[0].getChildren();
          setIsEditorEmpty(paragraphChildren.length === 0);
        } else {
          setIsEditorEmpty(false);
        }
      });
    });
  }, [editor]);
  return (
    <button
      className="action-button clear"
      disabled={isEditorEmpty}
      onClick={(event) => {
        event.preventDefault();
        editor.dispatchCommand(OPEN_MODAL_COMMAND, 'clear-editor');
      }}
      title="Clear"
      aria-label="Clear editor contents"
    >
      <i className="clear" />
    </button>
  );
}

export function ClearEditorFeature(): Feature {
  return {
    actions: [<ClearEditorAction key="clear-editor" />],
    modals: [
      {
        modal: ClearEditorDrawer,
        openModalCommand: {
          type: 'clear-editor',
          command: (toggleModal, editDepth, uuid) => {
            const clearEditorDrawerSlug = formatDrawerSlug({
              slug: `lexicalRichText-clear-editor-${uuid}`,
              depth: editDepth,
            });
            toggleModal(clearEditorDrawerSlug);
          },
        },
      },
    ],
  };
}
