"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
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
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const React = __importStar(require("react"));
const react_1 = require("react");
const react_error_boundary_1 = require("react-error-boundary");
const EquationEditor_1 = __importDefault(require("../ui/EquationEditor"));
const KatexRenderer_1 = __importDefault(require("../ui/KatexRenderer"));
const EquationNode_1 = require("./EquationNode");
function EquationComponent({ equation, inline, nodeKey, }) {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [equationValue, setEquationValue] = (0, react_1.useState)(equation);
    const [showEquationEditor, setShowEquationEditor] = (0, react_1.useState)(false);
    const inputRef = (0, react_1.useRef)(null);
    const onHide = (0, react_1.useCallback)((restoreSelection) => {
        setShowEquationEditor(false);
        editor.update(() => {
            const node = (0, lexical_1.$getNodeByKey)(nodeKey);
            if ((0, EquationNode_1.$isEquationNode)(node)) {
                node.setEquation(equationValue);
                if (restoreSelection) {
                    node.selectNext(0, 0);
                }
            }
        });
    }, [editor, equationValue, nodeKey]);
    (0, react_1.useEffect)(() => {
        if (!showEquationEditor && equationValue !== equation) {
            setEquationValue(equation);
        }
    }, [showEquationEditor, equation, equationValue]);
    (0, react_1.useEffect)(() => {
        if (showEquationEditor) {
            return (0, utils_1.mergeRegister)(editor.registerCommand(lexical_1.SELECTION_CHANGE_COMMAND, (payload) => {
                const { activeElement } = document;
                const inputElem = inputRef.current;
                if (inputElem !== activeElement) {
                    onHide();
                }
                return false;
            }, lexical_1.COMMAND_PRIORITY_HIGH), editor.registerCommand(lexical_1.KEY_ESCAPE_COMMAND, (payload) => {
                const { activeElement } = document;
                const inputElem = inputRef.current;
                if (inputElem === activeElement) {
                    onHide(true);
                    return true;
                }
                return false;
            }, lexical_1.COMMAND_PRIORITY_HIGH));
        }
        return editor.registerUpdateListener(({ editorState }) => {
            const isSelected = editorState.read(() => {
                const selection = (0, lexical_1.$getSelection)();
                return ((0, lexical_1.$isNodeSelection)(selection) &&
                    selection.has(nodeKey) &&
                    selection.getNodes().length === 1);
            });
            if (isSelected) {
                setShowEquationEditor(true);
            }
        });
    }, [editor, nodeKey, onHide, showEquationEditor]);
    return (React.createElement(React.Fragment, null, showEquationEditor ? (React.createElement(EquationEditor_1.default, { equation: equationValue, setEquation: setEquationValue, inline: inline, ref: inputRef })) : (React.createElement(react_error_boundary_1.ErrorBoundary, { onError: (e) => editor._onError(e), fallback: null },
        React.createElement(KatexRenderer_1.default, { equation: equationValue, inline: inline, onDoubleClick: () => setShowEquationEditor(true) })))));
}
exports.default = EquationComponent;
//# sourceMappingURL=EquationComponent.js.map