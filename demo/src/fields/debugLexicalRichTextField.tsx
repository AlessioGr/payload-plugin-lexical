import { Field } from 'payload/types';
import { lexicalRichTextField } from '../../../src/fields/lexicalRichTextField';
import {
  EquationsFeature,
  EmojisFeature,
  EmojiPickerFeature,
  HorizontalRuleFeature,
  FigmaFeature,
  YouTubeFeature,
  TwitterFeature,
  SpeechToTextFeature,
  ImportFeature,
  ExportFeature,
  ClearEditorFeature,
  MentionsFeature,
  TreeViewFeature,
  KeywordsFeature,
  CollapsibleFeature,
  TypingPerfFeature,
  PasteLogFeature,
  TestRecorderFeature,
  MaxLengthFeature,
  LinkFeature,
  TableOfContentsFeature,
  ReadOnlyModeFeature,
  ConvertFromMarkdownFeature,
} from '../../../src';

function lexicalRichText(props?: { name?: string; label?: string; debug?: boolean }): Field {
  return lexicalRichTextField({
    name: props?.name ? props?.name : 'lexical_richtext',
    label: props?.label ? props?.label : 'Rich Text',
    localized: true,
    editorConfigModifier: (defaultEditorConfig) => {
      defaultEditorConfig.debug = props?.debug ? props?.debug : false;
      defaultEditorConfig.toggles.textColor.enabled = true;
      defaultEditorConfig.toggles.textBackground.enabled = true;
      defaultEditorConfig.toggles.fontSize.enabled = true;
      defaultEditorConfig.toggles.font.enabled = true;
      defaultEditorConfig.toggles.align.enabled = true;
      defaultEditorConfig.toggles.tables.enabled = true;
      defaultEditorConfig.toggles.tables.display = true;

      defaultEditorConfig.features = [
        EquationsFeature(),
        EmojisFeature(),
        EmojiPickerFeature(),
        HorizontalRuleFeature(),
        FigmaFeature(),
        YouTubeFeature(),
        TwitterFeature(),
        SpeechToTextFeature(),
        ImportFeature(),
        ExportFeature(),
        ClearEditorFeature(),
        ReadOnlyModeFeature(),
        ConvertFromMarkdownFeature(),
        MentionsFeature(),
        TreeViewFeature({ enabled: defaultEditorConfig.debug }),
        KeywordsFeature(),
        //AutoCompleteFeature(),
        CollapsibleFeature(),
        TypingPerfFeature({ enabled: defaultEditorConfig.debug }),
        PasteLogFeature({ enabled: defaultEditorConfig.debug }),
        TestRecorderFeature({ enabled: defaultEditorConfig.debug }),
        MaxLengthFeature({ enabled: false, maxLength: 30 }),
        LinkFeature(),
        TableOfContentsFeature({ enabled: true }),
      ];

      return defaultEditorConfig;
    },
  });
}

export default lexicalRichText;
