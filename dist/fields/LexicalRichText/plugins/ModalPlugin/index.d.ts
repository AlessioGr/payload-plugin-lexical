/// <reference types="react" />
import { EditorConfig } from '../../../../types';
import { LexicalCommand } from 'lexical';
export declare const OPEN_MODAL_COMMAND: LexicalCommand<'upload' | 'table' | string>;
export default function ModalPlugin(props: {
    editorConfig: EditorConfig;
}): JSX.Element;
