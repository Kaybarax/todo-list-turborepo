/**
 * Shared component mapping utilities
 * Centralizes variant/size/status/category mapping logic across components.
 * Phase 1 – P1-1 implementation.
 */

// Button types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

// Input types
export type InputVariant = 'outline' | 'filled' | 'underline';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputStatus = 'default' | 'error' | 'success';

// Text types
export type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2' | 'caption' | 'overline';

// Card types
export type CardVariant = 'elevated' | 'outlined' | 'filled';

// Internal mapping records
const buttonAppearanceMap: Record<ButtonVariant, 'filled' | 'outline' | 'ghost'> = {
  primary: 'filled',
  secondary: 'filled',
  outline: 'outline',
  ghost: 'ghost',
  link: 'ghost',
  destructive: 'filled',
};

const buttonStatusMap: Record<ButtonVariant, string | undefined> = {
  primary: undefined,
  secondary: 'basic',
  outline: undefined,
  ghost: undefined,
  link: undefined,
  destructive: 'danger',
};

const buttonSizeMap: Record<ButtonSize, 'small' | 'medium' | 'large'> = {
  sm: 'small',
  md: 'medium',
  lg: 'medium', // Changed from 'large' to 'medium' for better UI Kitten compatibility
};

const inputSizeMap: Record<InputSize, 'small' | 'medium' | 'large'> = {
  sm: 'small',
  md: 'medium',
  lg: 'large',
};

const inputStatusMap: Record<InputStatus, string | undefined> = {
  default: 'basic',
  error: 'danger',
  success: 'success',
};

const textCategoryMap: Record<TextVariant, string> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body1: 'p1',
  body2: 'p2',
  caption: 'c1',
  overline: 'c2',
};

const cardAppearanceMap: Record<CardVariant, 'filled' | 'outline'> = {
  elevated: 'filled',
  outlined: 'outline',
  filled: 'filled',
};

// Public mapping helpers (provide safe fallback on unknown input via type cast)
export const mapButtonAppearance = (variant: ButtonVariant | string) =>
  buttonAppearanceMap[variant as ButtonVariant] ?? 'filled';
export const mapButtonStatus = (variant: ButtonVariant | string) => buttonStatusMap[variant as ButtonVariant];
export const mapButtonSize = (size: ButtonSize | string) => buttonSizeMap[size as ButtonSize] ?? 'medium';

export const mapInputSize = (size: InputSize | string) => inputSizeMap[size as InputSize] ?? 'medium';
export const mapInputStatus = (status: InputStatus | string) => inputStatusMap[status as InputStatus] ?? 'basic';

export const mapTextCategory = (variant: TextVariant | string) => textCategoryMap[variant as TextVariant] ?? 'p1';

export const mapCardAppearance = (variant: CardVariant | string) =>
  cardAppearanceMap[variant as CardVariant] ?? 'filled';

// Generic mapping facade (optional future extension)
export const componentMappings = {
  button: { appearance: mapButtonAppearance, status: mapButtonStatus, size: mapButtonSize },
  input: { size: mapInputSize, status: mapInputStatus },
  text: { category: mapTextCategory },
  card: { appearance: mapCardAppearance },
};

export type { ButtonVariant as _ButtonVariantForComponents }; // explicit export alias if needed
