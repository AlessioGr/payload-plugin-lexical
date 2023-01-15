import {ElementNode, LexicalEditor, LexicalNode, Klass} from "lexical";

export type EditorConfig = {
    debug: boolean;
    simpleNodes: CustomNode[];
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
    },
    extraPlugins: JSX.Element[]
    extraNodes: Array<Klass<LexicalNode>>,
    extraModals: {
        openModalCommand: {
            type: string,
            command: (toggleModal: (slug: string) => void, editDepth: number) => void,
        }
        modal: (props: { editorConfig: EditorConfig}) => JSX.Element,
    }[],
    extraToolbarElements: {
        insert: ((editor: LexicalEditor) => JSX.Element)[]
    }
}

export const defaultEditorConfig: EditorConfig = {
    debug: true,
    simpleNodes: [],
    features: {
        comments: {
            enabled: true,
        },
        tables: {
            enabled: true,
            display: false
        },
        upload: {
            enabled: true,
            display: true
        },
        twitter: {
            enabled: true,
            display: true
        },
        youtube: {
            enabled: true,
            display: true
        },
        figma: {
            enabled: true,
            display: true
        },
        horizontalRule: {
            enabled: true,
            display: true
        },
        equations: {
            enabled: true,
            display: true
        },
        collapsible: {
            enabled: true,
            display: true
        },
        fontSize: {
            enabled: true,
            display: true
        },
        font: {
            enabled: true,
            display: true
        },
        textColor: {
            enabled: true,
            display: true
        },
        textBackground: {
            enabled: true,
            display: true
        },
        mentions: {
            enabled: false,
            display: false
        },
        align: {
            enabled: true,
            display: true
        },
    },
    extraPlugins: [],
    extraNodes: [],
    extraModals: [],
    extraToolbarElements: {
        insert: [],
    }
}

export type CustomNode = {
    node: typeof ElementNode;
    displayName: string;
    identifier: string;
    createFunction: () => void;
    formatFunction: ({blockType, editor}: {blockType: string, editor: LexicalEditor}) => void;
}

