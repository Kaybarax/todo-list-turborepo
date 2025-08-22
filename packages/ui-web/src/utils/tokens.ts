/**
 * Token Access Utilities
 * Runtime utilities for accessing and validating design tokens
 */

import type { DesignTokens, ValidTokenPath, GetTokenValue } from '../types/tokens';
import { validateTokenAccess } from '../types/validation';

// Token access function with runtime validation
export function getToken<P extends ValidTokenPath>(tokens: DesignTokens, path: P): GetTokenValue<P> | undefined {
  const validation = validateTokenAccess(path);

  if (!validation.isValid) {
    console.warn(`Invalid token path: ${path}`, validation.errors);
    return undefined;
  }

  const pathParts = path.split('.');
  let current: any = tokens;

  for (const part of pathParts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      console.warn(`Token not found: ${path}`);
      return undefined;
    }
  }

  return current;
}

// Safe token access with fallback
export function getTokenWithFallback<P extends ValidTokenPath>(
  tokens: DesignTokens,
  path: P,
  fallback: GetTokenValue<P>,
): GetTokenValue<P> {
  const value = getToken(tokens, path);
  return value !== undefined ? value : fallback;
}

// CSS custom property generator
export function generateCSSCustomProperties(tokens: DesignTokens): string {
  const properties: string[] = [];

  function traverse(obj: any, prefix: string = '') {
    for (const [key, value] of Object.entries(obj)) {
      const cssVar = `--${prefix}${prefix ? '-' : ''}${key.replace(/[A-Z]/g, '-$&').toLowerCase()}`;

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        traverse(value, `${prefix}${prefix ? '-' : ''}${key}`);
      } else {
        properties.push(`  ${cssVar}: ${value};`);
      }
    }
  }

  traverse(tokens);

  return `:root {\n${properties.join('\n')}\n}`;
}

// Token validation utility
export function validateTokenStructure(tokens: any): tokens is DesignTokens {
  const requiredCategories = ['color', 'space', 'typography', 'border', 'shadow'];

  if (!tokens || typeof tokens !== 'object') {
    return false;
  }

  for (const category of requiredCategories) {
    if (!(category in tokens)) {
      console.warn(`Missing required token category: ${category}`);
      return false;
    }
  }

  return true;
}

// Token theme merger
export function mergeTokenThemes(baseTokens: DesignTokens, themeTokens: Partial<DesignTokens>): DesignTokens {
  return {
    ...baseTokens,
    ...themeTokens,
    semantic: {
      ...baseTokens.semantic,
      ...themeTokens.semantic,
    },
  };
}

// Export token constants for runtime use
export const TOKEN_CATEGORIES = ['color', 'space', 'typography', 'border', 'shadow', 'semantic'] as const;

export const COLOR_SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;

export const SPACING_SCALE = [
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
] as const;
