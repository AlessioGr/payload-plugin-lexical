import {ElementNode, LexicalEditor} from "lexical";

export type EditorConfig = {
    debug: boolean;
    nodes: CustomNode[];
    features: {
        comments: {
            enabled: boolean,
        }
        tables: {
            enabled: boolean,
            display: boolean
        },
        upload: {
            enabled: boolean,
            display: boolean
        },
        twitter: {
            enabled: boolean,
            display: boolean
        },
        youtube: {
            enabled: boolean,
            display: boolean
        },
        figma: {
            enabled: boolean,
            display: boolean
        },
        horizontalRule: {
            enabled: boolean,
            display: boolean
        },
        equations: {
            enabled: boolean,
            display: boolean
        },
        collapsible: {
            enabled: boolean,
            display: boolean
        },
        fontSize: {
            enabled: boolean,
            display: boolean
        },
        font: {
            enabled: boolean,
            display: boolean
        },
        align: {
            enabled: boolean,
            display: boolean
        },
        textColor: {
            enabled: boolean,
            display: boolean
        },
        textBackground: {
            enabled: boolean,
            display: boolean
        },
        mentions: {
            enabled: boolean,
            display: boolean
        },
    }
}

export type CustomNode = {
    node: typeof ElementNode;
    displayName: string;
    identifier: string;
    createFunction: () => void;
    formatFunction: ({blockType, editor}: {blockType: string, editor: LexicalEditor}) => void;
}

