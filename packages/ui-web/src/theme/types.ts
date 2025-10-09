export type ThemeMode = 'light' | 'dark' | 'system';

// DaisyUI theme names
export type DaisyUITheme =
  | 'todo-light'
  | 'todo-dark'
  | 'light'
  | 'dark'
  | 'cupcake'
  | 'bumblebee'
  | 'emerald'
  | 'corporate'
  | 'synthwave'
  | 'retro'
  | 'cyberpunk'
  | 'valentine'
  | 'halloween'
  | 'garden'
  | 'forest'
  | 'aqua'
  | 'lofi'
  | 'pastel'
  | 'fantasy'
  | 'wireframe'
  | 'black'
  | 'luxury'
  | 'dracula'
  | 'cmyk'
  | 'autumn'
  | 'business'
  | 'acid'
  | 'lemonade'
  | 'night'
  | 'coffee'
  | 'winter'
  | 'dim'
  | 'nord'
  | 'sunset';

export interface DaisyUIThemeColors {
  primary: string;
  'primary-focus'?: string;
  'primary-content'?: string;
  secondary: string;
  'secondary-focus'?: string;
  'secondary-content'?: string;
  accent: string;
  'accent-focus'?: string;
  'accent-content'?: string;
  neutral: string;
  'neutral-focus'?: string;
  'neutral-content'?: string;
  'base-100': string;
  'base-200': string;
  'base-300': string;
  'base-content': string;
  info: string;
  'info-content'?: string;
  success: string;
  'success-content'?: string;
  warning: string;
  'warning-content'?: string;
  error: string;
  'error-content'?: string;
}

export interface ThemeConfig {
  name: string; // unique key
  displayName?: string;
  type: 'light' | 'dark';
  // Optional overrides for CSS vars (HSL components or css values)
  cssVars?: Record<string, string>;
  // DaisyUI theme compatibility
  daisyUITheme?: DaisyUITheme;
  // Custom properties for theme extensions
  customProperties?: Record<string, any>;
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
  // DaisyUI compatibility
  daisyUITheme?: DaisyUITheme;
  setDaisyUITheme?: (theme: DaisyUITheme) => void;
  themes: ThemeConfig[];
}
