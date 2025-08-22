import { renderHook, act } from '@testing-library/react-hooks';
import { AccessibilityInfo } from 'react-native';
import { useAccessibility } from './useAccessibility';

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
  beforeEach(() => {
    jest.clearAllMocks();
    mockAccessibilityInfo.isScreenReaderEnabled.mockResolvedValue(false);
    mockAccessibilityInfo.isReduceMotionEnabled.mockResolvedValue(false);
    mockAccessibilityInfo.addEventListener.mockReturnValue({ remove: jest.fn() });
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useAccessibility());

    expect(result.current.isScreenReaderEnabled).toBe(false);
    expect(result.current.isReduceMotionEnabled).toBe(false);
  });

  it('fetches initial accessibility state', async () => {
    mockAccessibilityInfo.isScreenReaderEnabled.mockResolvedValue(true);
    mockAccessibilityInfo.isReduceMotionEnabled.mockResolvedValue(true);

    const { result, waitForNextUpdate } = renderHook(() => useAccessibility());

    await waitForNextUpdate();

    expect(result.current.isScreenReaderEnabled).toBe(true);
    expect(result.current.isReduceMotionEnabled).toBe(true);
  });

  it('sets up event listeners', () => {
    renderHook(() => useAccessibility());

    expect(mockAccessibilityInfo.addEventListener).toHaveBeenCalledWith('screenReaderChanged', expect.any(Function));
    expect(mockAccessibilityInfo.addEventListener).toHaveBeenCalledWith('reduceMotionChanged', expect.any(Function));
  });

  it('generates accessibility props correctly', () => {
    const { result } = renderHook(() => useAccessibility());

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

  it('generates accessibility props with state', () => {
    const { result } = renderHook(() => useAccessibility());

    const props = result.current.getAccessibilityProps({
      label: 'Toggle button',
      role: 'button',
      state: { selected: true },
    });

    expect(props.accessibilityState).toEqual({ selected: true });
  });

  it('announces messages for accessibility', () => {
    const { result } = renderHook(() => useAccessibility());

    act(() => {
      result.current.announce('Test announcement');
    });

    expect(mockAccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith('Test announcement');
  });

  it('handles screen reader state changes', async () => {
    const { result } = renderHook(() => useAccessibility());

    // Simulate screen reader being enabled
    const screenReaderListener = mockAccessibilityInfo.addEventListener.mock.calls.find(
      call => call[0] === 'screenReaderChanged',
    )?.[1];

    if (screenReaderListener) {
      act(() => {
        screenReaderListener(true);
      });
    }

    expect(result.current.isScreenReaderEnabled).toBe(true);
  });

  it('handles reduce motion state changes', async () => {
    const { result } = renderHook(() => useAccessibility());

    // Simulate reduce motion being enabled
    const reduceMotionListener = mockAccessibilityInfo.addEventListener.mock.calls.find(
      call => call[0] === 'reduceMotionChanged',
    )?.[1];

    if (reduceMotionListener) {
      act(() => {
        reduceMotionListener(true);
      });
    }

    expect(result.current.isReduceMotionEnabled).toBe(true);
  });

  it('cleans up event listeners on unmount', () => {
    const mockRemove = jest.fn();
    mockAccessibilityInfo.addEventListener.mockReturnValue({ remove: mockRemove });

    const { unmount } = renderHook(() => useAccessibility());

    unmount();

    expect(mockRemove).toHaveBeenCalledTimes(2);
  });

  it('handles accessibility props with custom values', () => {
    const { result } = renderHook(() => useAccessibility());

    const props = result.current.getAccessibilityProps({
      label: 'Custom label',
      hint: 'Custom hint',
      role: 'text',
      value: { min: 0, max: 100, now: 50 },
    });

    expect(props.accessibilityValue).toEqual({ min: 0, max: 100, now: 50 });
  });
});
