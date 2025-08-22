import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from './index';

/**
 * Typed helper to create a CVA with built-in className merging.
 * Usage: const buttonVariants = cv('base classes', { variants, defaultVariants });
 * Then: cn(buttonVariants({ variant: 'primary' }), className)
 */
export const cv = cva;
export type { VariantProps };

/**
 * Utility that merges a cva output with an optional className.
 */
export function cvm<T extends (...args: any[]) => string>(
  variantsFn: T,
  options?: Parameters<T>[0],
  className?: string,
) {
  return cn(variantsFn(options as any), className);
}
