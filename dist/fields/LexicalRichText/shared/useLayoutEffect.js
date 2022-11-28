"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const canUseDOM_1 = require("./canUseDOM");
const useLayoutEffectImpl = canUseDOM_1.CAN_USE_DOM
    ? react_1.useLayoutEffect
    : react_1.useEffect;
exports.default = useLayoutEffectImpl;
//# sourceMappingURL=useLayoutEffect.js.map