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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropDownItem = void 0;
const react_1 = require("react");
const React = __importStar(require("react"));
const react_dom_1 = require("react-dom");
const DropDownContext = React.createContext(null);
function DropDownItem({ children, className, onClick, title, }) {
    const ref = (0, react_1.useRef)(null);
    const dropDownContext = React.useContext(DropDownContext);
    if (dropDownContext === null) {
        throw new Error('DropDownItem must be used within a DropDown');
    }
    const { registerItem } = dropDownContext;
    (0, react_1.useEffect)(() => {
        if (ref && ref.current) {
            registerItem(ref);
        }
    }, [ref, registerItem]);
    return (React.createElement("button", { className: className, onClick: onClick, ref: ref, title: title, type: "button" }, children));
}
exports.DropDownItem = DropDownItem;
function DropDownItems({ children, dropDownRef, onClose, }) {
    const [items, setItems] = (0, react_1.useState)();
    const [highlightedItem, setHighlightedItem] = (0, react_1.useState)();
    const registerItem = (0, react_1.useCallback)((itemRef) => {
        setItems((prev) => (prev ? [...prev, itemRef] : [itemRef]));
    }, [setItems]);
    const handleKeyDown = (event) => {
        if (!items)
            return;
        const { key } = event;
        if (['Escape', 'ArrowUp', 'ArrowDown', 'Tab'].includes(key)) {
            event.preventDefault();
        }
        if (key === 'Escape' || key === 'Tab') {
            onClose();
        }
        else if (key === 'ArrowUp') {
            setHighlightedItem((prev) => {
                if (!prev)
                    return items[0];
                const index = items.indexOf(prev) - 1;
                return items[index === -1 ? items.length - 1 : index];
            });
        }
        else if (key === 'ArrowDown') {
            setHighlightedItem((prev) => {
                if (!prev)
                    return items[0];
                return items[items.indexOf(prev) + 1];
            });
        }
    };
    const contextValue = (0, react_1.useMemo)(() => ({
        registerItem,
    }), [registerItem]);
    (0, react_1.useEffect)(() => {
        if (items && !highlightedItem) {
            setHighlightedItem(items[0]);
        }
        if (highlightedItem && highlightedItem.current) {
            highlightedItem.current.focus();
        }
    }, [items, highlightedItem]);
    return (React.createElement(DropDownContext.Provider, { value: contextValue },
        React.createElement("div", { className: "dropdown", ref: dropDownRef, onKeyDown: handleKeyDown }, children)));
}
function DropDown({ disabled = false, buttonLabel, buttonAriaLabel, buttonClassName, buttonIconClassName, children, stopCloseOnClickSelf, }) {
    const dropDownRef = (0, react_1.useRef)(null);
    const buttonRef = (0, react_1.useRef)(null);
    const [showDropDown, setShowDropDown] = (0, react_1.useState)(false);
    const handleClose = () => {
        setShowDropDown(false);
        if (buttonRef && buttonRef.current) {
            buttonRef.current.focus();
        }
    };
    (0, react_1.useEffect)(() => {
        const button = buttonRef.current;
        const dropDown = dropDownRef.current;
        if (showDropDown && button !== null && dropDown !== null) {
            const { top, left } = button.getBoundingClientRect();
            dropDown.style.top = `${top + 40}px`;
            dropDown.style.left = `${Math.min(left, window.innerWidth - dropDown.offsetWidth - 20)}px`;
        }
    }, [dropDownRef, buttonRef, showDropDown]);
    (0, react_1.useEffect)(() => {
        const button = buttonRef.current;
        if (button !== null && showDropDown) {
            const handle = (event) => {
                const { target } = event;
                if (stopCloseOnClickSelf) {
                    if (dropDownRef.current &&
                        dropDownRef.current.contains(target)) {
                        return;
                    }
                }
                if (!button.contains(target)) {
                    setShowDropDown(false);
                }
            };
            document.addEventListener('click', handle);
            return () => {
                document.removeEventListener('click', handle);
            };
        }
    }, [dropDownRef, buttonRef, showDropDown, stopCloseOnClickSelf]);
    return (React.createElement(React.Fragment, null,
        React.createElement("button", { disabled: disabled, "aria-label": buttonAriaLabel || buttonLabel, className: buttonClassName, onClick: (event) => {
                event.preventDefault();
                setShowDropDown(!showDropDown);
            }, ref: buttonRef },
            buttonIconClassName && React.createElement("span", { className: buttonIconClassName }),
            buttonLabel && (React.createElement("span", { className: "text dropdown-button-text" }, buttonLabel)),
            React.createElement("i", { className: "chevron-down" })),
        showDropDown &&
            (0, react_dom_1.createPortal)(React.createElement(DropDownItems, { dropDownRef: dropDownRef, onClose: handleClose }, children), document.body)));
}
exports.default = DropDown;
//# sourceMappingURL=DropDown.js.map