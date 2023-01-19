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

export type Feature = {
  plugins?: JSX.Element[];
  subEditorPlugins?: JSX.Element[]; //Like image captions
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
    mentions: {
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
    mentions: {
      enabled: false,
      display: false,
    },
    align: {
      enabled: true,
      display: true,
    },
  },
};
