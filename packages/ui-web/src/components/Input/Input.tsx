import React from 'react';

import { cn, cv, type VariantProps } from '../../utils';

const inputVariants = cv('input input-bordered w-full', {
  variants: {
    size: {
      xs: 'input-xs',
      sm: 'input-sm',
      md: 'input-md',
      lg: 'input-lg',
      xl: 'input-lg text-lg',
    },
    state: {
      default: '',
      success: 'input-success',
      error: 'input-error',
    },
    hasLeftIcon: { true: 'pl-12', false: '' },
    hasRightIcon: { true: 'pr-12', false: '' },
  },
  defaultVariants: {
    size: 'md',
    state: 'default',
    hasLeftIcon: false,
    hasRightIcon: false,
  },
});

export type InputSize = NonNullable<VariantProps<typeof inputVariants>['size']>;
export type InputState = NonNullable<VariantProps<typeof inputVariants>['state']>;

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'color' | 'size'>,
    Partial<Pick<VariantProps<typeof inputVariants>, 'size' | 'state'>> {
  error?: boolean; // deprecated in favor of state="error"; kept for backward compatibility
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, helperText, leftIcon, rightIcon, type, size = 'md', state = 'default', id, ...props }, ref) => {
    const effectiveState: InputState = error ? 'error' : (state ?? 'default');
    const helperId = helperText ? `${id ?? 'input'}-help` : undefined;
    const classes = inputVariants({
      size,
      state: effectiveState,
      hasLeftIcon: Boolean(leftIcon),
      hasRightIcon: Boolean(rightIcon),
      className: undefined as any,
    });

    return (
      <div className="w-full">
        <div className="relative w-full">
          <input
            ref={ref}
            id={id}
            type={type}
            className={cn(classes, className)}
            aria-invalid={effectiveState === 'error' ? true : undefined}
            aria-describedby={helperId}
            {...props}
          />

          {leftIcon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">{leftIcon}</div>
          )}

          {rightIcon && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">{rightIcon}</div>
          )}
        </div>

        {helperText && (
          <div className="label">
            <span id={helperId} className={cn('label-text-alt', effectiveState === 'error' && 'text-error')}>
              {helperText}
            </span>
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
