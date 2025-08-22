import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { cn } from '../../utils';

const buttonVariants = cva('btn', {
  variants: {
    variant: {
      default: 'btn-primary',
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      accent: 'btn-accent',
      neutral: 'btn-neutral',
      info: 'btn-info',
      success: 'btn-success',
      warning: 'btn-warning',
      error: 'btn-error',
      ghost: 'btn-ghost',
      link: 'btn-link',
      outline: 'btn-outline',
      active: 'btn-active',
      disabled: 'btn-disabled',
    },
    size: {
      xs: 'btn-xs',
      sm: 'btn-sm',
      default: 'btn-md',
      md: 'btn-md',
      lg: 'btn-lg',
    },
    shape: {
      default: '',
      square: 'btn-square',
      circle: 'btn-circle',
      wide: 'btn-wide',
    },
    glass: {
      true: 'glass',
    },
    block: {
      true: 'btn-block',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    shape: 'default',
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
  /** Custom loading spinner size */
  loadingSize?: 'xs' | 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      shape = 'default',
      glass,
      block,
      asChild = false,
      leftIcon,
      rightIcon,
      children,
      loading = false,
      loadingText,
      loadingSize = 'sm',
      disabled,
      ...props
    },
    ref,
  ) => {
    // Handle asChild by rendering a span wrapper if needed
    if (asChild) {
      return <span className={cn(buttonVariants({ variant, size, shape, glass, block }), className)}>{children}</span>;
    }

    const loadingSpinnerClass = `loading loading-spinner loading-${loadingSize}`;

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, shape, glass, block }), className)}
        disabled={loading || disabled}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <>
            <span className={loadingSpinnerClass} aria-hidden="true" />
            {loadingText && <span>{loadingText}</span>}
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
