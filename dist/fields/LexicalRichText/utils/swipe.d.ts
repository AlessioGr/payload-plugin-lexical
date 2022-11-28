/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
export declare function addSwipeLeftListener(element: HTMLElement, cb: (_force: number, e: TouchEvent) => void): () => void;
export declare function addSwipeRightListener(element: HTMLElement, cb: (_force: number, e: TouchEvent) => void): () => void;
export declare function addSwipeUpListener(element: HTMLElement, cb: (_force: number, e: TouchEvent) => void): () => void;
export declare function addSwipeDownListener(element: HTMLElement, cb: (_force: number, e: TouchEvent) => void): () => void;
