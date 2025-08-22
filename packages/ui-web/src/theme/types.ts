export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  name: string; // unique key
  displayName?: string;
  type: 'light' | 'dark';
  // Optional overrides for CSS vars (HSL components or css values)
  cssVars?: Record<string, string>;
}

export interface ThemeState {
  // The active visual mode (light, dark, or following system)
  mode: ThemeMode;
  // The resolved runtime theme type after evaluating system preference
  resolvedType: 'light' | 'dark';
  // The active theme config by name
  theme: ThemeConfig;
}

export interface ThemeContextValue extends ThemeState {
  setMode: (mode: ThemeMode) => void;
  setTheme: (theme: ThemeConfig) => void;
}
