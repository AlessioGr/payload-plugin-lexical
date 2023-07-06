/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/// <reference types="react" />
import { EmbedConfig } from '@lexical/react/LexicalAutoEmbedPlugin';
import { EditorConfig } from '../../../../types';
import './modal.scss';
export interface PlaygroundEmbedConfig extends EmbedConfig {
    contentName: string;
    icon?: JSX.Element;
    exampleUrl: string;
    keywords: Array<string>;
    description?: string;
}
export declare function getEmbedConfigs(editorConfig: EditorConfig): any[];
export declare function AutoEmbedDrawer({ embedConfig, }: {
    embedConfig: PlaygroundEmbedConfig;
}): JSX.Element;
export default function AutoEmbedPlugin(props: {
    editorConfig: EditorConfig;
}): JSX.Element;
