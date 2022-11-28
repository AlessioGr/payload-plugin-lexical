import React, { Suspense } from 'react';
import {$getRoot, EditorState, LexicalEditor, SerializedEditorState, SerializedLexicalNode} from 'lexical';
import { Props } from './types';
import { LexicalEditorComponent } from './LexicalEditorComponent';

import './index.scss';
import Loading from 'payload/dist/admin/components/elements/Loading'

const baseClass = 'lexicalRichTextEditor';

import { useField } from "payload/components/forms";
import PlaygroundNodes from "./nodes/PlaygroundNodes";
import PlaygroundEditorTheme from "./themes/PlaygroundEditorTheme";
import {createHeadlessEditor} from "@lexical/headless";
import {ExtraAttributes, RawImagePayload} from "./nodes/ImageNode";
import payload from "payload";
import {FieldHook, FieldWithPath} from "payload/types";

type LexicalRichTextFieldAfterReadFieldHook = FieldHook<any, SerializedEditorState, any>;
export const populateLexicalRelationships2: LexicalRichTextFieldAfterReadFieldHook = async ({value, req}): Promise<SerializedEditorState> =>  {
    if(value.root.children){
        const newChildren = [];
        for(let childNode of value.root.children){
            newChildren.push(await traverseLexicalField(childNode, ""));
        }
        value.root.children = newChildren;
    }

    return value;
};

export async function traverseLexicalField(node: SerializedLexicalNode, locale: string): Promise<SerializedLexicalNode> {
    //Find replacements
    if(node.type === 'upload'){
        const rawImagePayload: RawImagePayload = node["rawImagePayload"];
        //const extraAttributes: ExtraAttributes = node["extraAttributes"];
        const uploadData = await loadUploadData(rawImagePayload, locale);
        if(uploadData){
            node["data"] = uploadData;
        }

    } else if(node.type === 'link' && node["linkType"] && node["linkType"] === 'internal'){
        const doc: {
            value: string,
            relationTo: string,
        } = node["doc"];

        const foundDoc = await loadInternalLinkDocData(doc.value, doc.relationTo, locale);
        if(foundDoc){
            node["doc"]["data"] = foundDoc;
        }
    }

    //Run for its children
    if(node["children"] && node["children"].length > 0){
        let newChildren = [];
        for(let childNode of node["children"]){
            newChildren.push(await traverseLexicalField(childNode, locale));
        }
        node["children"] = newChildren;
    }

    return node;
}
async function loadUploadData(rawImagePayload: RawImagePayload, locale: string) {

    const foundUpload = await payload.findByID({
        collection: rawImagePayload.relationTo, // required
        id: rawImagePayload.value.id, // required
        depth: 2,
        locale: locale,
    });


    return foundUpload;
}

async function loadInternalLinkDocData(value: string, relationTo: string, locale: string) { //TODO: Adjustable depth

    const foundDoc = await payload.findByID({
        collection: relationTo, // required
        id: value, // required
        depth: 2,
        locale: locale,
    });


    return foundDoc;
}

export const LexicalRichTextCell: React.FC<any> = (props) => {
    const { field, colIndex, collection, cellData, rowData } = props;
    console.log("Props", props);
    const data = cellData;

    const initialConfig = {
        namespace: 'Playground',
        nodes: [...PlaygroundNodes],
        theme: PlaygroundEditorTheme,
    };

    let textToShow;
    try {
        const editor: LexicalEditor = createHeadlessEditor(initialConfig);
        editor.setEditorState(editor.parseEditorState(data));

        const textContent = editor.getEditorState().read(() => {
            return $getRoot().getTextContent();
        });

        textToShow = textContent?.length > 100 ? `${textContent.slice(0, 100)}\u2026` : textContent;
    }catch(e){
        textToShow = "Error: " + e.text;
    }


    return (
        <span>{textToShow}</span>
    );
};






export const LexicalRichTextFieldComponent: React.FC<Props> = (props) => {
    return (
        <Suspense fallback={<Loading/>}>
            <LexicalRichTextFieldComponent2 {...props} />
        </Suspense>
    );
}
const LexicalRichTextFieldComponent2: React.FC<Props> = (props: Props) => {
    let readOnly = false;
    const {path, editorConfig} = props;
    console.log("path", path)
    //const { value, setValue } = useField<Props>({ path });

    const field = useField<SerializedEditorState>({
        path: path, // required
        // validate: myValidateFunc, // optional
        // disableFormData?: false, // if true, the field's data will be ignored
        // condition?: myConditionHere, // optional, used to skip validation if condition fails
    })

    // Here is what `useField` sends back
    const {
        showError, // whether the field should show as errored
        errorMessage, // the error message to show, if showError
        value, // the current value of the field from the form
        formSubmitted, // if the form has been submitted
        formProcessing, // if the form is currently processing
        setValue, // method to set the field's value in form state
        initialValue, // the initial value that the field mounted with
    } = field;
    //console.log("Value", value)

    return (
        <LexicalEditorComponent
            onChange={(editorState: EditorState, editor: LexicalEditor) => {
                const json = editorState.toJSON();
                if (!readOnly && /* json !== defaultValue && */ json !== value) {
                    setValue(json);
                }
            }}
            initialJSON={value}
        />
    );
};
