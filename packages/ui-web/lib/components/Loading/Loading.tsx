import React from 'react';

import { cn, cv, type VariantProps } from '@/utils';

const loadingVariants = cv('loading', {
  variants: {
    kind: {
      spinner: 'loading-spinner',
      ring: 'loading-ring',
      dots: 'loading-dots',
      bars: 'loading-bars',
      ball: 'loading-ball',
    },
    size: {
      xs: 'loading-xs',
      sm: 'loading-sm',
      md: 'loading-md',
      lg: 'loading-lg',
    },
    tone: {
      default: '',
      primary: 'text-primary',
      secondary: 'text-secondary',
      success: 'text-success',
      warning: 'text-warning',
      error: 'text-error',
      info: 'text-info',
      neutral: 'text-base-content',
    },
  },
  defaultVariants: {
    kind: 'spinner',
    size: 'md',
    tone: 'default',
  },
});

export interface LoadingProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof loadingVariants> {
  label?: string;
}

export const Loading = React.forwardRef<HTMLSpanElement, LoadingProps>(
  ({ className, kind, size, tone, label = 'Loading', ...props }, ref) => {
    return (
      <span
        ref={ref}
        role="status"
        aria-live="polite"
        aria-busy="true"
        className={cn(loadingVariants({ kind, size, tone }), className)}
        {...props}
      >
        <span className="sr-only">{label}</span>
      </span>
    );
  },
);
Loading.displayName = 'Loading';
