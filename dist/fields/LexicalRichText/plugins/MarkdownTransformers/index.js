"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLAYGROUND_TRANSFORMERS = exports.TABLE = exports.TWEET = exports.EQUATION = exports.IMAGE = exports.HR = void 0;
const markdown_1 = require("@lexical/markdown");
const LexicalHorizontalRuleNode_1 = require("@lexical/react/LexicalHorizontalRuleNode");
const table_1 = require("@lexical/table");
const lexical_1 = require("lexical");
const EquationNode_1 = require("../../nodes/EquationNode");
const ImageNode_1 = require("../../nodes/ImageNode");
const TweetNode_1 = require("../../nodes/TweetNode");
exports.HR = {
    dependencies: [LexicalHorizontalRuleNode_1.HorizontalRuleNode],
    export: (node) => {
        return (0, LexicalHorizontalRuleNode_1.$isHorizontalRuleNode)(node) ? '***' : null;
    },
    regExp: /^(---|\*\*\*|___)\s?$/,
    replace: (parentNode, _1, _2, isImport) => {
        const line = (0, LexicalHorizontalRuleNode_1.$createHorizontalRuleNode)();
        // TODO: Get rid of isImport flag
        if (isImport || parentNode.getNextSibling() != null) {
            parentNode.replace(line);
        }
        else {
            parentNode.insertBefore(line);
        }
        line.selectNext();
    },
    type: 'element',
};
exports.IMAGE = {
    dependencies: [ImageNode_1.ImageNode],
    export: (node, exportChildren, exportFormat) => {
        if (!(0, ImageNode_1.$isImageNode)(node)) {
            return null;
        }
        return `![${node.getAltText()}](${node.getSrc()})`;
    },
    importRegExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))/,
    regExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))$/,
    replace: (textNode, match) => {
        const [, altText, src] = match;
        const imageNode = (0, ImageNode_1.$createImageNode)({
            altText,
            maxWidth: 800,
            src,
        });
        textNode.replace(imageNode);
    },
    trigger: ')',
    type: 'text-match',
};
exports.EQUATION = {
    dependencies: [EquationNode_1.EquationNode],
    export: (node, exportChildren, exportFormat) => {
        if (!(0, EquationNode_1.$isEquationNode)(node)) {
            return null;
        }
        return `$${node.getEquation()}$`;
    },
    importRegExp: /\$([^$].+?)\$/,
    regExp: /\$([^$].+?)\$$/,
    replace: (textNode, match) => {
        const [, equation] = match;
        const equationNode = (0, EquationNode_1.$createEquationNode)(equation, true);
        textNode.replace(equationNode);
    },
    trigger: '$',
    type: 'text-match',
};
exports.TWEET = {
    dependencies: [TweetNode_1.TweetNode],
    export: (node) => {
        if (!(0, TweetNode_1.$isTweetNode)(node)) {
            return null;
        }
        return `<tweet id="${node.getId()}" />`;
    },
    regExp: /<tweet id="([^"]+?)"\s?\/>\s?$/,
    replace: (textNode, _1, match) => {
        const [, id] = match;
        const tweetNode = (0, TweetNode_1.$createTweetNode)(id);
        textNode.replace(tweetNode);
    },
    type: 'element',
};
// Very primitive table setup
const TABLE_ROW_REG_EXP = /^(?:\|)(.+)(?:\|)\s?$/;
exports.TABLE = {
    // TODO: refactor transformer for new TableNode
    dependencies: [table_1.TableNode, table_1.TableRowNode, table_1.TableCellNode],
    export: (node, exportChildren) => {
        if (!(0, table_1.$isTableNode)(node)) {
            return null;
        }
        const output = [];
        for (const row of node.getChildren()) {
            const rowOutput = [];
            if ((0, table_1.$isTableRowNode)(row)) {
                for (const cell of row.getChildren()) {
                    // It's TableCellNode (hence ElementNode) so it's just to make flow happy
                    if ((0, lexical_1.$isElementNode)(cell)) {
                        rowOutput.push(exportChildren(cell));
                    }
                }
            }
            output.push(`| ${rowOutput.join(' | ')} |`);
        }
        return output.join('\n');
    },
    regExp: TABLE_ROW_REG_EXP,
    replace: (parentNode, _1, match) => {
        const matchCells = mapToTableCells(match[0]);
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
            const cells = mapToTableCells(firstChild.getTextContent());
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
                tableRow.append(i < cells.length ? cells[i] : createTableCell(null));
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
function getTableColumnsSize(table) {
    const row = table.getFirstChild();
    return (0, table_1.$isTableRowNode)(row) ? row.getChildrenSize() : 0;
}
const createTableCell = (textContent) => {
    const cell = (0, table_1.$createTableCellNode)(table_1.TableCellHeaderStates.NO_STATUS);
    const paragraph = (0, lexical_1.$createParagraphNode)();
    if (textContent != null) {
        paragraph.append((0, lexical_1.$createTextNode)(textContent.trim()));
    }
    cell.append(paragraph);
    return cell;
};
const mapToTableCells = (textContent) => {
    // TODO:
    // For now plain text, single node. Can be expanded to more complex content
    // including formatted text
    const match = textContent.match(TABLE_ROW_REG_EXP);
    if (!match || !match[1]) {
        return null;
    }
    return match[1].split('|').map((text) => createTableCell(text));
};
exports.PLAYGROUND_TRANSFORMERS = [
    exports.TABLE,
    exports.HR,
    exports.IMAGE,
    exports.EQUATION,
    exports.TWEET,
    markdown_1.CHECK_LIST,
    ...markdown_1.ELEMENT_TRANSFORMERS,
    ...markdown_1.TEXT_FORMAT_TRANSFORMERS,
    ...markdown_1.TEXT_MATCH_TRANSFORMERS,
];
