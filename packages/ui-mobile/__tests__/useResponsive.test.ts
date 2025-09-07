// @ts-nocheck
import { renderHook, act } from '@testing-library/react-hooks';
import { Dimensions } from 'react-native';

import { useResponsive } from '../lib/hooks/useResponsive';

// Mock React Native Dimensions
jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
}));

const mockDimensions = Dimensions as jest.Mocked<typeof Dimensions>;

describe('useResponsive', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDimensions.get.mockReturnValue({
      width: 375,
      height: 812,
      scale: 2,
      fontScale: 1,
    });
    mockDimensions.addEventListener.mockReturnValue({ remove: jest.fn() });
  });

  it('initializes with current screen info', () => {
    const { result } = renderHook(() => useResponsive());

    expect(result.current.screenInfo.width).toBe(375);
    expect(result.current.screenInfo.height).toBe(812);
    expect(result.current.screenInfo.isTablet).toBe(false);
    expect(result.current.screenInfo.isLandscape).toBe(false);
  });

  it('detects tablet correctly', () => {
    mockDimensions.get.mockReturnValue({
      width: 768,
      height: 1024,
      scale: 2,
      fontScale: 1,
    });

    const { result } = renderHook(() => useResponsive());

    expect(result.current.screenInfo.isTablet).toBe(true);
  });

  it('detects landscape correctly', () => {
    mockDimensions.get.mockReturnValue({
      width: 812,
      height: 375,
      scale: 2,
      fontScale: 1,
    });

    const { result } = renderHook(() => useResponsive());

    expect(result.current.screenInfo.isLandscape).toBe(true);
  });

  it('matches breakpoints correctly', () => {
    const { result } = renderHook(() => useResponsive());

    expect(result.current.matchesBreakpoint('xs')).toBe(true);
    expect(result.current.matchesBreakpoint('sm')).toBe(false);
    expect(result.current.matchesBreakpoint('md')).toBe(false);
  });

  it('gets responsive values correctly', () => {
    const { result } = renderHook(() => useResponsive());

    const values = {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 28,
      xl: 32,
    };

    expect(result.current.getResponsiveValue(values)).toBe(16);
  });

  it('handles single responsive values', () => {
    const { result } = renderHook(() => useResponsive());

    expect(result.current.getResponsiveValue(24)).toBe(24);
  });

  it('updates screen info on dimension changes', () => {
    const { result } = renderHook(() => useResponsive());

    // Simulate dimension change
    const changeListener = mockDimensions.addEventListener.mock.calls.find(call => call[0] === 'change')?.[1];

    if (changeListener) {
      mockDimensions.get.mockReturnValue({
        width: 768,
        height: 1024,
        scale: 2,
        fontScale: 1,
      });

      act(() => {
        changeListener({
          window: { width: 768, height: 1024, scale: 2, fontScale: 1 },
          screen: { width: 768, height: 1024, scale: 2, fontScale: 1 },
        });
      });
    }

    expect(result.current.screenInfo.width).toBe(768);
    expect(result.current.screenInfo.height).toBe(1024);
    expect(result.current.screenInfo.isTablet).toBe(true);
  });

  it('sets up dimension change listener', () => {
    renderHook(() => useResponsive());

    expect(mockDimensions.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('cleans up dimension listener on unmount', () => {
    const mockRemove = jest.fn();
    mockDimensions.addEventListener.mockReturnValue({ remove: mockRemove });

    const { unmount } = renderHook(() => useResponsive());

    unmount();

    expect(mockRemove).toHaveBeenCalled();
  });

  it('handles breakpoint changes correctly', () => {
    const { result } = renderHook(() => useResponsive());

    // Start with mobile
    expect(result.current.matchesBreakpoint('xs')).toBe(true);
    expect(result.current.matchesBreakpoint('md')).toBe(false);

    // Change to tablet
    const changeListener = mockDimensions.addEventListener.mock.calls.find(call => call[0] === 'change')?.[1];

    if (changeListener) {
      mockDimensions.get.mockReturnValue({
        width: 768,
        height: 1024,
        scale: 2,
        fontScale: 1,
      });

      act(() => {
        changeListener({
          window: { width: 768, height: 1024, scale: 2, fontScale: 1 },
          screen: { width: 768, height: 1024, scale: 2, fontScale: 1 },
        });
      });
    }

    expect(result.current.matchesBreakpoint('xs')).toBe(false);
    expect(result.current.matchesBreakpoint('md')).toBe(true);
  });

  it('provides current breakpoint', () => {
    const { result } = renderHook(() => useResponsive());

    expect(result.current.currentBreakpoint).toBe('xs');
  });

  it('updates current breakpoint on screen change', () => {
    const { result } = renderHook(() => useResponsive());

    const changeListener = mockDimensions.addEventListener.mock.calls.find(call => call[0] === 'change')?.[1];

    if (changeListener) {
      mockDimensions.get.mockReturnValue({
        width: 640,
        height: 1136,
        scale: 2,
        fontScale: 1,
      });

      act(() => {
        changeListener({
          window: { width: 640, height: 1136, scale: 2, fontScale: 1 },
          screen: { width: 640, height: 1136, scale: 2, fontScale: 1 },
        });
      });
    }

    expect(result.current.currentBreakpoint).toBe('sm');
  });
});
// @ts-nocheck
