import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { cn } from '@/utils';

const labelVariants = cva(
  'label-text text-sm font-semibold leading-relaxed transition-all duration-200 cursor-pointer select-none',
  {
    variants: {
      variant: {
        default: 'text-base-content hover:text-base-content/90',
        required: 'text-base-content hover:text-base-content/90 after:content-["*"] after:text-error after:ml-1',
        optional:
          'text-base-content/70 hover:text-base-content/90 after:content-["(optional)"] after:text-base-content/50 after:ml-1 after:text-xs after:font-normal',
        error: 'text-error hover:text-error/80',
        success: 'text-success hover:text-success/80',
      },
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement>, VariantProps<typeof labelVariants> {
  required?: boolean;
  optional?: boolean;
  error?: boolean;
  success?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, optional, error, success, variant, size, ...props }, ref) => {
    // Determine variant based on props
    const computedVariant = error
      ? 'error'
      : success
        ? 'success'
        : required
          ? 'required'
          : optional
            ? 'optional'
            : (variant ?? 'default');

    return (
      <label
        ref={ref}
        className={cn(
          'label cursor-pointer',
          labelVariants({ variant: computedVariant, size }),
          'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          'focus-within:text-primary transition-colors',
          className,
        )}
        {...props}
      />
    );
  },
);
Label.displayName = 'Label';

export { Label };
