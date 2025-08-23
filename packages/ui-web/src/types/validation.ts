/**
 * Token and Component Type Validation Utilities
 * TypeScript utility types and runtime validation for tokens and DaisyUI variants
 */

import type {
  DaisyUITheme,
  DaisyUIColor,
  DaisyUISize,
  DaisyUIButtonVariant,
  DaisyUIButtonShape,
  DaisyUIInputVariant,
  DaisyUICardVariant,
  AllDaisyUIVariants,
} from './daisyui';

import type { ColorTokenName, SpacingTokenName, FontSizeName } from './tokens';

// Type Guards for Runtime Validation
export function isDaisyUITheme(value: string): value is DaisyUITheme {
  const validThemes: DaisyUITheme[] = [
    'light',
    'dark',
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'synthwave',
    'retro',
    'cyberpunk',
    'valentine',
    'halloween',
    'garden',
    'forest',
    'aqua',
    'lofi',
    'pastel',
    'fantasy',
    'wireframe',
    'black',
    'luxury',
    'dracula',
    'cmyk',
    'autumn',
    'business',
    'acid',
    'lemonade',
    'night',
    'coffee',
    'winter',
    'dim',
    'nord',
    'sunset',
    'todo-light',
    'todo-dark',
  ];
  return validThemes.includes(value as DaisyUITheme);
}

export function isDaisyUIColor(value: string): value is DaisyUIColor {
  const validColors: DaisyUIColor[] = [
    'primary',
    'secondary',
    'accent',
    'neutral',
    'info',
    'success',
    'warning',
    'error',
  ];
  return validColors.includes(value as DaisyUIColor);
}

export function isDaisyUISize(value: string): value is DaisyUISize {
  const validSizes: DaisyUISize[] = ['xs', 'sm', 'md', 'lg'];
  return validSizes.includes(value as DaisyUISize);
}

export function isDaisyUIButtonVariant(value: string): value is DaisyUIButtonVariant {
  const validVariants: DaisyUIButtonVariant[] = [
    'default',
    'primary',
    'secondary',
    'accent',
    'neutral',
    'info',
    'success',
    'warning',
    'error',
    'ghost',
    'link',
    'outline',
    'active',
    'disabled',
  ];
  return validVariants.includes(value as DaisyUIButtonVariant);
}

export function isDaisyUIButtonShape(value: string): value is DaisyUIButtonShape {
  const validShapes: DaisyUIButtonShape[] = ['default', 'square', 'circle', 'wide'];
  return validShapes.includes(value as DaisyUIButtonShape);
}

export function isDaisyUIInputVariant(value: string): value is DaisyUIInputVariant {
  const validVariants: DaisyUIInputVariant[] = ['bordered', 'ghost'];
  return validVariants.includes(value as DaisyUIInputVariant);
}

export function isDaisyUICardVariant(value: string): value is DaisyUICardVariant {
  const validVariants: DaisyUICardVariant[] = ['default', 'bordered', 'compact', 'normal', 'side'];
  return validVariants.includes(value as DaisyUICardVariant);
}

// Token Validation Type Guards
export function isColorTokenName(value: string): value is ColorTokenName {
  const validTokens: ColorTokenName[] = [
    'primary',
    'secondary',
    'accent',
    'neutral',
    'info',
    'success',
    'warning',
    'error',
  ];
  return validTokens.includes(value as ColorTokenName);
}

export function isSpacingTokenName(value: string): value is SpacingTokenName {
  const validTokens: string[] = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '14',
    '16',
    '20',
    '24',
    '28',
    '32',
    '36',
    '40',
    '44',
    '48',
    '52',
    '56',
    '60',
    '64',
    '72',
    '80',
    '96',
  ];
  return validTokens.includes(value);
}

export function isFontSizeName(value: string): value is FontSizeName {
  const validTokens: FontSizeName[] = [
    'xs',
    'sm',
    'base',
    'lg',
    'xl',
    '2xl',
    '3xl',
    '4xl',
    '5xl',
    '6xl',
    '7xl',
    '8xl',
    '9xl',
  ];
  return validTokens.includes(value as FontSizeName);
}

// Utility Types for Strict Component Props
export type StrictComponentProps<T extends keyof AllDaisyUIVariants> = {
  [K in keyof AllDaisyUIVariants[T]]: AllDaisyUIVariants[T][K];
};

// Validation Result Types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface TokenValidationResult extends ValidationResult {
  tokenPath?: string;
  tokenValue?: string;
}

export interface ComponentValidationResult extends ValidationResult {
  component: string;
  variant?: string;
  invalidProps: string[];
}

