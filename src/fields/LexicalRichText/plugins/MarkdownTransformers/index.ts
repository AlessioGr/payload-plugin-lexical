/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  type ElementTransformer,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
  type TextMatchTransformer,
  type Transformer,
} from '@lexical/markdown';
import {
  $createTableCellNode,
  $createTableNode,
  $createTableRowNode,
  $isTableCellNode,
  $isTableNode,
  $isTableRowNode,
  TableCellHeaderStates,
  TableCellNode,
  TableNode,
  TableRowNode,
} from '@lexical/table';
import { $isParagraphNode, $isTextNode, type LexicalNode } from 'lexical';

import { type EditorConfig } from '../../../../types';
import { $isImageNode, ImageNode } from '../../nodes/ImageNode';

export const IMAGE: TextMatchTransformer = {
  dependencies: [ImageNode],
  export: (node) => {
    if (!$isImageNode(node)) {
      return null;
    }

    return `![${node.getAltText()}](${node.getSrc()})`;
  },
  importRegExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))/,
  regExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))$/,
  replace: (textNode, match) => {
    const [, altText, src] = match;
    /* const imageNode = $createImageNode({
      altText,
      maxWidth: 800,
      src,
    });
    textNode.replace(imageNode); */ // TODO
  },
  trigger: ')',
  type: 'text-match',
};

// Very primitive table setup
const TABLE_ROW_REG_EXP = /^(?:\|)(.+)(?:\|)\s?$/;
const TABLE_ROW_DIVIDER_REG_EXP = /^(\| ?:?-*:? ?)+\|\s?$/;

export const TABLE: (editorConfig: EditorConfig) => ElementTransformer = (editorConfig) => {
  return {
    dependencies: [TableNode, TableRowNode, TableCellNode],
    export: (node: LexicalNode) => {
      if (!$isTableNode(node)) {
        return null;
      }

      const output: string[] = [];

      for (const row of node.getChildren()) {
        const rowOutput: string[] = [];
        if (!$isTableRowNode(row)) {
          continue;
        }

        let isHeaderRow = false;
        for (const cell of row.getChildren()) {
          // It's TableCellNode so it's just to make flow happy
          if ($isTableCellNode(cell)) {
            rowOutput.push(
              $convertToMarkdownString(PLAYGROUND_TRANSFORMERS(editorConfig), cell).replace(
                /\n/g,
                '\\n'
              )
            );
            if (cell.__headerState === TableCellHeaderStates.ROW) {
              isHeaderRow = true;
            }
          }
        }

        output.push(`| ${rowOutput.join(' | ')} |`);
        if (isHeaderRow) {
          output.push(`| ${rowOutput.map((_) => '---').join(' | ')} |`);
        }
      }

      return output.join('\n');
    },
    regExp: TABLE_ROW_REG_EXP,
    replace: (parentNode, _1, match) => {
      // Header row
      if (TABLE_ROW_DIVIDER_REG_EXP.test(match[0])) {
        const table = parentNode.getPreviousSibling();
        if (table == null || !$isTableNode(table)) {
          return;
        }

        const rows = table.getChildren();
        const lastRow = rows[rows.length - 1];
        if (lastRow == null || !$isTableRowNode(lastRow)) {
          return;
        }

        // Add header state to row cells
        lastRow.getChildren().forEach((cell) => {
          if (!$isTableCellNode(cell)) {
            return;
          }
          cell.toggleHeaderStyle(TableCellHeaderStates.ROW);
        });

        // Remove line
        parentNode.remove();
        return;
      }

      const matchCells = mapToTableCells(match[0], editorConfig);

      if (matchCells == null) {
        return;
      }

      const rows = [matchCells];
      let sibling = parentNode.getPreviousSibling();
      let maxCells = matchCells.length;

      while (sibling != null) {
        if (!$isParagraphNode(sibling)) {
          break;
        }

        if (sibling.getChildrenSize() !== 1) {
          break;
        }

        const firstChild = sibling.getFirstChild();

        if (!$isTextNode(firstChild)) {
          break;
        }

        const cells = mapToTableCells(firstChild.getTextContent(), editorConfig);

        if (cells == null) {
          break;
        }

        maxCells = Math.max(maxCells, cells.length);
        rows.unshift(cells);
        const previousSibling = sibling.getPreviousSibling();
        sibling.remove();
        sibling = previousSibling;
      }

      const table = $createTableNode();

      for (const cells of rows) {
        const tableRow = $createTableRowNode();
        table.append(tableRow);

        for (let i = 0; i < maxCells; i++) {
          tableRow.append(i < cells.length ? cells[i] : createTableCell('', editorConfig));
        }
      }

      const previousSibling = parentNode.getPreviousSibling();
      if ($isTableNode(previousSibling) && getTableColumnsSize(previousSibling) === maxCells) {
        previousSibling.append(...table.getChildren());
        parentNode.remove();
      } else {
        parentNode.replace(table);
      }

      table.selectEnd();
    },
    type: 'element',
  };
};

function getTableColumnsSize(table: TableNode): number {
  const row = table.getFirstChild();
  return $isTableRowNode(row) ? row.getChildrenSize() : 0;
}

const createTableCell = (textContent: string, editorConfig: EditorConfig): TableCellNode => {
  textContent = textContent.replace(/\\n/g, '\n');
  const cell = $createTableCellNode(TableCellHeaderStates.NO_STATUS);
  $convertFromMarkdownString(textContent, PLAYGROUND_TRANSFORMERS(editorConfig), cell);
  return cell;
};

const mapToTableCells = (
  textContent: string,
  editorConfig: EditorConfig
): TableCellNode[] | null => {
  const match = textContent.match(TABLE_ROW_REG_EXP);
  if (match == null || match[1] == null) {
    return null;
  }

  return match[1].split('|').map((text) => createTableCell(text, editorConfig));
};

export const PLAYGROUND_TRANSFORMERS: (editorConfig: EditorConfig) => Transformer[] = (
  editorConfig
) => {
  const defaultTransformers = [
    TABLE(editorConfig),
    IMAGE,
    CHECK_LIST,
    ...ELEMENT_TRANSFORMERS,
    ...TEXT_FORMAT_TRANSFORMERS,
    ...TEXT_MATCH_TRANSFORMERS,
  ];

  for (const feature of editorConfig.features) {
    if (feature.markdownTransformers != null && feature.markdownTransformers.length > 0) {
      for (const transformer of feature.markdownTransformers) {
        defaultTransformers.push(transformer);
      }
    }
  }

  return defaultTransformers;
};
