/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ReactNode } from 'react';
import type { SettingName } from '../appSettings';
type SettingsContextShape = {
    setOption: (name: SettingName, value: boolean) => void;
    settings: Record<SettingName, boolean>;
};
export declare const SettingsContext: ({ children, }: {
    children: ReactNode;
}) => JSX.Element;
export declare const useSettings: () => SettingsContextShape;
export {};
