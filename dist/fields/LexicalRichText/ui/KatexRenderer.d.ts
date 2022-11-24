/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/// <reference types="react" />
export default function KatexRenderer({ equation, inline, onClick, }: Readonly<{
    equation: string;
    inline: boolean;
    onClick: () => void;
}>): JSX.Element;
