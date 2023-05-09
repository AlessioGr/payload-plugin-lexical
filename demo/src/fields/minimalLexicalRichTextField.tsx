import { Field } from 'payload/types';
import { lexicalRichTextField } from '../../../src//fields/lexicalRichTextField';
import { LinkFeature } from '../../../src';

function lexicalRichText(props?: { name?: string; label?: string; debug?: boolean }): Field {
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
      defaultEditorConfig.toggles.tables.display = false;
      defaultEditorConfig.toggles.comments.enabled = false;
      //defaultEditorConfig.toggles.upload.enabled = false;

      defaultEditorConfig.features = [LinkFeature()];

      return defaultEditorConfig;
    },
  });
}

export default lexicalRichText;
