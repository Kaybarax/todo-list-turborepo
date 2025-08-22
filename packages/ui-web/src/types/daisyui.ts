/**
 * DaisyUI Component Type Definitions
 * Comprehensive TypeScript interfaces for all DaisyUI components and variants
 */

// DaisyUI Theme Names
export type DaisyUITheme =
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
  | 'sunset'
  | 'todo-light'
  | 'todo-dark';

// DaisyUI Color Variants
export type DaisyUIColor = 'primary' | 'secondary' | 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'error';

// DaisyUI Size Variants
export type DaisyUISize = 'xs' | 'sm' | 'md' | 'lg';

// Button Types
export interface DaisyUIButtonVariants {
  variant:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'neutral'
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
    | 'ghost'
    | 'link'
    | 'outline'
    | 'active'
    | 'disabled';
  size: DaisyUISize;
  shape: 'default' | 'square' | 'circle' | 'wide';
  glass?: boolean;
  block?: boolean;
}

export type DaisyUIButtonVariant = DaisyUIButtonVariants['variant'];
export type DaisyUIButtonSize = DaisyUIButtonVariants['size'];
export type DaisyUIButtonShape = DaisyUIButtonVariants['shape'];

// Input Types
export interface DaisyUIInputVariants {
  size: DaisyUISize | 'xl';
  state: 'default' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
  variant: 'bordered' | 'ghost';
}

export type DaisyUIInputSize = DaisyUIInputVariants['size'];
export type DaisyUIInputState = DaisyUIInputVariants['state'];
export type DaisyUIInputVariant = DaisyUIInputVariants['variant'];

// Card Types
export interface DaisyUICardVariants {
  elevation: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant: 'default' | 'bordered' | 'compact' | 'normal' | 'side';
  glass?: boolean;
}

export type DaisyUICardElevation = DaisyUICardVariants['elevation'];
export type DaisyUICardVariant = DaisyUICardVariants['variant'];

// Badge Types
export interface DaisyUIBadgeVariants {
  variant:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'neutral'
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
    | 'ghost'
    | 'outline';
  size: DaisyUISize;
}

export type DaisyUIBadgeVariant = DaisyUIBadgeVariants['variant'];
export type DaisyUIBadgeSize = DaisyUIBadgeVariants['size'];

// Alert Types
export interface DaisyUIAlertVariants {
  variant: 'default' | 'info' | 'success' | 'warning' | 'error';
}

export type DaisyUIAlertVariant = DaisyUIAlertVariants['variant'];

// Modal Types
export interface DaisyUIModalVariants {
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  position: 'top' | 'middle' | 'bottom';
}

export type DaisyUIModalSize = DaisyUIModalVariants['size'];
export type DaisyUIModalPosition = DaisyUIModalVariants['position'];

// Progress Types
export interface DaisyUIProgressVariants {
  variant: 'default' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
  size: DaisyUISize;
}

export type DaisyUIProgressVariant = DaisyUIProgressVariants['variant'];
export type DaisyUIProgressSize = DaisyUIProgressVariants['size'];

// Loading Types
export interface DaisyUILoadingVariants {
  variant: 'spinner' | 'dots' | 'ring' | 'ball' | 'bars' | 'infinity';
  size: DaisyUISize;
}

export type DaisyUILoadingVariant = DaisyUILoadingVariants['variant'];
export type DaisyUILoadingSize = DaisyUILoadingVariants['size'];

// Form Control Types
export interface DaisyUIFormControlVariants {
  size: DaisyUISize;
}

// Checkbox Types
export interface DaisyUICheckboxVariants {
  variant: 'default' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
  size: DaisyUISize;
}

export type DaisyUICheckboxVariant = DaisyUICheckboxVariants['variant'];
export type DaisyUICheckboxSize = DaisyUICheckboxVariants['size'];

// Radio Types
export interface DaisyUIRadioVariants {
  variant: 'default' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
  size: DaisyUISize;
}

export type DaisyUIRadioVariant = DaisyUIRadioVariants['variant'];
export type DaisyUIRadioSize = DaisyUIRadioVariants['size'];

// Select Types
export interface DaisyUISelectVariants {
  variant: 'default' | 'bordered' | 'ghost';
  size: DaisyUISize;
  state: 'default' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
}

