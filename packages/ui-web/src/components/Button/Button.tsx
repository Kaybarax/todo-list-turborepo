import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { cn } from '../../utils';

const buttonVariants = cva('btn', {
  variants: {
    variant: {
      default: 'btn-primary',
      destructive: 'btn-error',
      outline: 'btn-outline',
      secondary: 'btn-secondary',
      ghost: 'btn-ghost',
      link: 'btn-link',
    },
    size: {
      default: 'btn-md',
      sm: 'btn-sm',
      lg: 'btn-lg',
      icon: 'btn-square btn-md',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'size'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      asChild = false,
      leftIcon,
      rightIcon,
      children,
      loading = false,
      loadingText,
      disabled,
      ...props
    },
    ref,
  ) => {
    // Handle asChild by rendering a span wrapper if needed
    if (asChild) {
      return <span className={cn(buttonVariants({ variant, size }), className)}>{children}</span>;
    }

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={loading || disabled}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <>
            <span className="loading loading-spinner loading-sm" aria-hidden="true" />
            <span>{loadingText ?? 'Loading...'}</span>
          </>
        ) : (
          <>
            {leftIcon && (
              <span className="mr-2 inline-flex items-center" aria-hidden="true">
                {leftIcon}
              </span>
            )}
            <span>{children}</span>
            {rightIcon && (
              <span className="ml-2 inline-flex items-center" aria-hidden="true">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
