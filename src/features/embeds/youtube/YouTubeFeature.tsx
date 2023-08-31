import * as React from 'react';

import { formatDrawerSlug } from 'payload/distadmin/components/elements/Drawer/index';

import { type EmbedMatchResult } from '@lexical/react/LexicalAutoEmbedPlugin';
import { type LexicalEditor } from 'lexical';

import {
  AutoEmbedDrawer,
  type PlaygroundEmbedConfig,
} from '../../../fields/LexicalRichText/plugins/AutoEmbedPlugin';
import { type EditorConfig, type Feature } from '../../../types';
import { YouTubeNode } from './nodes/YouTubeNode';
import YouTubePlugin, { INSERT_YOUTUBE_COMMAND } from './plugins';

export function YouTubeFeature(): Feature {
  const YoutubeEmbedConfig: PlaygroundEmbedConfig = {
    contentName: 'Youtube Video',

    exampleUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',

    // Icon for display.
    icon: <i className="icon youtube" />,

    insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
      editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, result.id);
    },

    keywords: ['youtube', 'video'],

    // Determine if a given URL is a match and return url data.
    parseUrl: async (url: string) => {
      const match = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/.exec(url);

      const id = match != null ? (match?.[2].length === 11 ? match[2] : null) : null;

      if (id != null) {
        return {
          id,
          url,
        };
      }

      return null;
    },

    type: 'youtube-video',
  };

  return {
    plugins: [
      {
        component: <YouTubePlugin key="youtube" />,
      },
    ],
    nodes: [YouTubeNode],
    embedConfigs: [YoutubeEmbedConfig],
    modals: [
      {
        modal: (props: { activeEditor: LexicalEditor; editorConfig: EditorConfig }) =>
          AutoEmbedDrawer({ embedConfig: YoutubeEmbedConfig }),
        openModalCommand: {
          type: 'autoembed-' + YoutubeEmbedConfig.type,
          command: (toggleModal, editDepth, uuid) => {
            const autoEmbedDrawerSlug = formatDrawerSlug({
              slug: `lexicalRichText-autoembed-` + YoutubeEmbedConfig.type + uuid,
              depth: editDepth,
            });

            toggleModal(autoEmbedDrawerSlug);
          },
        },
      },
    ],
  };
}
