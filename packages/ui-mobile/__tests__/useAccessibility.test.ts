// @ts-nocheck
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';

import { useAccessibility } from '../lib/hooks/useAccessibility';

// Mock React Native AccessibilityInfo
jest.mock('react-native', () => ({
  AccessibilityInfo: {
    isScreenReaderEnabled: jest.fn(),
    isReduceMotionEnabled: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    announceForAccessibility: jest.fn(),
  },
}));

const mockAccessibilityInfo = AccessibilityInfo as jest.Mocked<typeof AccessibilityInfo>;

describe('useAccessibility', () => {
  const flushAsync = () =>
    act(async () => {
      await Promise.resolve();
    });
  beforeEach(() => {
    jest.clearAllMocks();
    mockAccessibilityInfo.isScreenReaderEnabled.mockResolvedValue(false);
    mockAccessibilityInfo.isReduceMotionEnabled.mockResolvedValue(false);
    mockAccessibilityInfo.addEventListener.mockReturnValue({ remove: jest.fn() });
  });

  it('initializes with default values', async () => {
    const { result } = renderHook(() => useAccessibility());
    await flushAsync();
    expect(result.current.isScreenReaderEnabled).toBe(false);
    expect(result.current.isReduceMotionEnabled).toBe(false);
  });

  it('fetches initial accessibility state', async () => {
    mockAccessibilityInfo.isScreenReaderEnabled.mockResolvedValue(true);
    mockAccessibilityInfo.isReduceMotionEnabled.mockResolvedValue(true);

    const { result } = renderHook(() => useAccessibility());
    await waitFor(() => {
      expect(result.current.isScreenReaderEnabled).toBe(true);
      expect(result.current.isReduceMotionEnabled).toBe(true);
    });
  });

  it('sets up event listeners', async () => {
    renderHook(() => useAccessibility());
    await flushAsync();
    expect(mockAccessibilityInfo.addEventListener).toHaveBeenCalledWith('screenReaderChanged', expect.any(Function));
    expect(mockAccessibilityInfo.addEventListener).toHaveBeenCalledWith('reduceMotionChanged', expect.any(Function));
  });

  it('generates accessibility props correctly', async () => {
    const { result } = renderHook(() => useAccessibility());
    await flushAsync();

    const props = result.current.getAccessibilityProps({
      label: 'Test button',
      hint: 'Tap to test',
      role: 'button',
    });

    expect(props).toEqual({
      accessibilityLabel: 'Test button',
      accessibilityHint: 'Tap to test',
      accessibilityRole: 'button',
    });
  });

  it('generates accessibility props with state', async () => {
    const { result } = renderHook(() => useAccessibility());
    await flushAsync();

    const props = result.current.getAccessibilityProps({
      label: 'Toggle button',
      role: 'button',
      state: { selected: true },
    });

    expect(props.accessibilityState).toEqual({ selected: true });
  });

  it('announces messages for accessibility', async () => {
    const { result } = renderHook(() => useAccessibility());
    await flushAsync();
    await act(async () => {
      result.current.announce('Test announcement');
    });

    expect(mockAccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith('Test announcement');
  });

  it('handles screen reader state changes', async () => {
    const { result } = renderHook(() => useAccessibility());
    await flushAsync();

    // Simulate screen reader being enabled
    const screenReaderListener = mockAccessibilityInfo.addEventListener.mock.calls.find(
      call => call[0] === 'screenReaderChanged',
    )?.[1];

    if (screenReaderListener) {
      await act(async () => {
        screenReaderListener(true);
      });
    }

    expect(result.current.isScreenReaderEnabled).toBe(true);
  });

  it('handles reduce motion state changes', async () => {
    const { result } = renderHook(() => useAccessibility());
    await flushAsync();

    // Simulate reduce motion being enabled
    const reduceMotionListener = mockAccessibilityInfo.addEventListener.mock.calls.find(
      call => call[0] === 'reduceMotionChanged',
    )?.[1];

    if (reduceMotionListener) {
      await act(async () => {
        reduceMotionListener(true);
      });
    }

    expect(result.current.isReduceMotionEnabled).toBe(true);
  });

  it('cleans up event listeners on unmount', async () => {
    const mockRemove = jest.fn();
    mockAccessibilityInfo.addEventListener.mockReturnValue({ remove: mockRemove });

    const { unmount } = renderHook(() => useAccessibility());
    await flushAsync();
    unmount();

    expect(mockRemove).toHaveBeenCalledTimes(2);
  });

  it('handles accessibility props with custom values', async () => {
    const { result } = renderHook(() => useAccessibility());
    await flushAsync();

    const props = result.current.getAccessibilityProps({
      label: 'Custom label',
      hint: 'Custom hint',
      role: 'text',
      value: { min: 0, max: 100, now: 50 },
    });

    expect(props.accessibilityValue).toEqual({ min: 0, max: 100, now: 50 });
  });
});
// @ts-nocheck
