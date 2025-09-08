/**
 * Shared Shadows Utility (P1-3)
 * Provides a single place to obtain shadow styles by semantic elevation tokens.
 * Keeps underlying token structure decoupled from component usage so future
 * design adjustments (e.g., color scaling, platform overrides) require only
 * token-level edits.
 */
import { Platform } from 'react-native';
import { shadows, type ShadowTokens, type ShadowStyle } from '../tokens/shadows';

export type ShadowElevation = keyof ShadowTokens; // 'none' | 'sm' | ...

/**
 * Returns a shallow-cloned shadow style so callers can safely mutate without
 * affecting the shared token reference.
 * Optionally overrides color while preserving other properties.
 */
export const getShadow = (elevation: ShadowElevation, color?: string): ShadowStyle => {
  const base = shadows[elevation];
  return {
    ...base,
    shadowColor: color || base.shadowColor,
    // Guard: On Android if elevation is 0 we still want to ensure no residual shadow
    ...(Platform.OS === 'android' && base.elevation === 0 ? { shadowOpacity: 0, shadowRadius: 0 } : {}),
  };
};

/** Convenience helpers for common elevations (kept minimal to avoid bloat). */
export const shadowSm = (color?: string) => getShadow('sm', color);
export const shadowMd = (color?: string) => getShadow('md', color);
export const shadowLg = (color?: string) => getShadow('lg', color);
export const shadowXl = (color?: string) => getShadow('xl', color);

export default getShadow;
