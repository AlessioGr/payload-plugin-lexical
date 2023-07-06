/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { LexicalCommand } from 'lexical';
export declare const SPEECH_TO_TEXT_COMMAND: LexicalCommand<boolean>;
export declare function isSUPPORT_SPEECH_RECOGNITION(): boolean;
declare function SpeechToTextPlugin(): null;
export default SpeechToTextPlugin;
