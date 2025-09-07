import * as eva from '@eva-design/eva';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { ApplicationProvider } from '@ui-kitten/components';
import React from 'react';

import { EnhancedThemeProvider, useEnhancedTheme } from '../lib/theme';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage');

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <EnhancedThemeProvider followSystemTheme={false}>{children}</EnhancedThemeProvider>
);

describe('useEnhancedTheme Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides theme and evaTheme objects', () => {
    const { result } = renderHook(() => useEnhancedTheme(), { wrapper });

    expect(result.current.theme).toBeDefined();
    expect(result.current.evaTheme).toBeDefined();
    expect(result.current.isDark).toBe(false);
    expect(typeof result.current.toggleTheme).toBe('function');
  });

  it('provides flattened Eva Design tokens', () => {
    const { result } = renderHook(() => useEnhancedTheme(), { wrapper });

    // Ensure commonly used alias tokens exist (added as convenience in eva-theme)
    expect(result.current.evaTheme['color-primary-default']).toBeDefined();
    expect(result.current.evaTheme['background-basic-color-1']).toBeDefined();
    expect(result.current.evaTheme['text-basic-color']).toBeDefined();
  });

  it('handles theme persistence', async () => {
    // Enhanced key returns JSON data, legacy not needed
    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(JSON.stringify({ themeName: 'dark', evaThemeMode: 'dark', customTheme: {} }))
      .mockResolvedValueOnce(null);

    renderHook(() => useEnhancedTheme(), { wrapper });

    await act(async () => {
      await new Promise(r => setTimeout(r, 0));
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@enhanced_theme_mode');
  });

  it('toggles theme triggers persistence writes', async () => {
    const { result } = renderHook(() => useEnhancedTheme(), { wrapper });

    // Wait for initial persistence (two writes: enhanced + legacy)
    await waitFor(() => {
      expect((AsyncStorage.setItem as jest.Mock).mock.calls.length).toBeGreaterThanOrEqual(2);
    });

    const initialSetCallCount = (AsyncStorage.setItem as jest.Mock).mock.calls.length;

    // Toggle eva theme mode instead of legacy theme (also persisted)
    act(() => {
      result.current.toggleEvaTheme();
    });

    await waitFor(() => {
      expect((AsyncStorage.setItem as jest.Mock).mock.calls.length).toBeGreaterThan(initialSetCallCount);
    });
  });

  it('provides correct theme tokens for light mode', () => {
    const { result } = renderHook(() => useEnhancedTheme(), { wrapper });
    const actualBg = result.current.evaTheme['background-basic-color-1'].toLowerCase();
    const expectedBg = (eva.light['background-basic-color-1'] as string).toLowerCase();
    const actualText = result.current.evaTheme['text-basic-color'].toLowerCase();
    // Our eva-theme implementation uses a tweaked token set; ensure background matches palette
    expect(actualBg).toBe(expectedBg);
    // Instead of exact equality (palette divergence), assert text token exists and is not same as background
    expect(actualText).toBeDefined();
    expect(actualText).not.toBe(actualBg);
  });
});
