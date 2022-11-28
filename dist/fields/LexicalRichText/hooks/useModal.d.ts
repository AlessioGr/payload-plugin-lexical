/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
export default function useModal(): [
    JSX.Element | null,
    (title: string, showModal: (onClose: () => void) => JSX.Element) => void
];
