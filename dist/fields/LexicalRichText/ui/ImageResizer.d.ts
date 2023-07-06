/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/// <reference types="react" />
import type { LexicalEditor } from 'lexical';
export default function ImageResizer({ onResizeStart, onResizeEnd, buttonRef, imageRef, maxWidth, editor, showCaption, setShowCaption, captionsEnabled, }: {
    editor: LexicalEditor;
    buttonRef: {
        current: null | HTMLButtonElement;
    };
    imageRef: {
        current: null | HTMLElement;
    };
    maxWidth?: number;
    onResizeEnd: (width: undefined | number, height: undefined | number) => void;
    onResizeStart: () => void;
    setShowCaption: (show: boolean) => void;
    showCaption: boolean;
    captionsEnabled: boolean;
}): JSX.Element;
