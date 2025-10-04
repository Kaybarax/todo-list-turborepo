/**
 * useReducedMotion Hook
 * Detects the user's OS level reduced motion preference and provides helpers
 * to conditionally disable or simplify animations. Kept intentionally small so
 * it can be tree‑shaken in web builds and mocked easily in tests.
 */

import { useEffect, useState, useCallback } from 'react';
import { AccessibilityInfo } from 'react-native';

export interface UseReducedMotionOptions {
  /** Explicit override. If provided it wins over system preference. */
  override?: boolean;
  /** When true (default) we query the OS setting. */
  respectSystem?: boolean;
}

export interface UseReducedMotionReturn {
  /** Final decision (override > system). */
  prefersReducedMotion: boolean;
  /** Raw system setting (ignores override). */
  systemPrefersReducedMotion: boolean;
  /** Convenience helper to pick an animation config or a fallback. */
  maybe<T>(animated: T, fallback: T): T;
}

export const useReducedMotion = (options?: UseReducedMotionOptions): UseReducedMotionReturn => {
  const { override, respectSystem = true } = options || {};
  const [systemPrefersReducedMotion, setSystemPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (!respectSystem) return;
    let mounted = true;
    // Fetch initial value (RN API promise based)
    (AccessibilityInfo as any)?.isReduceMotionEnabled?.().then((value: boolean) => {
      if (mounted && typeof value === 'boolean') setSystemPrefersReducedMotion(value);
    });

    // Subscribe to changes
    const sub = (AccessibilityInfo as any)?.addEventListener?.('reduceMotionChanged', (value: boolean) => {
      if (mounted && typeof value === 'boolean') setSystemPrefersReducedMotion(value);
    });

    return () => {
      mounted = false;
      sub?.remove?.();
    };
  }, [respectSystem]);

  const prefersReducedMotion = Boolean(override ?? (respectSystem && systemPrefersReducedMotion));

  const maybe = useCallback<UseReducedMotionReturn['maybe']>(
    (animated, fallback) => (prefersReducedMotion ? fallback : animated),
    [prefersReducedMotion],
  );

  return { prefersReducedMotion, systemPrefersReducedMotion, maybe };
};

// Convenience default export
export default useReducedMotion;
