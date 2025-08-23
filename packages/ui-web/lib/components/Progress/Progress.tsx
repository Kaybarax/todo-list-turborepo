import React from 'react';

import { cn, cv, type VariantProps } from '@/utils';

const progressVariants = cv('progress w-full', {
  variants: {
    variant: {
      primary: 'progress-primary',
      secondary: 'progress-secondary',
      accent: 'progress-accent',
      info: 'progress-info',
      success: 'progress-success',
      warning: 'progress-warning',
      error: 'progress-error',
    },
    size: {
      xs: 'progress-xs',
      sm: 'progress-sm',
      md: 'progress-md',
      lg: 'progress-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export interface ProgressProps
  extends React.HTMLAttributes<HTMLProgressElement>,
    VariantProps<typeof progressVariants> {
  value?: number | null; // 0-100, null/undefined for indeterminate
  min?: number;
  max?: number;
}

export const Progress = React.forwardRef<HTMLProgressElement, ProgressProps>(
  ({ className, size, variant, value, min = 0, max = 100, ...props }, ref) => {
    const isIndeterminate = value === undefined || value === null;
    const clamped = isIndeterminate ? 0 : Math.max(min, Math.min(max, value));

    return (
      <progress
        ref={ref}
        value={isIndeterminate ? undefined : clamped}
        max={max}
        aria-valuenow={isIndeterminate ? undefined : String(clamped)}
        aria-valuemin={String(min)}
        aria-valuemax={String(max)}
        className={cn(progressVariants({ size, variant }), className)}
        {...props}
      />
    );
  },
);
Progress.displayName = 'Progress';
