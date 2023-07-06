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
const React = __importStar(require("react"));
const react_1 = require("react");
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
const Direction = {
    east: 1 << 0,
    north: 1 << 3,
    south: 1 << 1,
    west: 1 << 2,
};
function ImageResizer({ onResizeStart, onResizeEnd, buttonRef, imageRef, maxWidth, editor, showCaption, setShowCaption, captionsEnabled, }) {
    const controlWrapperRef = (0, react_1.useRef)(null);
    const userSelect = (0, react_1.useRef)({
        priority: '',
        value: 'default',
    });
    const positioningRef = (0, react_1.useRef)({
        currentHeight: 0,
        currentWidth: 0,
        direction: 0,
        isResizing: false,
        ratio: 0,
        startHeight: 0,
        startWidth: 0,
        startX: 0,
        startY: 0,
    });
    const editorRootElement = editor.getRootElement();
    // Find max width, accounting for editor padding.
    const maxWidthContainer = maxWidth ||
        (editorRootElement !== null
            ? editorRootElement.getBoundingClientRect().width - 20
            : 100);
    const maxHeightContainer = editorRootElement !== null
        ? editorRootElement.getBoundingClientRect().height - 20
        : 100;
    const minWidth = 100;
    const minHeight = 100;
    const setStartCursor = (direction) => {
        const ew = direction === Direction.east || direction === Direction.west;
        const ns = direction === Direction.north || direction === Direction.south;
        const nwse = (direction & Direction.north && direction & Direction.west) ||
            (direction & Direction.south && direction & Direction.east);
        const cursorDir = ew ? 'ew' : ns ? 'ns' : nwse ? 'nwse' : 'nesw';
        if (editorRootElement !== null) {
            editorRootElement.style.setProperty('cursor', `${cursorDir}-resize`, 'important');
        }
        if (document.body !== null) {
            document.body.style.setProperty('cursor', `${cursorDir}-resize`, 'important');
            userSelect.current.value = document.body.style.getPropertyValue('-webkit-user-select');
            userSelect.current.priority = document.body.style.getPropertyPriority('-webkit-user-select');
            document.body.style.setProperty('-webkit-user-select', 'none', 'important');
        }
    };
    const setEndCursor = () => {
        if (editorRootElement !== null) {
            editorRootElement.style.setProperty('cursor', 'text');
        }
        if (document.body !== null) {
            document.body.style.setProperty('cursor', 'default');
            document.body.style.setProperty('-webkit-user-select', userSelect.current.value, userSelect.current.priority);
        }
    };
    const handlePointerDown = (event, direction) => {
        if (!editor.isEditable()) {
            return;
        }
        const image = imageRef.current;
        const controlWrapper = controlWrapperRef.current;
        if (image !== null && controlWrapper !== null) {
            const { width, height } = image.getBoundingClientRect();
            const positioning = positioningRef.current;
            positioning.startWidth = width;
            positioning.startHeight = height;
            positioning.ratio = width / height;
            positioning.currentWidth = width;
            positioning.currentHeight = height;
            positioning.startX = event.clientX;
            positioning.startY = event.clientY;
            positioning.isResizing = true;
            positioning.direction = direction;
            setStartCursor(direction);
            onResizeStart();
            controlWrapper.classList.add('image-control-wrapper--resizing');
            image.style.height = `${height}px`;
            image.style.width = `${width}px`;
            document.addEventListener('pointermove', handlePointerMove);
            document.addEventListener('pointerup', handlePointerUp);
        }
    };
    const handlePointerMove = (event) => {
        const image = imageRef.current;
        const positioning = positioningRef.current;
        const isHorizontal = positioning.direction & (Direction.east | Direction.west);
        const isVertical = positioning.direction & (Direction.south | Direction.north);
        if (image !== null && positioning.isResizing) {
            // Corner cursor
            if (isHorizontal && isVertical) {
                let diff = Math.floor(positioning.startX - event.clientX);
                diff = positioning.direction & Direction.east ? -diff : diff;
                const width = clamp(positioning.startWidth + diff, minWidth, maxWidthContainer);
                const height = width / positioning.ratio;
                image.style.width = `${width}px`;
                image.style.height = `${height}px`;
                positioning.currentHeight = height;
                positioning.currentWidth = width;
            }
            else if (isVertical) {
                let diff = Math.floor(positioning.startY - event.clientY);
                diff = positioning.direction & Direction.south ? -diff : diff;
                const height = clamp(positioning.startHeight + diff, minHeight, maxHeightContainer);
                image.style.height = `${height}px`;
                positioning.currentHeight = height;
            }
            else {
                let diff = Math.floor(positioning.startX - event.clientX);
                diff = positioning.direction & Direction.east ? -diff : diff;
                const width = clamp(positioning.startWidth + diff, minWidth, maxWidthContainer);
                image.style.width = `${width}px`;
                positioning.currentWidth = width;
            }
        }
    };
    const handlePointerUp = () => {
        const image = imageRef.current;
        const positioning = positioningRef.current;
        const controlWrapper = controlWrapperRef.current;
        if (image !== null && controlWrapper !== null && positioning.isResizing) {
            const width = positioning.currentWidth;
            const height = positioning.currentHeight;
            positioning.startWidth = 0;
            positioning.startHeight = 0;
            positioning.ratio = 0;
            positioning.startX = 0;
            positioning.startY = 0;
            positioning.currentWidth = 0;
            positioning.currentHeight = 0;
            positioning.isResizing = false;
            controlWrapper.classList.remove('image-control-wrapper--resizing');
            setEndCursor();
            onResizeEnd(width, height);
            document.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('pointerup', handlePointerUp);
        }
    };
    return (React.createElement("div", { ref: controlWrapperRef },
        !showCaption && captionsEnabled && (React.createElement("button", { className: "image-caption-button", ref: buttonRef, onClick: () => {
                setShowCaption(!showCaption);
            } }, "Add Caption")),
        React.createElement("div", { className: "image-resizer image-resizer-n", onPointerDown: (event) => {
                handlePointerDown(event, Direction.north);
            } }),
        React.createElement("div", { className: "image-resizer image-resizer-ne", onPointerDown: (event) => {
                handlePointerDown(event, Direction.north | Direction.east);
            } }),
        React.createElement("div", { className: "image-resizer image-resizer-e", onPointerDown: (event) => {
                handlePointerDown(event, Direction.east);
            } }),
        React.createElement("div", { className: "image-resizer image-resizer-se", onPointerDown: (event) => {
                handlePointerDown(event, Direction.south | Direction.east);
            } }),
        React.createElement("div", { className: "image-resizer image-resizer-s", onPointerDown: (event) => {
                handlePointerDown(event, Direction.south);
            } }),
        React.createElement("div", { className: "image-resizer image-resizer-sw", onPointerDown: (event) => {
                handlePointerDown(event, Direction.south | Direction.west);
            } }),
        React.createElement("div", { className: "image-resizer image-resizer-w", onPointerDown: (event) => {
                handlePointerDown(event, Direction.west);
            } }),
        React.createElement("div", { className: "image-resizer image-resizer-nw", onPointerDown: (event) => {
                handlePointerDown(event, Direction.north | Direction.west);
            } })));
}
exports.default = ImageResizer;
//# sourceMappingURL=ImageResizer.js.map