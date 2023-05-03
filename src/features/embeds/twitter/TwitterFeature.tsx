import * as React from 'react';

import { formatDrawerSlug } from 'payload/dist/admin/components/elements/Drawer';

import { type ElementTransformer } from '@lexical/markdown';
import { type EmbedMatchResult } from '@lexical/react/LexicalAutoEmbedPlugin';
import { type LexicalEditor } from 'lexical';

import { $createTweetNode, $isTweetNode, TweetNode } from './nodes/TweetNode';
import TwitterPlugin, { INSERT_TWEET_COMMAND } from './plugins';
import {
  AutoEmbedDrawer,
  type PlaygroundEmbedConfig,
} from '../../../fields/LexicalRichText/plugins/AutoEmbedPlugin';
import { type EditorConfig, type Feature } from '../../../types';

export function TwitterFeature(): Feature {
  const TwitterEmbedConfig: PlaygroundEmbedConfig = {
    // e.g. Tweet or Google Map.
    contentName: 'Tweet',

    exampleUrl: 'https://twitter.com/jack/status/20',

    // Icon for display.
    icon: <i className="icon tweet" />,

    // Create the Lexical embed node from the url data.
    insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
      editor.dispatchCommand(INSERT_TWEET_COMMAND, result.id);
    },

    // For extra searching.
    keywords: ['tweet', 'twitter'],

    // Determine if a given URL is a match and return url data.
    parseUrl: (text: string) => {
      const match = /^https:\/\/twitter\.com\/(#!\/)?(\w+)\/status(es)*\/(\d+)$/.exec(text);

      if (match != null) {
        return {
          id: match[4],
          url: match[0],
        };
      }

      return null;
    },

    type: 'tweet',
  };

  const tweetMarkdownElementTransformer: ElementTransformer = {
    dependencies: [TweetNode],
    export: (node) => {
      if (!$isTweetNode(node)) {
        return null;
      }

      return `<tweet id="${node.getId()}" />`;
    },
    regExp: /<tweet id="([^"]+?)"\s?\/>\s?$/,
    replace: (textNode, _1, match) => {
      const [, id] = match;
      const tweetNode = $createTweetNode(id);
      textNode.replace(tweetNode);
    },
    type: 'element',
  };

  return {
    plugins: [
      {
        component: <TwitterPlugin key="twitter" />,
      },
    ],
    nodes: [TweetNode],
    embedConfigs: [TwitterEmbedConfig],
    markdownTransformers: [tweetMarkdownElementTransformer],
    modals: [
      {
        modal: (props: { activeEditor: LexicalEditor; editorConfig: EditorConfig }) =>
          AutoEmbedDrawer({ embedConfig: TwitterEmbedConfig }),
        openModalCommand: {
          type: 'autoembed-' + TwitterEmbedConfig.type,
          command: (toggleModal, editDepth, uuid) => {
            const autoEmbedDrawerSlug = formatDrawerSlug({
              slug: `lexicalRichText-autoembed-` + TwitterEmbedConfig.type + uuid,
              depth: editDepth,
            });

            toggleModal(autoEmbedDrawerSlug);
          },
        },
      },
    ],
  };
}
