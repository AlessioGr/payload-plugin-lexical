"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./index.scss");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const LexicalTableOfContents_1 = __importDefault(require("@lexical/react/LexicalTableOfContents"));
const react_1 = require("react");
const React = __importStar(require("react"));
const MARGIN_ABOVE_EDITOR = 624;
const HEADING_WIDTH = 9;
function indent(tagName) {
    if (tagName === 'h2') {
        return 'heading2';
    }
    else if (tagName === 'h3') {
        return 'heading3';
    }
}
function isHeadingAtTheTopOfThePage(element) {
    const elementYPosition = element === null || element === void 0 ? void 0 : element.getClientRects()[0].y;
    return (elementYPosition >= MARGIN_ABOVE_EDITOR &&
        elementYPosition <= MARGIN_ABOVE_EDITOR + HEADING_WIDTH);
}
function isHeadingAboveViewport(element) {
    const elementYPosition = element === null || element === void 0 ? void 0 : element.getClientRects()[0].y;
    return elementYPosition < MARGIN_ABOVE_EDITOR;
}
function isHeadingBelowTheTopOfThePage(element) {
    const elementYPosition = element === null || element === void 0 ? void 0 : element.getClientRects()[0].y;
    return elementYPosition >= MARGIN_ABOVE_EDITOR + HEADING_WIDTH;
}
function TableOfContentsList({ tableOfContents, }) {
    const [selectedKey, setSelectedKey] = (0, react_1.useState)('');
    const selectedIndex = (0, react_1.useRef)(0);
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    function scrollToNode(key, currIndex) {
        editor.getEditorState().read(() => {
            const domElement = editor.getElementByKey(key);
            if (domElement !== null) {
                domElement.scrollIntoView();
                setSelectedKey(key);
                selectedIndex.current = currIndex;
            }
        });
    }
    (0, react_1.useEffect)(() => {
        function scrollCallback() {
            if (tableOfContents.length !== 0 &&
                selectedIndex.current < tableOfContents.length - 1) {
                let currentHeading = editor.getElementByKey(tableOfContents[selectedIndex.current][0]);
                if (currentHeading !== null) {
                    if (isHeadingBelowTheTopOfThePage(currentHeading)) {
                        //On natural scroll, user is scrolling up
                        while (currentHeading !== null &&
                            isHeadingBelowTheTopOfThePage(currentHeading) &&
                            selectedIndex.current > 0) {
                            const prevHeading = editor.getElementByKey(tableOfContents[selectedIndex.current - 1][0]);
                            if (prevHeading !== null &&
                                (isHeadingAboveViewport(prevHeading) ||
                                    isHeadingBelowTheTopOfThePage(prevHeading))) {
                                selectedIndex.current--;
                            }
                            currentHeading = prevHeading;
                        }
                        const prevHeadingKey = tableOfContents[selectedIndex.current][0];
                        setSelectedKey(prevHeadingKey);
                    }
                    else if (isHeadingAboveViewport(currentHeading)) {
                        //On natural scroll, user is scrolling down
                        while (currentHeading !== null &&
                            isHeadingAboveViewport(currentHeading) &&
                            selectedIndex.current < tableOfContents.length - 1) {
                            const nextHeading = editor.getElementByKey(tableOfContents[selectedIndex.current + 1][0]);
                            if (nextHeading !== null &&
                                (isHeadingAtTheTopOfThePage(nextHeading) ||
                                    isHeadingAboveViewport(nextHeading))) {
                                selectedIndex.current++;
                            }
                            currentHeading = nextHeading;
                        }
                        const nextHeadingKey = tableOfContents[selectedIndex.current][0];
                        setSelectedKey(nextHeadingKey);
                    }
                }
            }
            else {
                selectedIndex.current = 0;
            }
        }
        let timerId;
        function debounceFunction(func, delay) {
            clearTimeout(timerId);
            timerId = setTimeout(func, delay);
        }
        function onScroll() {
            debounceFunction(scrollCallback, 10);
        }
        document.addEventListener('scroll', onScroll);
        return () => document.removeEventListener('scroll', onScroll);
    }, [tableOfContents, editor]);
    return (React.createElement("div", { className: "table-of-contents" },
        React.createElement("ul", { className: "headings" }, tableOfContents.map(([key, text, tag], index) => {
            if (index === 0) {
                return (React.createElement("div", { className: "normal-heading-wrapper", key: key },
                    React.createElement("div", { className: "first-heading", onClick: () => scrollToNode(key, index), role: "button", tabIndex: 0 }, ('' + text).length > 20
                        ? text.substring(0, 20) + '...'
                        : text),
                    React.createElement("br", null)));
            }
            else {
                return (React.createElement("div", { className: `normal-heading-wrapper ${selectedKey === key ? 'selected-heading-wrapper' : ''}`, key: key },
                    React.createElement("div", { onClick: () => scrollToNode(key, index), role: "button", className: indent(tag), tabIndex: 0 },
                        React.createElement("li", { className: `normal-heading ${selectedKey === key ? 'selected-heading' : ''}
                    ` }, ('' + text).length > 27
                            ? text.substring(0, 27) + '...'
                            : text))));
            }
        }))));
}
function TableOfContentsPlugin() {
    return (React.createElement(LexicalTableOfContents_1.default, null, (tableOfContents) => {
        return React.createElement(TableOfContentsList, { tableOfContents: tableOfContents });
    }));
}
exports.default = TableOfContentsPlugin;
//# sourceMappingURL=index.js.map