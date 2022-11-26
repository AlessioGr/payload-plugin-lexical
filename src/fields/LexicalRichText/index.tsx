import React, { Suspense, useCallback } from 'react';
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
import {FieldHook} from "payload/types";
import {ExtraAttributes, RawImagePayload} from "./nodes/ImageNode";
import payload from "payload";

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

async function traverseLexicalField(node: SerializedLexicalNode, locale: string): Promise<SerializedLexicalNode> {
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

export const populateLexicalRelationships: FieldHook = async ({originalDoc, data, value, siblingData, req}) =>  {
    const lexicalRichTextField: SerializedEditorState = value;

    let a = lexicalRichTextField.root.children;

    if(lexicalRichTextField.root.children){

        let newChildren = [];
        for(let childNode of lexicalRichTextField.root.children){
            newChildren.push(await traverseLexicalField(childNode, req.locale));
        }
        lexicalRichTextField.root.children = newChildren;

    }

    return lexicalRichTextField;
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



export const LexicalRichTextField: React.FC<Props> = (props) => {
    return (
        <Suspense fallback={<Loading/>}>
            <LexicalRichText2 {...props} />
        </Suspense>
    );
}
const LexicalRichText2: React.FC<Props> = (props: Props) => {
    let readOnly = false;
    const {path} = props;
    const { value, setValue } = useField<Props>({ path });
    //console.log("Value", value)

    return (
        <LexicalEditorComponent
            onChange={(editorState: EditorState, editor: LexicalEditor) => {
                const json = editorState.toJSON();
                // @ts-ignore TODO
                if (!readOnly && /* json !== defaultValue && */ json !== value) {
                    setValue(json);
                }
            }}
            initialJSON={value}
        />
    );
};
