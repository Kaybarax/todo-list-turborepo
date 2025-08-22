export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type BreakpointKey = keyof typeof breakpoints;

export function mqUp(bp: BreakpointKey): string {
  return `(min-width: ${breakpoints[bp]}px)`;
}

export function mqDown(bp: BreakpointKey): string {
  // Tailwind "down" is usually max-width of one less than next breakpoint
  const value = breakpoints[bp] - 0.02; // avoid overlap
  return `(max-width: ${value}px)`;
}

export function matches(query: string): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(query).matches;
}

export function isUp(bp: BreakpointKey): boolean {
  return matches(mqUp(bp));
}

export function isDown(bp: BreakpointKey): boolean {
  return matches(mqDown(bp));
}
