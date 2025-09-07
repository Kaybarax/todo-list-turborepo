declare module '@testing-library/react-hooks' {
  export function renderHook<T>(cb: () => T): {
    result: { current: T };
    waitForNextUpdate: () => Promise<void>;
    unmount: () => void;
  };
  export function act(cb: () => void | Promise<void>): void | Promise<void>;
}
