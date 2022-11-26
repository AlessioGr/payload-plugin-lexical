"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rect = void 0;
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
const point_1 = require("./point");
class Rect {
    constructor(left, top, right, bottom) {
        const [physicTop, physicBottom] = top <= bottom ? [top, bottom] : [bottom, top];
        const [physicLeft, physicRight] = left <= right ? [left, right] : [right, left];
        this._top = physicTop;
        this._right = physicRight;
        this._left = physicLeft;
        this._bottom = physicBottom;
    }
    get top() {
        return this._top;
    }
    get right() {
        return this._right;
    }
    get bottom() {
        return this._bottom;
    }
    get left() {
        return this._left;
    }
    get width() {
        return Math.abs(this._left - this._right);
    }
    get height() {
        return Math.abs(this._bottom - this._top);
    }
    equals({ top, left, bottom, right }) {
        return (top === this._top
            && bottom === this._bottom
            && left === this._left
            && right === this._right);
    }
    contains(target) {
        if ((0, point_1.isPoint)(target)) {
            const { x, y } = target;
            const isOnTopSide = y < this._top;
            const isOnBottomSide = y > this._bottom;
            const isOnLeftSide = x < this._left;
            const isOnRightSide = x > this._right;
            const result = !isOnTopSide && !isOnBottomSide && !isOnLeftSide && !isOnRightSide;
            return {
                reason: {
                    isOnBottomSide,
                    isOnLeftSide,
                    isOnRightSide,
                    isOnTopSide,
                },
                result,
            };
        }
        const { top, left, bottom, right } = target;
        return (top >= this._top
            && top <= this._bottom
            && bottom >= this._top
            && bottom <= this._bottom
            && left >= this._left
            && left <= this._right
            && right >= this._left
            && right <= this._right);
    }
    intersectsWith(rect) {
        const { left: x1, top: y1, width: w1, height: h1 } = rect;
        const { left: x2, top: y2, width: w2, height: h2 } = this;
        const maxX = x1 + w1 >= x2 + w2 ? x1 + w1 : x2 + w2;
        const maxY = y1 + h1 >= y2 + h2 ? y1 + h1 : y2 + h2;
        const minX = x1 <= x2 ? x1 : x2;
        const minY = y1 <= y2 ? y1 : y2;
        return maxX - minX <= w1 + w2 && maxY - minY <= h1 + h2;
    }
    generateNewRect({ left = this.left, top = this.top, right = this.right, bottom = this.bottom, }) {
        return new Rect(left, top, right, bottom);
    }
    static fromLTRB(left, top, right, bottom) {
        return new Rect(left, top, right, bottom);
    }
    static fromLWTH(left, width, top, height) {
        return new Rect(left, top, left + width, top + height);
    }
    static fromPoints(startPoint, endPoint) {
        const { y: top, x: left } = startPoint;
        const { y: bottom, x: right } = endPoint;
        return Rect.fromLTRB(left, top, right, bottom);
    }
    static fromDOM(dom) {
        const { top, width, left, height } = dom.getBoundingClientRect();
        return Rect.fromLWTH(left, width, top, height);
    }
}
exports.Rect = Rect;
