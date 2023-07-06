"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultEditorConfig = void 0;
const EmojiPickerFeature_1 = require("./features/emojipicker/EmojiPickerFeature");
const EmojisFeature_1 = require("./features/emojis/EmojisFeature");
const EquationsFeature_1 = require("./features/equations/EquationsFeature");
const HorizontalRuleFeature_1 = require("./features/horizontalrule/HorizontalRuleFeature");
const FigmaFeature_1 = require("./features/embeds/figma/FigmaFeature");
const YouTubeFeature_1 = require("./features/embeds/youtube/YouTubeFeature");
const TwitterFeature_1 = require("./features/embeds/twitter/TwitterFeature");
const SpeechToTextFeature_1 = require("./features/actions/speechtotext/SpeechToTextFeature");
const ClearEditorFeature_1 = require("./features/actions/cleareditor/ClearEditorFeature");
const MentionsFeature_1 = require("./features/mentions/MentionsFeature");
const TreeViewFeature_1 = require("./features/debug/treeview/TreeViewFeature");
const KeywordsFeature_1 = require("./features/keywords/KeywordsFeature");
const AutoCompleteFeature_1 = require("./features/autocomplete/AutoCompleteFeature");
const CollapsibleFeature_1 = require("./features/collapsible/CollapsibleFeature");
const TypingPerfFeature_1 = require("./features/debug/typingperf/TypingPerfFeature");
const PasteLogFeature_1 = require("./features/debug/pastelog/PasteLogFeature");
const TestRecorderFeature_1 = require("./features/debug/testrecorder/TestRecorderFeature");
const MaxLengthFeature_1 = require("./features/maxlength/MaxLengthFeature");
const LinkFeature_1 = require("./features/linkplugin/LinkFeature");
const TableOfContentsFeature_1 = require("./features/tableofcontents/TableOfContentsFeature");
const ImportFeature_1 = require("./features/actions/import/ImportFeature");
const ExportFeature_1 = require("./features/actions/export/ExportFeature");
const features_1 = require("./features");
exports.defaultEditorConfig = {
    debug: true,
    output: {
        html: {
            enabled: false,
        },
        markdown: {
            enabled: false,
        },
    },
    features: [
        (0, EquationsFeature_1.EquationsFeature)({}),
        (0, EmojisFeature_1.EmojisFeature)({}),
        (0, EmojiPickerFeature_1.EmojiPickerFeature)({}),
        (0, HorizontalRuleFeature_1.HorizontalRuleFeature)({}),
        (0, FigmaFeature_1.FigmaFeature)({}),
        (0, YouTubeFeature_1.YouTubeFeature)({}),
        (0, TwitterFeature_1.TwitterFeature)({}),
        (0, SpeechToTextFeature_1.SpeechToTextFeature)({}),
        (0, ImportFeature_1.ImportFeature)({}),
        (0, ExportFeature_1.ExportFeature)({}),
        (0, ClearEditorFeature_1.ClearEditorFeature)({}),
        (0, features_1.ReadOnlyModeFeature)({}),
        (0, features_1.ConvertFromMarkdownFeature)({}),
        (0, MentionsFeature_1.MentionsFeature)({}),
        (0, TreeViewFeature_1.TreeViewFeature)({ enabled: false }),
        (0, KeywordsFeature_1.KeywordsFeature)({}),
        (0, AutoCompleteFeature_1.AutoCompleteFeature)({}),
        (0, CollapsibleFeature_1.CollapsibleFeature)({}),
        (0, TypingPerfFeature_1.TypingPerfFeature)({ enabled: false }),
        (0, PasteLogFeature_1.PasteLogFeature)({ enabled: false }),
        (0, TestRecorderFeature_1.TestRecorderFeature)({ enabled: false }),
        (0, MaxLengthFeature_1.MaxLengthFeature)({ enabled: false, maxLength: 30 }),
        (0, LinkFeature_1.LinkFeature)({}),
        (0, TableOfContentsFeature_1.TableOfContentsFeature)({ enabled: false }),
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
//# sourceMappingURL=types.js.map