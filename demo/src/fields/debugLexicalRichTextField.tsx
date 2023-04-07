import { Field } from 'payload/types';
import { lexicalRichTextField } from '../../../src/fields/lexicalRichTextField';
import { ClearEditorFeature } from '../../../src/features/actions/cleareditor/ClearEditorFeature';
import { SpeechToTextFeature } from '../../../src/features/actions/speechtotext/SpeechToTextFeature';
import { TreeViewFeature } from '../../../src/features/debug/treeview/TreeViewFeature';
import { FigmaFeature } from '../../../src/features/embeds/figma/FigmaFeature';
import { TwitterFeature } from '../../../src/features/embeds/twitter/TwitterFeature';
import { YouTubeFeature } from '../../../src/features/embeds/youtube/YouTubeFeature';
import { EmojiPickerFeature } from '../../../src/features/emojipicker/EmojiPickerFeature';
import { EmojisFeature } from '../../../src/features/emojis/EmojisFeature';
import { EquationsFeature } from '../../../src/features/equations/EquationsFeature';
import { HorizontalRuleFeature } from '../../../src/features/horizontalrule/HorizontalRuleFeature';
import { MentionsFeature } from '../../../src/features/mentions/MentionsFeature';
import { KeywordsFeature } from '../../../src/features/keywords/KeywordsFeature';
import { CollapsibleFeature } from '../../../src/features/collapsible/CollapsibleFeature';
import { TypingPerfFeature } from '../../../src/features/debug/typingperf/TypingPerfFeature';
import { PasteLogFeature } from '../../../src/features/debug/pastelog/PasteLogFeature';
import { TestRecorderFeature } from '../../../src/features/debug/testrecorder/TestRecorderFeature';
import { MaxLengthFeature } from '../../../src/features/maxlength/MaxLengthFeature';
import { LinkFeature } from '../../../src/features/linkplugin/LinkFeature';
import { TableOfContentsFeature } from '../../../src/features/tableofcontents/TableOfContentsFeature';

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
      defaultEditorConfig.toggles.textColor.enabled = true;
      defaultEditorConfig.toggles.textBackground.enabled = true;
      defaultEditorConfig.toggles.fontSize.enabled = true;
      defaultEditorConfig.toggles.font.enabled = true;
      defaultEditorConfig.toggles.align.enabled = true;
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
        ClearEditorFeature({}),
        MentionsFeature({}),
        TreeViewFeature({ enabled: defaultEditorConfig.debug }),
        KeywordsFeature({}),
        //AutoCompleteFeature({}),
        CollapsibleFeature({}),
        TypingPerfFeature({ enabled: defaultEditorConfig.debug }),
        PasteLogFeature({ enabled: defaultEditorConfig.debug }),
        TestRecorderFeature({ enabled: defaultEditorConfig.debug }),
        MaxLengthFeature({ enabled: false, maxLength: 30 }),
        LinkFeature({}),
        TableOfContentsFeature({ enabled: true }),
      ];

      return defaultEditorConfig;
    },
  });
}

export default lexicalRichText;
