/// <reference types="react" />
import { LexicalEditor, LexicalNode, Klass } from 'lexical';
import { Transformer } from '@lexical/markdown';
import { ComponentPickerOption } from './fields/LexicalRichText/plugins/ComponentPickerPlugin';
import { PlaygroundEmbedConfig } from './fields/LexicalRichText/plugins/AutoEmbedPlugin';
export type Feature = {
    plugins?: {
        component: JSX.Element;
        position?: 'normal' | 'bottom' | 'outside' | 'bottomInContainer';
        onlyIfNotEditable?: boolean;
    }[];
    floatingAnchorElemPlugins?: ((floatingAnchorElem: HTMLDivElement) => JSX.Element)[];
    subEditorPlugins?: JSX.Element[];
    tablePlugins?: JSX.Element[];
    nodes?: Array<Klass<LexicalNode>>;
    tableCellNodes?: Array<Klass<LexicalNode>>;
    modals?: {
        openModalCommand: {
            type: string;
            command: (toggleModal: (slug: string) => void, editDepth: number, uuid: string) => void;
        };
        modal: (props: {
            editorConfig: EditorConfig;
        }) => JSX.Element;
    }[];
    toolbar?: {
        insert?: ((editor: LexicalEditor, editorConfig: EditorConfig) => JSX.Element)[];
        normal?: ((editor: LexicalEditor, editorConfig: EditorConfig, isEditable: boolean) => JSX.Element)[];
    };
    floatingTextFormatToolbar?: {
        components?: ((editor: LexicalEditor, editorConfig: EditorConfig) => JSX.Element)[];
    };
    componentPicker?: {
        componentPickerOptions: ((editor: LexicalEditor, editorConfig: EditorConfig) => ComponentPickerOption)[];
    };
    markdownTransformers?: Transformer[];
    embedConfigs?: PlaygroundEmbedConfig[];
    actions?: JSX.Element[];
};
export type EditorConfig = {
    debug: boolean;
    features: Feature[];
    output?: {
        html?: {
            enabled: boolean;
        };
        markdown?: {
            enabled: boolean;
        };
    };
    toggles: {
        comments: {
            enabled: boolean;
        };
        tables: {
            enabled: boolean;
            display: boolean;
        };
        upload: {
            enabled: boolean;
            display: boolean;
        };
        fontSize: {
            enabled: boolean;
            display: boolean;
        };
        font: {
            enabled: boolean;
            display: boolean;
        };
        align: {
            enabled: boolean;
            display: boolean;
        };
        textColor: {
            enabled: boolean;
            display: boolean;
        };
        textBackground: {
            enabled: boolean;
            display: boolean;
        };
    };
};
export declare const defaultEditorConfig: EditorConfig;
