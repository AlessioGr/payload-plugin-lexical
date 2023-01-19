import { LexicalEditor, LexicalNode, Klass } from "lexical";
import { EmojiPickerFeature } from "./features/emojipicker/EmojiPickerFeature";
import { EmojisFeature } from "./features/emojis/EmojisFeature";
import { EquationsFeature } from "./features/equations/EquationsFeature";
import { HorizontalRuleFeature } from "./features/horizontalrule/HorizontalRuleFeature";
import { ComponentPickerOption } from "./fields/LexicalRichText/plugins/ComponentPickerPlugin";
import { Transformer } from "@lexical/markdown";
import { FigmaFeature } from "./features/embeds/figma/FigmaFeature";
import { PlaygroundEmbedConfig } from "./fields/LexicalRichText/plugins/AutoEmbedPlugin";
import { YouTubeFeature } from "./features/embeds/youtube/YouTubeFeature";
import { TwitterFeature } from "./features/embeds/twitter/TwitterFeature";
import { SpeechToTextFeature } from "./features/actions/speechtotext/SpeechToTextFeature";
import { ClearEditorFeature } from "./features/actions/cleareditor/ClearEditorFeature";
import { MentionsFeature } from "./features/mentions/MentionsFeature";
import { TreeViewFeature } from "./features/debug/treeview/TreeViewFeature";

export type Feature = {
  plugins?: {
    component: JSX.Element;
    position?: "normal" | "bottom";
  }[];
  subEditorPlugins?: JSX.Element[]; //Like image captions
  tablePlugins?: JSX.Element[]; //Put inside the newtable plugin
  nodes?: Array<Klass<LexicalNode>>;
  tableCellNodes?: Array<Klass<LexicalNode>>;
  modals?: {
    openModalCommand: {
      type: string;
      command: (toggleModal: (slug: string) => void, editDepth: number) => void;
    };
    modal: (props: {
      activeEditor: LexicalEditor;
      editorConfig: EditorConfig;
    }) => JSX.Element;
  }[];
  toolbar?: {
    // TODO: Revamp toolbar completely
    insert: ((
      editor: LexicalEditor,
      editorConfig: EditorConfig
    ) => JSX.Element)[];
  };
  componentPicker?: {
    componentPickerOptions: ((
      editor: LexicalEditor,
      editorConfig: EditorConfig
    ) => ComponentPickerOption)[];
  };
  markdownTransformers?: Transformer[];
  embedConfigs?: PlaygroundEmbedConfig[];
  actions?: JSX.Element[]; //Actions are added in the ActionsPlugin - it's the buttons you see on the bottom right of the editor
};

export type EditorConfig = {
  debug: boolean;
  features: Feature[];
  featuresold: {
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
    collapsible: {
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

export const defaultEditorConfig: EditorConfig = {
  debug: true,
  features: [
    EquationsFeature({}),
    EmojisFeature({}),
    EmojiPickerFeature({}),
    HorizontalRuleFeature({}),
    FigmaFeature({}),
    YouTubeFeature({}),
    TwitterFeature({}),
    SpeechToTextFeature({}),
    ClearEditorFeature({}),
    MentionsFeature({}),
    TreeViewFeature({ enabled: false }),
  ],
  featuresold: {
    comments: {
      enabled: true,
    },
    tables: {
      enabled: true,
      display: false,
    },
    upload: {
      enabled: true,
      display: true,
    },
    collapsible: {
      enabled: true,
      display: true,
    },
    fontSize: {
      enabled: true,
      display: true,
    },
    font: {
      enabled: true,
      display: true,
    },
    textColor: {
      enabled: true,
      display: true,
    },
    textBackground: {
      enabled: true,
      display: true,
    },
    align: {
      enabled: true,
      display: true,
    },
  },
};
