import { formatDrawerSlug } from 'payload/dist/admin/components/elements/Drawer';
import * as React from 'react';

import { LexicalEditor } from 'lexical';
import { Feature, EditorConfig } from '../../../../src/types';
import { DropDownItem } from '../../../../src/fields/LexicalRichText/ui/DropDown';
import { OPEN_MODAL_COMMAND } from '../../../../src/fields/LexicalRichText/plugins/ModalPlugin';
import { VideoPlugin } from './plugins/VideoPlugin';
import { VideoNode } from './nodes/VideoNode';
import { VideoDrawer } from './nodes/modals/videoDrawer';
import { ComponentPickerOption } from '../../../../src/fields/LexicalRichText/plugins/ComponentPickerPlugin';

export function VideoFeature(props: {}): Feature {
  const componentPickerOption = (
    editor: LexicalEditor,
    editorConfig: EditorConfig
  ): ComponentPickerOption =>
    new ComponentPickerOption('Video', {
      icon: <i className="icon video" />,
      keywords: ['video', 'vimeo', 'youtube'],
      onSelect: () => {
        editor.dispatchCommand(OPEN_MODAL_COMMAND, 'video');
      },
    });

  return {
    plugins: [
      {
        component: <VideoPlugin key="video" />,
      },
    ],
    nodes: [VideoNode],
    componentPicker: {
      componentPickerOptions: [componentPickerOption],
    },
    modals: [
      {
        modal: VideoDrawer,
        openModalCommand: {
          type: 'video',
          command: (toggleModal, editDepth, uuid) => {
            const videoDrawerSlug = formatDrawerSlug({
              slug: `video` + uuid,
              depth: editDepth,
            });
            toggleModal(videoDrawerSlug);
          },
        },
      },
    ],
    toolbar: {
      insert: [
        (editor: LexicalEditor, editorConfig: EditorConfig) => {
          return (
            <DropDownItem
              key="video"
              onClick={() => {
                editor.dispatchCommand(OPEN_MODAL_COMMAND, 'video');
              }}
              className="item"
            >
              <i className="icon product" />
              <span className="text">Video</span>
            </DropDownItem>
          );
        },
      ],
    },
  };
}
