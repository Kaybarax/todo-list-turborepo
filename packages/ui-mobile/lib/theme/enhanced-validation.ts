/**
 * Enhanced Theme Validation
 * Provides validation for both legacy and Eva Design themes
 */

import { ThemeValidationError } from './validation';

export interface EvaThemeValidationResult {
  isValid: boolean;
  errors: ThemeValidationError[];
  warnings: string[];
}

export interface EvaThemeValidationOptions {
  strict?: boolean;
  checkRequiredTokens?: boolean;
  validateColorContrast?: boolean;
}

// Required Eva Design theme tokens
const REQUIRED_EVA_TOKENS = [
  'color-primary-600',
  'color-success-600',
  'color-info-600',
  'color-warning-600',
  'color-danger-600',
  'text-basic-color',
  'text-control-color',
  'background-basic-color-1',
  'background-basic-color-2',
  'border-basic-color-1',
  'text-font-family',
  'text-font-size',
  'text-font-weight',
];

// Color contrast validation (WCAG AA compliance)
const MIN_CONTRAST_RATIO = 4.5;
const MIN_LARGE_TEXT_CONTRAST_RATIO = 3.0;

/**
 * Calculate relative luminance of a color
 */
function getRelativeLuminance(color: string): number {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  // Apply gamma correction
  const sRGB = [r, g, b].map(c => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  // Calculate relative luminance
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(color1: string, color2: string): number {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Validate Eva Design theme structure and tokens
 */
export function validateEvaTheme(
  theme: Record<string, any>,
  options: EvaThemeValidationOptions = {},
): EvaThemeValidationResult {
  const { strict = false, checkRequiredTokens = true, validateColorContrast = true } = options;

  const errors: ThemeValidationError[] = [];
  const warnings: string[] = [];

  // Check if theme is an object
  if (!theme || typeof theme !== 'object') {
    errors.push(new ThemeValidationError('Theme must be an object'));
    return { isValid: false, errors, warnings };
  }

  // Validate required tokens
  if (checkRequiredTokens) {
    for (const token of REQUIRED_EVA_TOKENS) {
      if (!(token in theme)) {
        const error = new ThemeValidationError(`Missing required Eva Design token: ${token}`);
        if (strict) {
          errors.push(error);
        } else {
          warnings.push(error.message);
        }
      }
    }
  }

  // Validate color contrast
  if (validateColorContrast) {
    try {
      const textColor = theme['text-basic-color'];
      const backgroundColor = theme['background-basic-color-1'];

      if (textColor && backgroundColor) {
        // Skip validation if colors are not hex format
        if (
          typeof textColor === 'string' &&
          typeof backgroundColor === 'string' &&
          textColor.startsWith('#') &&
          backgroundColor.startsWith('#')
        ) {
          const contrastRatio = getContrastRatio(textColor, backgroundColor);

          if (contrastRatio < MIN_CONTRAST_RATIO) {
            const error = new ThemeValidationError(
              `Text contrast ratio (${contrastRatio.toFixed(2)}) is below WCAG AA standard (${MIN_CONTRAST_RATIO})`,
            );
            if (strict) {
              errors.push(error);
            } else {
              warnings.push(error.message);
            }
          }
        }
      }
    } catch (error) {
      warnings.push(`Color contrast validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Validate color token format
  const colorTokens = Object.keys(theme).filter(key => key.startsWith('color-'));
  for (const token of colorTokens) {
    const value = theme[token];
    if (typeof value === 'string') {
      // Check for valid color formats (hex, rgb, rgba, hsl, hsla)
      const colorRegex = /^(#[0-9A-Fa-f]{3,8}|rgb\(|rgba\(|hsl\(|hsla\()/;
      if (!colorRegex.test(value) && !value.startsWith('rgba(') && value !== 'transparent') {
        warnings.push(`Color token '${token}' has potentially invalid format: ${value}`);
      }
    }
  }

  // Validate typography tokens
  const fontSizeToken = theme['text-font-size'];
  if (fontSizeToken !== undefined) {
    if (typeof fontSizeToken !== 'number' && typeof fontSizeToken !== 'string') {
      errors.push(new ThemeValidationError(`Font size token must be a number or string, got ${typeof fontSizeToken}`));
    }
  }

  const fontWeightToken = theme['text-font-weight'];
  if (fontWeightToken !== undefined) {
    if (typeof fontWeightToken === 'string') {
      const validWeights = ['100', '200', '300', '400', '500', '600', '700', '800', '900', 'normal', 'bold'];
      if (!validWeights.includes(fontWeightToken)) {
        warnings.push(`Font weight '${fontWeightToken}' may not be supported on all platforms`);
      }
    } else if (typeof fontWeightToken === 'number') {
      if (fontWeightToken < 100 || fontWeightToken > 900 || fontWeightToken % 100 !== 0) {
        warnings.push(`Font weight ${fontWeightToken} should be between 100-900 in increments of 100`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get a safe Eva Design theme with fallbacks for missing tokens
 */
export function getSafeEvaTheme(theme: Record<string, any>): Record<string, any> {
  const safeTheme = { ...theme };

  // Provide fallbacks for required tokens
  const fallbacks: Record<string, any> = {
    'color-primary-600': '#0ea5e9',
    'color-success-600': '#22c55e',
    'color-info-600': '#3b82f6',
    'color-warning-600': '#f59e0b',
    'color-danger-600': '#ef4444',
    'text-basic-color': '#171717',
    'text-control-color': '#ffffff',
    'background-basic-color-1': '#ffffff',
    'background-basic-color-2': '#fafafa',
    'border-basic-color-1': '#e5e5e5',
    'text-font-family': 'System',
    'text-font-size': 16,
    'text-font-weight': '400',
  };

  for (const [token, fallback] of Object.entries(fallbacks)) {
    if (!(token in safeTheme)) {
      safeTheme[token] = fallback;
    }
  }

  return safeTheme;
}

/**
 * Enhanced theme validation error class
 */
export class EvaThemeValidationError extends ThemeValidationError {
  public readonly evaToken?: string;
  public readonly type: string;

  constructor(message: string, type: string = 'eva_validation', evaToken?: string) {
    super(message);
    this.type = type;
    this.evaToken = evaToken;
    this.name = 'EvaThemeValidationError';
  }
}
