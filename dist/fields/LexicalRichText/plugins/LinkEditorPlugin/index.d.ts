/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import './index.scss';
import { LexicalEditor } from 'lexical';
import './modal.scss';
export default function FloatingLinkEditorPlugin({ anchorElem, }: {
    anchorElem?: HTMLElement;
}): JSX.Element | null;
export declare function EditLinkModal({ editor, setEditMode, modalSlug, handleModalSubmit, initialState, fieldSchema, }: {
    editor: LexicalEditor;
    setEditMode: any;
    modalSlug: string;
    handleModalSubmit: any;
    initialState: any;
    fieldSchema: any;
}): JSX.Element;
