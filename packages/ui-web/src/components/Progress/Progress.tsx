import React from 'react';

import { cn, cv, type VariantProps } from '../../utils';

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
  value?: number; // 0-100
  min?: number;
  max?: number;
}

export const Progress = React.forwardRef<HTMLProgressElement, ProgressProps>(
  ({ className, size, variant, value = 0, min = 0, max = 100, ...props }, ref) => {
    const clamped = Math.max(min, Math.min(max, value));
    return (
      <progress
        ref={ref}
        value={clamped}
        max={max}
        className={cn(progressVariants({ size, variant }), className)}
        {...props}
      />
    );
  },
);
Progress.displayName = 'Progress';
