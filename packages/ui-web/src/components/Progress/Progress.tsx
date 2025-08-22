import React from 'react';

import { cn, cv, type VariantProps } from '../../utils';

const progressTrackVariants = cv('w-full rounded-full bg-base-300 overflow-hidden', {
  variants: {
    size: {
      xs: 'h-1',
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4',
    },
  },
  defaultVariants: { size: 'md' },
});

const progressBarVariants = cv('h-full transition-all', {
  variants: {
    tone: {
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      success: 'bg-success',
      warning: 'bg-warning',
      error: 'bg-error',
      info: 'bg-info',
      neutral: 'bg-base-content',
    },
    striped: {
      true: 'bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.2)_10px,rgba(255,255,255,0.2)_20px)]',
    },
    animated: { true: 'animate-pulse' },
  },
  defaultVariants: { tone: 'primary' },
});

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressTrackVariants>,
    VariantProps<typeof progressBarVariants> {
  value?: number; // 0-100
  min?: number;
  max?: number;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, size, tone, striped, animated, value = 0, min = 0, max = 100, ...props }, ref) => {
    const clamped = Math.max(min, Math.min(max, value));
    const percent = ((clamped - min) / (max - min)) * 100;
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={Math.round(clamped)}
        className={cn(progressTrackVariants({ size }), className)}
        {...props}
      >
        <div className={cn(progressBarVariants({ tone, striped, animated }))} style={{ width: `${percent}%` }} />
      </div>
    );
  },
);
Progress.displayName = 'Progress';
