/// <reference types="lodash" />
export declare function useDebounce<T extends (...args: never[]) => void>(fn: T, ms: number, maxWait?: number): import("lodash").DebouncedFunc<(...args: Parameters<T>) => void>;
