/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import './Modal.scss';
import { ReactNode } from 'react';
export default function Modal({ onClose, children, title, closeOnClickOutside, }: {
    children: ReactNode;
    closeOnClickOutside?: boolean;
    onClose: () => void;
    title: string;
}): JSX.Element;
