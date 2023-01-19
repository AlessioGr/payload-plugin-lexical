/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export type SettingName =
  | "disableBeforeInput"
  | "measureTypingPerf"
  | "isRichText"
  | "isCharLimit"
  | "isMaxLength"
  | "isCharLimitUtf8"
  | "showNestedEditorTreeView"
  | "showTableOfContents";

export type Settings = Record<SettingName, boolean>;

export const DEFAULT_SETTINGS: Settings = {
  disableBeforeInput: false,
  isCharLimit: false,
  isCharLimitUtf8: false,
  isMaxLength: false,
  isRichText: true,
  measureTypingPerf: false,
  showNestedEditorTreeView: false,
  showTableOfContents: false,
};
