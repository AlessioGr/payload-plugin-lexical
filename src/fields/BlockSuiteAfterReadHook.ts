import payload from "payload";
import { FieldHook } from "payload/types";


type LexicalRichTextFieldAfterReadFieldHook = FieldHook<any, any, any>;

export const populateLexicalRelationships: LexicalRichTextFieldAfterReadFieldHook = async ({value, req}) =>  {
    return value;
};