// Component Prop Validation Functions
export function validateButtonProps(props: {
  variant?: string;
  size?: string;
  shape?: string;
}): ComponentValidationResult {
  const result: ComponentValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    component: 'Button',
    invalidProps: [],
  };

  if (props.variant && !isDaisyUIButtonVariant(props.variant)) {
    result.isValid = false;
    result.errors.push(`Invalid button variant: ${props.variant}`);
    result.invalidProps.push('variant');
  }

  if (props.size && !isDaisyUISize(props.size)) {
    result.isValid = false;
    result.errors.push(`Invalid button size: ${props.size}`);
    result.invalidProps.push('size');
  }

  if (props.shape && !isDaisyUIButtonShape(props.shape)) {
    result.isValid = false;
    result.errors.push(`Invalid button shape: ${props.shape}`);
    result.invalidProps.push('shape');
  }

  return result;
}

export function validateInputProps(props: {
  variant?: string;
  size?: string;
  state?: string;
}): ComponentValidationResult {
  const result: ComponentValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    component: 'Input',
    invalidProps: [],
  };

  if (props.variant && !isDaisyUIInputVariant(props.variant)) {
    result.isValid = false;
    result.errors.push(`Invalid input variant: ${props.variant}`);
    result.invalidProps.push('variant');
  }

  if (props.size && !['xs', 'sm', 'md', 'lg', 'xl'].includes(props.size)) {
    result.isValid = false;
    result.errors.push(`Invalid input size: ${props.size}`);
    result.invalidProps.push('size');
  }

  if (props.state && !isDaisyUIColor(props.state) && props.state !== 'default') {
    result.isValid = false;
    result.errors.push(`Invalid input state: ${props.state}`);
    result.invalidProps.push('state');
  }

  return result;
}

export function validateCardProps(props: { variant?: string; elevation?: string }): ComponentValidationResult {
  const result: ComponentValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    component: 'Card',
    invalidProps: [],
  };

  if (props.variant && !isDaisyUICardVariant(props.variant)) {
    result.isValid = false;
    result.errors.push(`Invalid card variant: ${props.variant}`);
    result.invalidProps.push('variant');
  }

  if (props.elevation && !['none', 'sm', 'md', 'lg', 'xl', '2xl'].includes(props.elevation)) {
    result.isValid = false;
    result.errors.push(`Invalid card elevation: ${props.elevation}`);
    result.invalidProps.push('elevation');
  }

  return result;
}

// Generic Component Validation
export function validateComponentProps<T extends keyof AllDaisyUIVariants>(
  component: T,
  props: Partial<AllDaisyUIVariants[T]>,
): ComponentValidationResult {
  switch (component) {
    case 'button':
      return validateButtonProps(props as any);
    case 'input':
      return validateInputProps(props as any);
    case 'card':
      return validateCardProps(props as any);
    default:
      return {
        isValid: true,
        errors: [],
        warnings: [`No validation implemented for component: ${component}`],
        component: component as string,
        invalidProps: [],
      };
  }
}

// Token Access Validation
export function validateTokenAccess(tokenPath: string): TokenValidationResult {
  const result: TokenValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    tokenPath,
  };

  const pathParts = tokenPath.split('.');
  if (pathParts.length < 2) {
    result.isValid = false;
    result.errors.push(`Invalid token path format: ${tokenPath}`);
    return result;
  }

  const [category] = pathParts;
  const validCategories = ['color', 'space', 'typography', 'border', 'shadow', 'semantic'];

  if (!validCategories.includes(category)) {
    result.isValid = false;
    result.errors.push(`Invalid token category: ${category}`);
  }

  return result;
}

// Utility for creating type-safe component props
export function createTypeSafeProps<T extends keyof AllDaisyUIVariants>(
  component: T,
  props: AllDaisyUIVariants[T],
): AllDaisyUIVariants[T] {
  const validation = validateComponentProps(component, props);

  if (!validation.isValid) {
    console.warn(`Invalid props for ${component}:`, validation.errors);
  }

  return props;
}

// CSS Class Generation with Validation
export function generateDaisyUIClasses(
  baseClass: string,
  variants: Record<string, string | boolean | undefined>,
): string {
  const classes = [baseClass];

  Object.entries(variants).forEach(([key, value]) => {
    if (value === true) {
      classes.push(key);
    } else if (typeof value === 'string' && value !== 'default') {
      classes.push(`${baseClass}-${value}`);
    }
  });

  return classes.join(' ');
}

// Export validation constants for external use
export const DAISYUI_THEMES: readonly DaisyUITheme[] = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
  'dim',
  'nord',
  'sunset',
  'todo-light',
  'todo-dark',
] as const;

export const DAISYUI_COLORS: readonly DaisyUIColor[] = [
  'primary',
  'secondary',
  'accent',
  'neutral',
  'info',
  'success',
  'warning',
  'error',
] as const;

export const DAISYUI_SIZES: readonly DaisyUISize[] = ['xs', 'sm', 'md', 'lg'] as const;
