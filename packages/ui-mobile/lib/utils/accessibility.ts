/**
 * Accessibility Utilities
 * Helper functions for accessibility labels, hints, contrast validation, and roles
 */

import { type AccessibilityRole } from 'react-native';

export interface AccessibilityProps {
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean | 'mixed';
    busy?: boolean;
    expanded?: boolean;
  };
  accessibilityValue?: {
    min?: number;
    max?: number;
    now?: number;
    text?: string;
  };
}

/**
 * Generate accessibility label for components
 */
export const generateAccessibilityLabel = (label: string, context?: string, state?: string): string => {
  let accessibilityLabel = label;
  if (context) accessibilityLabel += ` ${context}`;
  if (state) accessibilityLabel += ` ${state}`;
  return accessibilityLabel.trim();
};

/**
 * Generate accessibility hint for interactive elements
 */
export const generateAccessibilityHint = (action: string, result?: string): string => {
  return `Double tap to ${action}${result ? ` ${result}` : ''}`;
};

/**
 * Calculate contrast ratio between two colors
 */
export const calculateContrastRatio = (foreground: string, background: string): number => {
  const getLuminance = (color: string): number => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    // Calculate relative luminance
    const getRGB = (c: number) => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };

    return 0.2126 * getRGB(r) + 0.7152 * getRGB(g) + 0.0722 * getRGB(b);
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Validate if contrast ratio meets WCAG guidelines
 */
export function validateContrastRatio(
  foreground: string,
  background: string,
  level?: 'AA' | 'AAA',
  sizeOrLarge?: 'normal' | 'large' | boolean,
): any {
  const effectiveLevel = level ?? 'AA';
  const isLarge = sizeOrLarge === 'large' || (typeof sizeOrLarge === 'boolean' && sizeOrLarge);
  const ratio = calculateContrastRatio(foreground, background);
  const required = effectiveLevel === 'AAA' ? (isLarge ? 4.5 : 7) : isLarge ? 3 : 4.5;
  const isValid = ratio >= required;
  if (typeof sizeOrLarge === 'string' || sizeOrLarge === undefined) {
    return { isValid, ratio, required };
  }
  return isValid;
}

/**
 * Validate touch target size meets accessibility guidelines
 */
export const validateTouchTargetSize = (width: number, height: number, minSize: number = 44) => {
  return {
    isValid: width >= minSize && height >= minSize,
    width,
    height,
    minSize,
  };
};

/**
 * Get appropriate accessibility role for component type
 */
export const getAccessibilityRole = (
  componentType: 'button' | 'link' | 'text' | 'image' | 'header' | 'list' | 'listitem' | 'tab' | 'tablist',
  interactive?: boolean,
): AccessibilityRole => {
  const roleMap: Record<string, AccessibilityRole> = {
    button: 'button',
    link: 'link',
    text: interactive ? 'button' : 'text',
    image: 'image',
    header: 'header',
    list: 'list',
    listitem: 'none', // React Native doesn't have listitem
    tab: 'tab',
    tablist: 'tablist',
  };

  return roleMap[componentType] || 'none';
};

/**
 * Create accessibility state object
 */
export const createAccessibilityState = (options: {
  disabled?: boolean;
  selected?: boolean;
  checked?: boolean | 'mixed';
  busy?: boolean;
  expanded?: boolean;
}) => {
  const state: AccessibilityProps['accessibilityState'] = {};

  if (options.disabled !== undefined) state.disabled = options.disabled;
  if (options.selected !== undefined) state.selected = options.selected;
  if (options.checked !== undefined) state.checked = options.checked;
  if (options.busy !== undefined) state.busy = options.busy;
  if (options.expanded !== undefined) state.expanded = options.expanded;

  return Object.keys(state).length > 0 ? state : undefined;
};

/**
 * Create accessibility value object for range inputs
 */
export function createAccessibilityValue(options: {
  min?: number;
  max?: number;
  now?: number | string;
  text?: string;
}): AccessibilityProps['accessibilityValue'] | undefined;
export function createAccessibilityValue(
  now: number | string,
  min?: number,
  max?: number,
  text?: string,
): AccessibilityProps['accessibilityValue'] | undefined;
export function createAccessibilityValue(
  optionsOrNow: any,
  min?: number,
  max?: number,
  text?: string,
): AccessibilityProps['accessibilityValue'] | undefined {
  const options =
    typeof optionsOrNow === 'object' && optionsOrNow !== null
      ? (optionsOrNow as { min?: number; max?: number; now?: number | string; text?: string })
      : { now: optionsOrNow as number | string, min, max, text };
  const value: AccessibilityProps['accessibilityValue'] = {};
  if (options.min !== undefined) value.min = options.min;
  if (options.max !== undefined) value.max = options.max;
  if (options.now !== undefined) value.now = options.now as any;
  if (options.text !== undefined) value.text = options.text;
  return Object.keys(value).length > 0 ? value : undefined;
}

/**
 * Format number for screen readers
 */
export const formatNumberForScreenReader = (
  num: number,
  options?: {
    currency?: string;
    percentage?: boolean;
    ordinal?: boolean;
  },
): string => {
  if (options?.currency) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: options.currency,
    }).format(num);
  }

  if (options?.percentage) {
    return `${num} percent`;
  }

  if (options?.ordinal) {
    const ordinalRules = new Intl.PluralRules('en-US', { type: 'ordinal' });
    const suffixes = {
      one: 'st',
      two: 'nd',
      few: 'rd',
      other: 'th',
    };
    const rule = ordinalRules.select(num);
    const suffix = suffixes[rule as keyof typeof suffixes];
    return `${num}${suffix}`;
  }

  return num.toLocaleString();
};

/**
 * Create comprehensive accessibility props for a component
 */
export const createAccessibilityProps = (options: {
  label: string;
  hint?: string;
  role?: AccessibilityRole;
  state?: any;
  value?: any;
}): AccessibilityProps => {
  return {
    accessibilityLabel: options.label,
    accessibilityHint: options.hint,
    accessibilityRole: options.role,
    accessibilityState: options.state ? createAccessibilityState(options.state) : undefined,
    accessibilityValue: options.value ? createAccessibilityValue(options.value) : undefined,
  };
};
