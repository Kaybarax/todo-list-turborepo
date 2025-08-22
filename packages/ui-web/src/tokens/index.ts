import type { DesignTokens } from './types';
export * from './types';
export { defaultTokens } from './defaults';

/**
 * Convert a subset of tokens to CSS variable map (name -> value)
 */
export function tokensToCssVars(tokens: DesignTokens): Record<string, string> {
  const vars: Record<string, string> = {};

  // Semantic colors
  const s = tokens.colors.semantic;
  vars['--background'] = s.background;
  vars['--foreground'] = s.foreground;
  vars['--muted'] = s.muted;
  vars['--muted-foreground'] = s.mutedForeground;
  vars['--border'] = s.border;
  vars['--input'] = s.input;
  vars['--ring'] = s.ring;
  vars['--card'] = s.card;
  vars['--card-foreground'] = s.cardForeground;
  vars['--popover'] = s.popover;
  vars['--popover-foreground'] = s.popoverForeground;

  // Brand/intent colors
  vars['--primary'] = tokens.colors.primary[500];
  vars['--primary-foreground'] = s.muted; // reasonable default
  vars['--secondary'] = tokens.colors.secondary[500];
  vars['--secondary-foreground'] = s.foreground;
  vars['--destructive'] = tokens.colors.error[500];
  vars['--destructive-foreground'] = s.foreground;
  vars['--accent'] = tokens.colors.neutral[500];
  vars['--accent-foreground'] = s.foreground;

  // Radius
  if (tokens.borderRadius?.DEFAULT) {
    vars['--radius'] = tokens.borderRadius.DEFAULT;
  }

  // Typography font families as CSS variables (for Tailwind integration)
  if (tokens.typography?.fontFamily) {
    vars['--font-sans'] = tokens.typography.fontFamily.sans.join(',');
    vars['--font-serif'] = tokens.typography.fontFamily.serif.join(',');
    vars['--font-mono'] = tokens.typography.fontFamily.mono.join(',');
  }

  return vars;
}

/**
 * Apply tokens to documentElement as CSS variables at runtime
 */
export function applyTokensToDocument(tokens: DesignTokens, root: HTMLElement = document.documentElement) {
  const vars = tokensToCssVars(tokens);
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
}
