import React, { Suspense, useCallback } from 'react';
import {$getRoot, EditorState, LexicalEditor} from 'lexical';
import { Props } from './types';
import { LexicalEditorComponent } from './LexicalEditorComponent';

import './index.scss';
import Loading from 'payload/dist/admin/components/elements/Loading'

const baseClass = 'lexicalRichTextEditor';

import { useField } from "payload/components/forms";
import PlaygroundNodes from "./nodes/PlaygroundNodes";
import PlaygroundEditorTheme from "./themes/PlaygroundEditorTheme";
import {createHeadlessEditor} from "@lexical/headless";

export function populateLexicalRelationships(){

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

    const editor: LexicalEditor = createHeadlessEditor(initialConfig);
    editor.setEditorState(editor.parseEditorState(data));

    const textContent = editor.getEditorState().read(() => {
        return $getRoot().getTextContent();
    });

    const textToShow = textContent?.length > 100 ? `${textContent.slice(0, 100)}\u2026` : textContent;


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
    console.log("Value", value)

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
