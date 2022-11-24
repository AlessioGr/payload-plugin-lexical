"use strict";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSettings = exports.SettingsContext = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const appSettings_1 = require("../appSettings");
const Context = (0, react_1.createContext)({
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setOption: (name, value) => {
    },
    settings: appSettings_1.DEFAULT_SETTINGS,
});
const SettingsContext = ({ children, }) => {
    const [settings, setSettings] = (0, react_1.useState)(appSettings_1.DEFAULT_SETTINGS);
    const setOption = (0, react_1.useCallback)((setting, value) => {
        setSettings((options) => ({
            ...options,
            [setting]: value,
        }));
        if (appSettings_1.DEFAULT_SETTINGS[setting] === value) {
            setURLParam(setting, null);
        }
        else {
            setURLParam(setting, value);
        }
    }, []);
    const contextValue = (0, react_1.useMemo)(() => {
        return { setOption, settings };
    }, [setOption, settings]);
    return React.createElement(Context.Provider, { value: contextValue }, children);
};
exports.SettingsContext = SettingsContext;
const useSettings = () => {
    return (0, react_1.useContext)(Context);
};
exports.useSettings = useSettings;
function setURLParam(param, value) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    if (value !== null) {
        if (params.has(param)) {
            params.set(param, String(value));
        }
        else {
            params.append(param, String(value));
        }
    }
    else if (params.has(param)) {
        params.delete(param);
    }
    url.search = params.toString();
    window.history.pushState(null, '', url.toString());
}
