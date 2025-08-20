import React from 'react';
import { Button as FlowbiteButton } from 'flowbite-react';
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
  icon: 'sm',
} as const;

const buttonVariants = cva('', {
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
      icon: 'aspect-square',
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
  isLoading?: boolean;
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
      isLoading = false,
      loadingText,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;
    const flowbiteVariant = variant ? variantMap[variant] || 'info' : 'info';
    const flowbiteSize = size ? sizeMap[size] || 'md' : 'md';

    // Handle asChild by rendering a span wrapper if needed
    if (asChild) {
      return <span className={cn(buttonVariants({ variant, size, className }))}>{children}</span>;
    }

    const content = (
      <>
        {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}
        {isLoading && loadingText ? loadingText : children}
        {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
      </>
    );

    return (
      <FlowbiteButton
        ref={ref}
        color={flowbiteVariant as any}
        size={flowbiteSize as any}
        disabled={isDisabled}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {isLoading && (
          <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {content}
      </FlowbiteButton>
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
