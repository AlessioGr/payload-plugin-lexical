import { Field } from 'payload/types';
import { lexicalRichTextField } from '../../../src//fields/lexicalRichTextField';

import {
  AISuggestFeature,
  ClearEditorFeature,
  CollapsibleFeature,
  EmojiPickerFeature,
  EmojisFeature,
  EquationsFeature,
  FigmaFeature,
  HorizontalRuleFeature,
  ImportFeature,
  ExportFeature,
  KeywordsFeature,
  LinkFeature,
  MaxLengthFeature,
  PasteLogFeature,
  SpeechToTextFeature,
  TableOfContentsFeature,
  TestRecorderFeature,
  TreeViewFeature,
  TwitterFeature,
  TypingPerfFeature,
  YouTubeFeature,
} from '../../../src';
import { InlineProductFeature } from '../customLexicalFeatures/inlineProduct/InlineProductFeature';

function lexicalRichText(props?: {
  name?: string;
  label?: string;
  debug?: boolean;
}): Field {
  return lexicalRichTextField({
    name: props?.name ? props?.name : 'lexical_richtext',
    label: props?.label ? props?.label : 'Rich Text',
    localized: true,
    editorConfigModifier: (defaultEditorConfig) => {
      defaultEditorConfig.debug = props?.debug ? props?.debug : false;
      defaultEditorConfig.toggles.textColor.enabled = false;
      defaultEditorConfig.toggles.textBackground.enabled = false;
      defaultEditorConfig.toggles.fontSize.enabled = false;
      defaultEditorConfig.toggles.font.enabled = false;
      defaultEditorConfig.toggles.align.enabled = false;
      defaultEditorConfig.toggles.tables.enabled = true;
      defaultEditorConfig.toggles.tables.display = true;

      defaultEditorConfig.features = [
        EquationsFeature({}),
        EmojisFeature({}),
        EmojiPickerFeature({}),
        HorizontalRuleFeature({}),
        FigmaFeature({}),
        YouTubeFeature({}),
        TwitterFeature({}),
        SpeechToTextFeature({}),
        ImportFeature({}),
        ExportFeature({}),
        ClearEditorFeature({}),
        //MentionsFeature({}),
        TreeViewFeature({ enabled: defaultEditorConfig.debug }),
        KeywordsFeature({}),
        //AutoCompleteFeature({}),
        CollapsibleFeature({}),
        TypingPerfFeature({ enabled: defaultEditorConfig.debug }),
        PasteLogFeature({ enabled: defaultEditorConfig.debug }),
        TestRecorderFeature({ enabled: defaultEditorConfig.debug }),
        MaxLengthFeature({ enabled: false, maxLength: 30 }),
        LinkFeature({}),
        TableOfContentsFeature({ enabled: false }),
        AISuggestFeature({}),
      ];

      defaultEditorConfig.features.push(InlineProductFeature({}));

      return defaultEditorConfig;
    },
  });
}

export default lexicalRichText;
