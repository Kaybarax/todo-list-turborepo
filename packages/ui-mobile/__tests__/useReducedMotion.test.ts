// @ts-nocheck
import { renderHook, act } from '@testing-library/react-hooks';
import { AccessibilityInfo } from 'react-native';

import { useReducedMotion } from '../lib/hooks/useReducedMotion';

jest.mock('react-native', () => ({
  AccessibilityInfo: {
    isReduceMotionEnabled: jest.fn(),
    addEventListener: jest.fn(),
  },
}));

const mockAccessibilityInfo = AccessibilityInfo as jest.Mocked<typeof AccessibilityInfo>;

describe('useReducedMotion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAccessibilityInfo.isReduceMotionEnabled.mockResolvedValue(false);
    mockAccessibilityInfo.addEventListener.mockReturnValue({ remove: jest.fn() });
  });

  it('returns system preference initially', async () => {
    mockAccessibilityInfo.isReduceMotionEnabled.mockResolvedValue(true);
    const { result, waitForNextUpdate } = renderHook(() => useReducedMotion());
    await waitForNextUpdate();
    expect(result.current.systemPrefersReducedMotion).toBe(true);
    expect(result.current.prefersReducedMotion).toBe(true);
  });

  it('honors override=false when system true', async () => {
    mockAccessibilityInfo.isReduceMotionEnabled.mockResolvedValue(true);
    const { result, waitForNextUpdate } = renderHook(() => useReducedMotion({ override: false }));
    await waitForNextUpdate();
    expect(result.current.systemPrefersReducedMotion).toBe(true);
    expect(result.current.prefersReducedMotion).toBe(false);
  });

  it('honors override=true when system false', async () => {
    mockAccessibilityInfo.isReduceMotionEnabled.mockResolvedValue(false);
    const { result } = renderHook(() => useReducedMotion({ override: true }));
    expect(result.current.prefersReducedMotion).toBe(true);
  });

  it('maybe helper returns fallback when reduced motion', () => {
    const { result } = renderHook(() => useReducedMotion({ override: true }));
    expect(result.current.maybe('animate', 'nope')).toBe('nope');
  });

  it('updates on reduce motion change event', () => {
    const { result } = renderHook(() => useReducedMotion());

    const listener = mockAccessibilityInfo.addEventListener.mock.calls[0]?.[1];
    act(() => listener?.(true));
    expect(result.current.systemPrefersReducedMotion).toBe(true);
    expect(result.current.prefersReducedMotion).toBe(true);
  });

  it('unsubscribes on unmount', () => {
    const remove = jest.fn();
    mockAccessibilityInfo.addEventListener.mockReturnValue({ remove });
    const { unmount } = renderHook(() => useReducedMotion());
    unmount();
    expect(remove).toHaveBeenCalled();
  });
});
// @ts-nocheck
