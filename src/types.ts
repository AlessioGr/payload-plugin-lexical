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
import { KeywordsFeature } from "./features/keywords/KeywordsFeature";
import { AutoCompleteFeature } from "./features/autocomplete/AutoCompleteFeature";
import { CollapsibleFeature } from "./features/collapsible/CollapsibleFeature";
import { TypingPerfFeature } from "./features/debug/typingperf/TypingPerfFeature";
import { PasteLogFeature } from "./features/debug/pastelog/PasteLogFeature";
import { TestRecorderFeature } from "./features/debug/testrecorder/TestRecorderFeature";
import { MaxLengthFeature } from "./features/maxlength/MaxLengthFeature";
import { LinkFeature } from "./features/linkplugin/LinkFeature";

export type Feature = {
  plugins?: {
    // plugins are anything which is not directly part of the editor. Like, creating a command which creates a node, or opens a modal, or some other more "outside" functionality
    component: JSX.Element;
    position?: "normal" | "bottom" | "outside"; //Outside means it's put in LexicalEditorComponent.tsx and not LexicalRichText.tsx
  }[];
  floatingAnchorElemPlugins?: ((
    floatingAnchorElem: HTMLDivElement
  ) => JSX.Element)[]; // Plugins which are put in the floating anchor element (the thing which appears when you select text)
  subEditorPlugins?: JSX.Element[]; // Plugins which are embedded in other sub-editor, like image captions (which is basically an editor inside of an editor)
  tablePlugins?: JSX.Element[]; // Plugins which are put inside of the newtable plugin
  nodes?: Array<Klass<LexicalNode>>; //Nodes = Leaves and elements in Slate. Nodes are what's actually part of the editor JSON
  tableCellNodes?: Array<Klass<LexicalNode>>; // Nodes which are put inside of the newtable plugin
  modals?: {
    // Modals / Drawers. They can be defined here in order to be able to open or close them with a simple lexical command. This also ensures the modals/drawers are "placed" at the correct position
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
    // You can customize the items displayed in the toolbar here
    // TODO: Revamp toolbar completely
    insert?: ((
      editor: LexicalEditor,
      editorConfig: EditorConfig
    ) => JSX.Element)[];
    normal?: ((
      editor: LexicalEditor,
      editorConfig: EditorConfig,
      isEditable: boolean
    ) => JSX.Element)[];
  };
  floatingTextFormatToolbar?: {
    // The floating toolbar which appears when you select text
    components?: ((
      editor: LexicalEditor,
      editorConfig: EditorConfig
    ) => JSX.Element)[];
  };
  componentPicker?: {
    // Component picker is the thing which pops up when you type "/". Basically slash commands.
    componentPickerOptions: ((
      editor: LexicalEditor,
      editorConfig: EditorConfig
    ) => ComponentPickerOption)[];
  };
  markdownTransformers?: Transformer[]; // Not sure what this is exactly
  embedConfigs?: PlaygroundEmbedConfig[]; // Every embed plugin / node (like twitter, youtube or figma embeds) should define one of those
  actions?: JSX.Element[]; //Actions are added in the ActionsPlugin - it's the buttons you see on the bottom right of the editor
};

export type EditorConfig = {
  debug: boolean;
  features: Feature[];
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
    KeywordsFeature({}),
    AutoCompleteFeature({}),
    CollapsibleFeature({}),
    TypingPerfFeature({ enabled: false }),
    PasteLogFeature({ enabled: false }),
    TestRecorderFeature({ enabled: false }),
    MaxLengthFeature({ enabled: false, maxLength: 30 }),
    LinkFeature({}),
  ],
  toggles: {
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
