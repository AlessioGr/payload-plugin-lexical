/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Point } from './point';
type ContainsPointReturn = {
    result: boolean;
    reason: {
        isOnTopSide: boolean;
        isOnBottomSide: boolean;
        isOnLeftSide: boolean;
        isOnRightSide: boolean;
    };
};
export declare class Rect {
    private readonly _left;
    private readonly _top;
    private readonly _right;
    private readonly _bottom;
    constructor(left: number, top: number, right: number, bottom: number);
    get top(): number;
    get right(): number;
    get bottom(): number;
    get left(): number;
    get width(): number;
    get height(): number;
    equals({ top, left, bottom, right }: Rect): boolean;
    contains({ x, y }: Point): ContainsPointReturn;
    contains({ top, left, bottom, right }: Rect): boolean;
    intersectsWith(rect: Rect): boolean;
    generateNewRect({ left, top, right, bottom, }: {
        left?: number;
        top?: number;
        right?: number;
        bottom?: number;
    }): Rect;
    static fromLTRB(left: number, top: number, right: number, bottom: number): Rect;
    static fromLWTH(left: number, width: number, top: number, height: number): Rect;
    static fromPoints(startPoint: Point, endPoint: Point): Rect;
    static fromDOM(dom: HTMLElement): Rect;
}
export {};
