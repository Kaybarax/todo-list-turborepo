import { cva, type VariantProps } from 'class-variance-authority';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names and merges Tailwind CSS classes
 * @param inputs - Class names to combine
 * @returns Merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
export function cvm<T extends (..._args: any[]) => string>(
  variantsFn: T,
  options?: Parameters<T>[0],
  className?: string,
) {
  return cn(variantsFn(options as any), className);
}
