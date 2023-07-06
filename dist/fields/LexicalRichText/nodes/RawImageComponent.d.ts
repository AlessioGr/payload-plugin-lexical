/// <reference types="react" />
import { LexicalEditor, NodeKey } from 'lexical';
import { ExtraAttributes, RawImagePayload } from './ImageNode';
export default function RawImageComponent({ rawImagePayload, nodeKey, extraAttributes, showCaption, caption, captionsEnabled, }: {
    rawImagePayload: RawImagePayload;
    nodeKey: NodeKey;
    extraAttributes: ExtraAttributes;
    showCaption: boolean;
    caption: LexicalEditor;
    captionsEnabled: boolean;
}): JSX.Element;