export type DaisyUISelectVariant = DaisyUISelectVariants['variant'];
export type DaisyUISelectSize = DaisyUISelectVariants['size'];
export type DaisyUISelectState = DaisyUISelectVariants['state'];

// Textarea Types
export interface DaisyUITextareaVariants {
  variant: 'default' | 'bordered' | 'ghost';
  size: DaisyUISize;
  state: 'default' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
}

export type DaisyUITextareaVariant = DaisyUITextareaVariants['variant'];
export type DaisyUITextareaSize = DaisyUITextareaVariants['size'];
export type DaisyUITextareaState = DaisyUITextareaVariants['state'];

// Toggle Types
export interface DaisyUIToggleVariants {
  variant: 'default' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
  size: DaisyUISize;
}

export type DaisyUIToggleVariant = DaisyUIToggleVariants['variant'];
export type DaisyUIToggleSize = DaisyUIToggleVariants['size'];

// Range Types
export interface DaisyUIRangeVariants {
  variant: 'default' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
  size: DaisyUISize;
}

export type DaisyUIRangeVariant = DaisyUIRangeVariants['variant'];
export type DaisyUIRangeSize = DaisyUIRangeVariants['size'];

// Tooltip Types
export interface DaisyUITooltipVariants {
  position: 'top' | 'bottom' | 'left' | 'right';
  color: 'default' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
}

export type DaisyUITooltipPosition = DaisyUITooltipVariants['position'];
export type DaisyUITooltipColor = DaisyUITooltipVariants['color'];

// Dropdown Types
export interface DaisyUIDropdownVariants {
  position: 'top' | 'bottom' | 'left' | 'right' | 'end';
  hover?: boolean;
  open?: boolean;
}

export type DaisyUIDropdownPosition = DaisyUIDropdownVariants['position'];

// Menu Types
export interface DaisyUIMenuVariants {
  size: 'xs' | 'sm' | 'md' | 'lg';
  variant: 'default' | 'compact' | 'horizontal';
}

export type DaisyUIMenuSize = DaisyUIMenuVariants['size'];
export type DaisyUIMenuVariant = DaisyUIMenuVariants['variant'];

// Navbar Types
export interface DaisyUINavbarVariants {
  size: 'sm' | 'md' | 'lg';
}

export type DaisyUINavbarSize = DaisyUINavbarVariants['size'];

// Footer Types
export interface DaisyUIFooterVariants {
  variant: 'default' | 'center';
}

export type DaisyUIFooterVariant = DaisyUIFooterVariants['variant'];

// Hero Types
export interface DaisyUIHeroVariants {
  variant: 'default' | 'overlay';
  size: 'sm' | 'md' | 'lg' | 'full';
}

export type DaisyUIHeroVariant = DaisyUIHeroVariants['variant'];
export type DaisyUIHeroSize = DaisyUIHeroVariants['size'];

// Stats Types
export interface DaisyUIStatsVariants {
  variant: 'default' | 'horizontal' | 'vertical';
}

export type DaisyUIStatsVariant = DaisyUIStatsVariants['variant'];

// Utility Types for Component Props
export type DaisyUIComponentProps<T> = {
  [K in keyof T]: T[K];
};

// Validation Types
export type ValidDaisyUIVariant<T extends Record<string, any>> = T[keyof T];

// Theme Configuration Type
export interface DaisyUIThemeConfig {
  [key: string]: {
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
  };
}

// Export all variant unions for easy access
export type AllDaisyUIVariants = {
  button: DaisyUIButtonVariants;
  input: DaisyUIInputVariants;
  card: DaisyUICardVariants;
  badge: DaisyUIBadgeVariants;
  alert: DaisyUIAlertVariants;
  modal: DaisyUIModalVariants;
  progress: DaisyUIProgressVariants;
  loading: DaisyUILoadingVariants;
  checkbox: DaisyUICheckboxVariants;
  radio: DaisyUIRadioVariants;
  select: DaisyUISelectVariants;
  textarea: DaisyUITextareaVariants;
  toggle: DaisyUIToggleVariants;
  range: DaisyUIRangeVariants;
  tooltip: DaisyUITooltipVariants;
  dropdown: DaisyUIDropdownVariants;
  menu: DaisyUIMenuVariants;
  navbar: DaisyUINavbarVariants;
  footer: DaisyUIFooterVariants;
  hero: DaisyUIHeroVariants;
  stats: DaisyUIStatsVariants;
};
