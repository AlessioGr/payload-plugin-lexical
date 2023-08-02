/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { COMMAND_PRIORITY_LOW, createCommand, LexicalCommand } from 'lexical';
import { useEffect } from 'react';
import { toggleVideo, VideoAttributes, VideoNode } from '../nodes/VideoNode';

export const TOGGLE_VIDEO_COMMAND: LexicalCommand<VideoAttributes> =
  createCommand('TOGGLE_VIDEO_COMMAND');

export function VideoPlugin({}): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([VideoNode])) {
      throw new Error('VideoPlugin: VideoNode not registered on editor');
    }
    return mergeRegister(
      editor.registerCommand(
        TOGGLE_VIDEO_COMMAND,
        (payload) => {
          let videoData: VideoAttributes = {
            id: payload.id,
            source: payload.source,
          };
          toggleVideo(videoData);
          return true;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor]);

  return null;
}
