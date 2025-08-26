import * as eva from '@eva-design/eva';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderHook, act } from '@testing-library/react-native';
import { ApplicationProvider } from '@ui-kitten/components';
import React from 'react';

import { EvaProvider, useEnhancedTheme } from '../index';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage');

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ApplicationProvider {...eva.light} theme={eva.light}>
    <EvaProvider>{children}</EvaProvider>
  </ApplicationProvider>
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

    expect(result.current.evaTheme['color-primary-default']).toBeDefined();
    expect(result.current.evaTheme['background-basic-color-1']).toBeDefined();
    expect(result.current.evaTheme['text-basic-color']).toBeDefined();
  });

  it('handles theme persistence', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('dark');

    const { result } = renderHook(() => useEnhancedTheme(), { wrapper });

    // Wait for async storage to load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('theme-mode');
  });

  it('toggles theme and persists preference', async () => {
    const { result } = renderHook(() => useEnhancedTheme(), { wrapper });

    await act(async () => {
      result.current.toggleTheme();
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('theme-mode', 'dark');
  });

  it('provides correct theme tokens for light mode', () => {
    const { result } = renderHook(() => useEnhancedTheme(), { wrapper });

    expect(result.current.evaTheme['background-basic-color-1']).toBe(eva.light['background-basic-color-1']);
    expect(result.current.evaTheme['text-basic-color']).toBe(eva.light['text-basic-color']);
  });
});
