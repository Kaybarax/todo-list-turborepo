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
    state: {
      default: '',
      success: 'radio-success',
      error: 'radio-error',
    },
  },
  defaultVariants: {
    size: 'md',
    state: 'default',
  },
});

export type RadioSize = NonNullable<VariantProps<typeof radioVariants>['size']>;
export type RadioState = NonNullable<VariantProps<typeof radioVariants>['state']>;

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    Partial<Pick<VariantProps<typeof radioVariants>, 'size' | 'state'>> {
  label?: React.ReactNode;
  helperText?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, size = 'md', state = 'default', label, helperText, id, name, ...props }, ref) => {
    const classes = radioVariants({ size, state });
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
            <span id={helperId} className={cn('label-text-alt', state === 'error' && 'text-error')}>
              {helperText}
            </span>
          </div>
        )}
      </div>
    );
  },
);
Radio.displayName = 'Radio';
