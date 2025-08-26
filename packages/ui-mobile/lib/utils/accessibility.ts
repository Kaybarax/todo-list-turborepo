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

  if (context) {
    accessibilityLabel += `, ${context}`;
  }

  if (state) {
    accessibilityLabel += `, ${state}`;
  }

  return accessibilityLabel;
};

/**
 * Generate accessibility hint for interactive elements
 */
export const generateAccessibilityHint = (action: string, result?: string): string => {
  let hint = `${action}`;

  if (result) {
    hint += ` to ${result}`;
  }

  return hint;
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
export const validateContrastRatio = (
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal',
): { isValid: boolean; ratio: number; required: number } => {
  const ratio = calculateContrastRatio(foreground, background);

  let required: number;

  if (level === 'AAA') {
    required = size === 'large' ? 4.5 : 7;
  } else {
    required = size === 'large' ? 3 : 4.5;
  }

  return {
    isValid: ratio >= required,
    ratio,
    required,
  };
};

/**
 * Validate touch target size meets accessibility guidelines
 */
export const validateTouchTargetSize = (
  width: number,
  height: number,
  minSize: number = 44,
): { isValid: boolean; width: number; height: number; minSize: number } => {
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
): AccessibilityRole => {
  const roleMap: Record<string, AccessibilityRole> = {
    button: 'button',
    link: 'link',
    text: 'text',
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
export const createAccessibilityValue = (options: { min?: number; max?: number; now?: number; text?: string }) => {
  const value: AccessibilityProps['accessibilityValue'] = {};

  if (options.min !== undefined) value.min = options.min;
  if (options.max !== undefined) value.max = options.max;
  if (options.now !== undefined) value.now = options.now;
  if (options.text !== undefined) value.text = options.text;

  return Object.keys(value).length > 0 ? value : undefined;
};

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
  state?: Parameters<typeof createAccessibilityState>[0];
  value?: Parameters<typeof createAccessibilityValue>[0];
}): AccessibilityProps => {
  return {
    accessibilityLabel: options.label,
    accessibilityHint: options.hint,
    accessibilityRole: options.role,
    accessibilityState: options.state ? createAccessibilityState(options.state) : undefined,
    accessibilityValue: options.value ? createAccessibilityValue(options.value) : undefined,
  };
};
