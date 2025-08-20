import React from 'react';
import { TextInput } from 'flowbite-react';
import { cn } from '../../utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'color' | 'size'> {
  error?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, helperText, leftIcon, rightIcon, type, ...props }, ref) => {
    return (
      <div className="w-full">
        <TextInput
          ref={ref}
          type={type}
          color={error ? 'failure' : 'gray'}
          className={cn(className)}
          icon={leftIcon ? () => leftIcon : undefined}
          rightIcon={rightIcon ? () => rightIcon : undefined}
          {...props}
        />
        {helperText && <p className={cn('mt-1 text-xs', error ? 'text-red-600' : 'text-gray-600')}>{helperText}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
