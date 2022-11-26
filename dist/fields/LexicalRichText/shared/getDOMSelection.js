"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const canUseDOM_1 = require("./canUseDOM");
const getSelection = () => (canUseDOM_1.CAN_USE_DOM ? window.getSelection() : null);
exports.default = getSelection;
