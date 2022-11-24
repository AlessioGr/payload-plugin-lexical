/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/// <reference types="react" />
import type { LinkNode } from '../LinkPlugin/LinkPluginModified';
type LinkFilter = (event: MouseEvent, linkNode: LinkNode) => boolean;
export default function ClickableLinkPlugin({ filter, newTab, }: {
    filter?: LinkFilter;
    newTab?: boolean;
}): JSX.Element | null;
export {};
