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
const getElement = () => {
    let element = document.getElementById('report-container');
    if (element === null) {
        element = document.createElement('div');
        element.id = 'report-container';
        element.style.position = 'fixed';
        element.style.top = '50%';
        element.style.left = '50%';
        element.style.fontSize = '32px';
        element.style.transform = 'translate(-50%, -50px)';
        element.style.padding = '20px';
        element.style.background = 'rgba(240, 240, 240, 0.4)';
        element.style.borderRadius = '20px';
        if (document.body) {
            document.body.appendChild(element);
        }
    }
    return element;
};
function useReport() {
    const timer = (0, react_1.useRef)(null);
    const cleanup = (0, react_1.useCallback)(() => {
        if (timer !== null) {
            clearTimeout(timer.current);
        }
        if (document.body) {
            document.body.removeChild(getElement());
        }
    }, []);
    (0, react_1.useEffect)(() => {
        return cleanup;
    }, [cleanup]);
    return (0, react_1.useCallback)((content) => {
        // eslint-disable-next-line no-console
        console.log(content);
        const element = getElement();
        clearTimeout(timer.current);
        element.innerHTML = content;
        timer.current = setTimeout(cleanup, 1000);
        return timer.current;
    }, [cleanup]);
}
exports.default = useReport;
//# sourceMappingURL=useReport.js.map