/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { EditorThemeClasses } from 'lexical';

import './LexicalEditorTheme.scss';

const theme: EditorThemeClasses = {
  blockCursor: 'LexicalEditorTheme__blockCursor',
  characterLimit: 'LexicalEditorTheme__characterLimit',
  code: 'LexicalEditorTheme__code',
  codeHighlight: {
    atrule: 'LexicalEditorTheme__tokenAttr',
    attr: 'LexicalEditorTheme__tokenAttr',
    boolean: 'LexicalEditorTheme__tokenProperty',
    builtin: 'LexicalEditorTheme__tokenSelector',
    cdata: 'LexicalEditorTheme__tokenComment',
    char: 'LexicalEditorTheme__tokenSelector',
    class: 'LexicalEditorTheme__tokenFunction',
    'class-name': 'LexicalEditorTheme__tokenFunction',
    comment: 'LexicalEditorTheme__tokenComment',
    constant: 'LexicalEditorTheme__tokenProperty',
    deleted: 'LexicalEditorTheme__tokenProperty',
    doctype: 'LexicalEditorTheme__tokenComment',
    entity: 'LexicalEditorTheme__tokenOperator',
    function: 'LexicalEditorTheme__tokenFunction',
    important: 'LexicalEditorTheme__tokenVariable',
    inserted: 'LexicalEditorTheme__tokenSelector',
    keyword: 'LexicalEditorTheme__tokenAttr',
    namespace: 'LexicalEditorTheme__tokenVariable',
    number: 'LexicalEditorTheme__tokenProperty',
    operator: 'LexicalEditorTheme__tokenOperator',
    prolog: 'LexicalEditorTheme__tokenComment',
    property: 'LexicalEditorTheme__tokenProperty',
    punctuation: 'LexicalEditorTheme__tokenPunctuation',
    regex: 'LexicalEditorTheme__tokenVariable',
    selector: 'LexicalEditorTheme__tokenSelector',
    string: 'LexicalEditorTheme__tokenSelector',
    symbol: 'LexicalEditorTheme__tokenProperty',
    tag: 'LexicalEditorTheme__tokenProperty',
    url: 'LexicalEditorTheme__tokenOperator',
    variable: 'LexicalEditorTheme__tokenVariable',
  },
  embedBlock: {
    base: 'LexicalEditorTheme__embedBlock',
    focus: 'LexicalEditorTheme__embedBlockFocus',
  },
  hashtag: 'LexicalEditorTheme__hashtag',
  heading: {
    h1: 'LexicalEditorTheme__h1',
    h2: 'LexicalEditorTheme__h2',
    h3: 'LexicalEditorTheme__h3',
    h4: 'LexicalEditorTheme__h4',
    h5: 'LexicalEditorTheme__h5',
    h6: 'LexicalEditorTheme__h6',
  },
  image: 'editor-image',
  indent: 'LexicalEditorTheme__indent',
  link: 'LexicalEditorTheme__link',
  list: {
    listitem: 'LexicalEditorTheme__listItem',
    listitemChecked: 'LexicalEditorTheme__listItemChecked',
    listitemUnchecked: 'LexicalEditorTheme__listItemUnchecked',
    nested: {
      listitem: 'LexicalEditorTheme__nestedListItem',
    },
    olDepth: [
      'LexicalEditorTheme__ol1',
      'LexicalEditorTheme__ol2',
      'LexicalEditorTheme__ol3',
      'LexicalEditorTheme__ol4',
      'LexicalEditorTheme__ol5',
    ],
    ul: 'LexicalEditorTheme__ul',
  },
  ltr: 'LexicalEditorTheme__ltr',
  mark: 'LexicalEditorTheme__mark',
  markOverlap: 'LexicalEditorTheme__markOverlap',
  paragraph: 'LexicalEditorTheme__paragraph',
  quote: 'LexicalEditorTheme__quote',
  rtl: 'LexicalEditorTheme__rtl',
  table: 'LexicalEditorTheme__table',
  tableAddColumns: 'LexicalEditorTheme__tableAddColumns',
  tableAddRows: 'LexicalEditorTheme__tableAddRows',
  tableCell: 'LexicalEditorTheme__tableCell',
  tableCellActionButton: 'LexicalEditorTheme__tableCellActionButton',
  tableCellActionButtonContainer: 'LexicalEditorTheme__tableCellActionButtonContainer',
  tableCellEditing: 'LexicalEditorTheme__tableCellEditing',
  tableCellHeader: 'LexicalEditorTheme__tableCellHeader',
  tableCellPrimarySelected: 'LexicalEditorTheme__tableCellPrimarySelected',
  tableCellResizer: 'LexicalEditorTheme__tableCellResizer',
  tableCellSelected: 'LexicalEditorTheme__tableCellSelected',
  tableCellSortedIndicator: 'LexicalEditorTheme__tableCellSortedIndicator',
  tableResizeRuler: 'LexicalEditorTheme__tableCellResizeRuler',
  tableSelected: 'LexicalEditorTheme__tableSelected',
  text: {
    bold: 'LexicalEditorTheme__textBold',
    code: 'LexicalEditorTheme__textCode',
    italic: 'LexicalEditorTheme__textItalic',
    strikethrough: 'LexicalEditorTheme__textStrikethrough',
    subscript: 'LexicalEditorTheme__textSubscript',
    superscript: 'LexicalEditorTheme__textSuperscript',
    underline: 'LexicalEditorTheme__textUnderline',
    underlineStrikethrough: 'LexicalEditorTheme__textUnderlineStrikethrough',
  },
};

export default theme;
