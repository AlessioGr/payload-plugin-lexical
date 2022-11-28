import { NodeKey } from "lexical";
import { ExtraAttributes, RawImagePayload } from "./ImageNode";
export default function RawImageComponent({ rawImagePayload, nodeKey, extraAttributes }: {
    rawImagePayload: RawImagePayload;
    nodeKey: NodeKey;
    extraAttributes: ExtraAttributes;
}): JSX.Element;
