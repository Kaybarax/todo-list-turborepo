import React from 'react';

import { cn, cv, type VariantProps } from '../../utils';

const radioVariants = cv('radio', {
  variants: {
    size: {
      xs: 'radio-xs',
      sm: 'radio-sm',
      md: 'radio-md',
      lg: 'radio-lg',
      xl: 'radio-lg',
    },
    variant: {
      default: '',
      primary: 'radio-primary',
      secondary: 'radio-secondary',
      accent: 'radio-accent',
      info: 'radio-info',
      success: 'radio-success',
      warning: 'radio-warning',
      error: 'radio-error',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

export type RadioSize = NonNullable<VariantProps<typeof radioVariants>['size']>;
export type RadioVariant = NonNullable<VariantProps<typeof radioVariants>['variant']>;

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    Partial<Pick<VariantProps<typeof radioVariants>, 'size' | 'variant'>> {
  label?: React.ReactNode;
  helperText?: string;
  /** @deprecated Use variant instead */
  state?: RadioVariant;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, size = 'md', variant = 'default', state, label, helperText, id, name, ...props }, ref) => {
    // Support legacy state prop by mapping to variant
    const effectiveVariant = state || variant;
    const classes = radioVariants({ size, variant: effectiveVariant });
    const helperId = helperText ? `${id ?? name ?? 'radio'}-help` : undefined;

    return (
      <div className="form-control w-full">
        <label className="label cursor-pointer justify-start gap-3">
          <input
            ref={ref}
            id={id}
            name={name}
            type="radio"
            className={cn(classes, className)}
            aria-describedby={helperId}
            {...props}
          />
          {label && <span className="label-text">{label}</span>}
        </label>
        {helperText && (
          <div className="label py-0">
            <span id={helperId} className={cn('label-text-alt', effectiveVariant === 'error' && 'text-error')}>
              {helperText}
            </span>
          </div>
        )}
      </div>
    );
  },
);
Radio.displayName = 'Radio';
