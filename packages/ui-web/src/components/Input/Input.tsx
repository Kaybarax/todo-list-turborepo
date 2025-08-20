import React from 'react';
import { cn } from '../../utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'color' | 'size'> {
  error?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, helperText, leftIcon, rightIcon, type, ...props }, ref) => {
    const inputClasses = cn(
      'input input-bordered w-full',
      leftIcon && 'pl-12',
      rightIcon && 'pr-12',
      error && 'input-error',
      className,
    );

    return (
      <div className="w-full">
        <div className="relative w-full">
          <input ref={ref} type={type} className={inputClasses} {...props} />

          {leftIcon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">{leftIcon}</div>
          )}

          {rightIcon && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">{rightIcon}</div>
          )}
        </div>

        {helperText && (
          <div className="label">
            <span className={cn('label-text-alt', error && 'text-error')}>{helperText}</span>
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
