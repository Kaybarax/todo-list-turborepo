import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ThemeConfig, ThemeContextValue, ThemeMode } from './types';
import { defaultThemes } from './themes';

const STORAGE_KEYS = {
  mode: 'uiweb.theme.mode',
  theme: 'uiweb.theme.name',
};

function getSystemPrefersDark(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

function subscribeSystemPrefersDark(cb: (isDark: boolean) => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = (e: MediaQueryListEvent) => cb(e.matches);
  // Modern addEventListener
  try {
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  } catch {
    // Fallback for Safari
    // @ts-ignore
    mql.addListener(handler);
    // @ts-ignore
    return () => mql.removeListener(handler);
  }
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  children: React.ReactNode;
  themes?: ThemeConfig[];
  defaultMode?: ThemeMode; // 'system' | 'light' | 'dark'
  defaultThemeName?: string; // e.g., 'light' | 'dark'
  storage?: Storage | null; // allow disabling persistence
  rootElement?: HTMLElement; // custom root for CSS vars/class, defaults to document.documentElement
}

export function ThemeProvider({
  children,
  themes = defaultThemes,
  defaultMode = 'system',
  defaultThemeName,
  storage = typeof window !== 'undefined' ? window.localStorage : null,
  rootElement,
}: ThemeProviderProps) {
  const themeMap = useMemo(() => new Map(themes.map(t => [t.name, t])), [themes]);
  const initialTheme = useMemo(() => {
    const name = defaultThemeName ?? (themeMap.has('light') ? 'light' : themes[0]?.name);
    return (name && themeMap.get(name)) || themes[0];
  }, [defaultThemeName, themeMap, themes]);

  const readStoredMode = (): ThemeMode | null => {
    if (!storage) return null;
    const v = storage.getItem(STORAGE_KEYS.mode) as ThemeMode | null;
    return v === 'light' || v === 'dark' || v === 'system' ? v : null;
  };

  const readStoredTheme = (): ThemeConfig | null => {
    if (!storage) return null;
    const name = storage.getItem(STORAGE_KEYS.theme);
    return name && themeMap.get(name) ? (themeMap.get(name) as ThemeConfig) : null;
  };

  const [mode, setModeState] = useState<ThemeMode>(() => readStoredMode() ?? defaultMode);
  const [theme, setThemeState] = useState<ThemeConfig>(() => readStoredTheme() ?? (initialTheme as ThemeConfig));
  const [systemDark, setSystemDark] = useState<boolean>(() => getSystemPrefersDark());

  // Persist changes
  useEffect(() => {
    if (!storage) return;
    storage.setItem(STORAGE_KEYS.mode, mode);
  }, [mode, storage]);

  useEffect(() => {
    if (!storage) return;
    storage.setItem(STORAGE_KEYS.theme, theme.name);
  }, [theme, storage]);

  // Subscribe system preference when mode === 'system'
  useEffect(() => {
    if (mode !== 'system') return;
    return subscribeSystemPrefersDark(setSystemDark);
  }, [mode]);

  const resolvedType: 'light' | 'dark' = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;

  // Apply CSS vars and root class
  useEffect(() => {
    const root = rootElement ?? (typeof document !== 'undefined' ? document.documentElement : undefined);
    if (!root) return;

    // Toggle dark class for Tailwind's dark variant
    root.classList.toggle('dark', resolvedType === 'dark');

    // Apply theme cssVars
    if (theme?.cssVars) {
      Object.entries(theme.cssVars).forEach(([k, v]) => root.style.setProperty(k, v));
    }
  }, [resolvedType, theme, rootElement]);

  const setMode = useCallback((m: ThemeMode) => setModeState(m), []);
  const setTheme = useCallback((t: ThemeConfig) => setThemeState(t), []);

  const value: ThemeContextValue = useMemo(
    () => ({ mode, resolvedType, theme, setMode, setTheme }),
    [mode, resolvedType, theme, setMode, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider');
  return ctx;
}
