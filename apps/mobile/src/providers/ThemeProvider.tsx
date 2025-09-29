import React, { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
  mode?: ThemeMode; // optional controlled mode
  onModeChange?: (mode: ThemeMode) => void; // optional change handler when controlled
};

export const ThemeProvider = ({ children, mode, onModeChange }: ThemeProviderProps) => {
  const [internalMode, setInternalMode] = useState<ThemeMode>('light');
  const themeMode = mode ?? internalMode;

  const value = useMemo(
    () => ({
      themeMode,
      toggleTheme: () => {
        const next = themeMode === 'light' ? 'dark' : 'light';
        if (onModeChange) onModeChange(next);
        else setInternalMode(next);
      },
      setTheme: (m: ThemeMode) => {
        if (onModeChange) onModeChange(m);
        else setInternalMode(m);
      },
    }),
    [themeMode, onModeChange],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export default ThemeProvider;
