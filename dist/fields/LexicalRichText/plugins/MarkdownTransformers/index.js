"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLAYGROUND_TRANSFORMERS = exports.TABLE = exports.IMAGE = void 0;
const markdown_1 = require("@lexical/markdown");
const table_1 = require("@lexical/table");
const lexical_1 = require("lexical");
const ImageNode_1 = require("../../nodes/ImageNode");
exports.IMAGE = {
    dependencies: [ImageNode_1.ImageNode],
    export: (node) => {
        if (!(0, ImageNode_1.$isImageNode)(node)) {
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
const TABLE = (editorConfig) => {
    return {
        dependencies: [table_1.TableNode, table_1.TableRowNode, table_1.TableCellNode],
        export: (node) => {
            if (!(0, table_1.$isTableNode)(node)) {
                return null;
            }
            const output = [];
            for (const row of node.getChildren()) {
                const rowOutput = [];
                if (!(0, table_1.$isTableRowNode)(row)) {
                    continue;
                }
                let isHeaderRow = false;
                for (const cell of row.getChildren()) {
                    // It's TableCellNode so it's just to make flow happy
                    if ((0, table_1.$isTableCellNode)(cell)) {
                        rowOutput.push((0, markdown_1.$convertToMarkdownString)((0, exports.PLAYGROUND_TRANSFORMERS)(editorConfig), cell).replace(/\n/g, '\\n'));
                        if (cell.__headerState === table_1.TableCellHeaderStates.ROW) {
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
                if (!table || !(0, table_1.$isTableNode)(table)) {
                    return;
                }
                const rows = table.getChildren();
                const lastRow = rows[rows.length - 1];
                if (!lastRow || !(0, table_1.$isTableRowNode)(lastRow)) {
                    return;
                }
                // Add header state to row cells
                lastRow.getChildren().forEach((cell) => {
                    if (!(0, table_1.$isTableCellNode)(cell)) {
                        return;
                    }
                    cell.toggleHeaderStyle(table_1.TableCellHeaderStates.ROW);
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
            while (sibling) {
                if (!(0, lexical_1.$isParagraphNode)(sibling)) {
                    break;
                }
                if (sibling.getChildrenSize() !== 1) {
                    break;
                }
                const firstChild = sibling.getFirstChild();
                if (!(0, lexical_1.$isTextNode)(firstChild)) {
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
            const table = (0, table_1.$createTableNode)();
            for (const cells of rows) {
                const tableRow = (0, table_1.$createTableRowNode)();
                table.append(tableRow);
                for (let i = 0; i < maxCells; i++) {
                    tableRow.append(i < cells.length ? cells[i] : createTableCell('', editorConfig));
                }
            }
            const previousSibling = parentNode.getPreviousSibling();
            if ((0, table_1.$isTableNode)(previousSibling)
                && getTableColumnsSize(previousSibling) === maxCells) {
                previousSibling.append(...table.getChildren());
                parentNode.remove();
            }
            else {
                parentNode.replace(table);
            }
            table.selectEnd();
        },
        type: 'element',
    };
};
exports.TABLE = TABLE;
function getTableColumnsSize(table) {
    const row = table.getFirstChild();
    return (0, table_1.$isTableRowNode)(row) ? row.getChildrenSize() : 0;
}
const createTableCell = (textContent, editorConfig) => {
    textContent = textContent.replace(/\\n/g, '\n');
    const cell = (0, table_1.$createTableCellNode)(table_1.TableCellHeaderStates.NO_STATUS);
    (0, markdown_1.$convertFromMarkdownString)(textContent, (0, exports.PLAYGROUND_TRANSFORMERS)(editorConfig), cell);
    return cell;
};
const mapToTableCells = (textContent, editorConfig) => {
    const match = textContent.match(TABLE_ROW_REG_EXP);
    if (!match || !match[1]) {
        return null;
    }
    return match[1].split('|').map((text) => createTableCell(text, editorConfig));
};
const PLAYGROUND_TRANSFORMERS = (editorConfig) => {
    const defaultTransformers = [
        (0, exports.TABLE)(editorConfig),
        exports.IMAGE,
        markdown_1.CHECK_LIST,
        ...markdown_1.ELEMENT_TRANSFORMERS,
        ...markdown_1.TEXT_FORMAT_TRANSFORMERS,
        ...markdown_1.TEXT_MATCH_TRANSFORMERS,
    ];
    for (const feature of editorConfig.features) {
        if (feature.markdownTransformers
            && feature.markdownTransformers.length > 0) {
            for (const transformer of feature.markdownTransformers) {
                defaultTransformers.push(transformer);
            }
        }
    }
    return defaultTransformers;
};
exports.PLAYGROUND_TRANSFORMERS = PLAYGROUND_TRANSFORMERS;
//# sourceMappingURL=index.js.map