import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { cn } from '@/utils';

const iconButtonVariants = cva('btn', {
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
    },
    size: {
      xs: 'btn-xs btn-square',
      sm: 'btn-sm btn-square',
      default: 'btn-md btn-square',
      md: 'btn-md btn-square',
      lg: 'btn-lg btn-square',
    },
    shape: {
      default: 'btn-square',
      circle: 'btn-circle',
    },
    glass: {
      true: 'glass',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    shape: 'default',
  },
});

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'size'>,
    VariantProps<typeof iconButtonVariants> {
  asChild?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { className, variant = 'default', size = 'default', shape = 'default', glass, asChild = false, children, ...props },
    ref,
  ) => {
    // Handle asChild by rendering a span wrapper if needed
    if (asChild) {
      return <span className={cn(iconButtonVariants({ variant, size, shape, glass }), className)}>{children}</span>;
    }

    return (
      <button ref={ref} className={cn(iconButtonVariants({ variant, size, shape, glass }), className)} {...props}>
        {children}
      </button>
    );
  },
);
IconButton.displayName = 'IconButton';

export { IconButton, iconButtonVariants };
