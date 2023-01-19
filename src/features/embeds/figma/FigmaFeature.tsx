import { Feature } from '../../../types';

import * as React from "react";
import FigmaPlugin, { INSERT_FIGMA_COMMAND } from './plugins';
import { FigmaNode } from './nodes/FigmaNode';
import { PlaygroundEmbedConfig } from '../../../fields/LexicalRichText/plugins/AutoEmbedPlugin';
import { EmbedMatchResult } from '@lexical/react/LexicalAutoEmbedPlugin';
import { LexicalEditor } from 'lexical';


export function FigmaFeature(props: {}): Feature {

    const FigmaEmbedConfig: PlaygroundEmbedConfig = {
        contentName: 'Figma Document',
      
        exampleUrl: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
      
        icon: <i className="icon figma" />,
      
        insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
          editor.dispatchCommand(INSERT_FIGMA_COMMAND, result.id);
        },
      
        keywords: ['figma', 'figma.com', 'mock-up'],
      
        // Determine if a given URL is a match and return url data.
        parseUrl: (text: string) => {
          const match = /https:\/\/([\w.-]+\.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/.exec(
            text,
          );
      
          if (match != null) {
            return {
              id: match[3],
              url: match[0],
            };
          }
      
          return null;
        },
      
        type: 'figma',
      };

    return {
        plugins: [
            {
              component: (<FigmaPlugin key="figma" />),
            }
        ],
        nodes: [
            FigmaNode
        ],
        embedConfigs: [FigmaEmbedConfig]
    }
}