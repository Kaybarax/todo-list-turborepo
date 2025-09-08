// Delegate to the well‑tested Testing Library implementation instead of a
// custom shim. This maintains parity with other tests already importing
// from '@testing-library/react-native' directly and avoids edge cases
// around effect flushing / unmounted roots encountered with the previous
// minimal reimplementation.
export { renderHook, act } from '@testing-library/react-native';
