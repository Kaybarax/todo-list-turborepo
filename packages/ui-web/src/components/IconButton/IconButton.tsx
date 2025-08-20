import React from 'react';
import { Button } from 'flowbite-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils';

// Map our variants to Flowbite variants
const variantMap = {
  default: 'info',
  destructive: 'failure',
  outline: 'light',
  secondary: 'alternative',
  ghost: 'light',
  link: 'light',
} as const;

const sizeMap = {
  default: 'md',
  sm: 'sm',
  lg: 'lg',
  xs: 'xs',
} as const;

const iconButtonVariants = cva('aspect-square', {
  variants: {
    variant: {
      default: '',
      destructive: '',
      outline: '',
      secondary: '',
      ghost: '',
      link: '',
    },
    size: {
      default: '',
      sm: '',
      lg: '',
      xs: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'size'>,
    VariantProps<typeof iconButtonVariants> {
  asChild?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const flowbiteVariant = variant ? variantMap[variant] || 'info' : 'info';
    const flowbiteSize = size ? sizeMap[size] || 'md' : 'md';

    // Handle asChild by rendering a span wrapper if needed
    if (asChild) {
      return <span className={cn(iconButtonVariants({ variant, size, className }))}>{props.children}</span>;
    }

    return (
      <Button
        ref={ref}
        color={flowbiteVariant as any}
        size={flowbiteSize as any}
        className={cn(iconButtonVariants({ variant, size }), 'p-2', className)}
        {...props}
      />
    );
  },
);
IconButton.displayName = 'IconButton';

export { IconButton, iconButtonVariants };
