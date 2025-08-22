import { useMemo } from 'react';
import type { ThemeConfig, ThemeMode } from './types';
import { useThemeContext } from './ThemeProvider';

export function useTheme() {
  const ctx = useThemeContext();
  return ctx.theme;
}

export function useSetTheme() {
  const ctx = useThemeContext();
  return ctx.setTheme;
}

export function useThemeMode() {
  const ctx = useThemeContext();
  return ctx.mode;
}

export function useResolvedThemeType() {
  const ctx = useThemeContext();
  return ctx.resolvedType;
}

export function useSetThemeMode() {
  const ctx = useThemeContext();
  return ctx.setMode;
}

export function useToggleThemeMode() {
  const ctx = useThemeContext();
  return useMemo(
    () => () => {
      const next: ThemeMode = ctx.mode === 'light' ? 'dark' : ctx.mode === 'dark' ? 'system' : 'light';
      ctx.setMode(next);
    },
    [ctx],
  );
}

export function useSetThemeByName(themes: ThemeConfig[]) {
  const setTheme = useSetTheme();
  return (name: string) => {
    const match = themes.find(t => t.name === name);
    if (match) setTheme(match);
  };
}
