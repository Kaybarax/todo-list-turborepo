import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils';

const inputVariants = cva(
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        filled: 'bg-muted border-0 focus-visible:bg-background',
        ghost: 'border-0 shadow-none bg-transparent focus-visible:ring-1',
      },
      size: {
        default: 'h-10 px-3 py-2',
        sm: 'h-9 px-3 py-2 text-xs',
        lg: 'h-11 px-4 py-2',
      },
      state: {
        default: '',
        error: 'border-destructive focus-visible:ring-destructive',
        success: 'border-green-500 focus-visible:ring-green-500',
        warning: 'border-yellow-500 focus-visible:ring-yellow-500',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  asChild?: boolean;
  error?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
  labelProps?: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant,
    size,
    state,
    error, 
    helperText, 
    leftIcon, 
    rightIcon, 
    label,
    labelProps,
    asChild = false,
    type, 
    id,
    ...props 
  }, ref) => {
    const inputId = id || React.useId();
    const helperTextId = helperText ? `${inputId}-helper` : undefined;
    
    // Determine state based on error prop
    const finalState = error ? 'error' : state;

    const inputElement = asChild ? (
      <Slot
        className={cn(
          inputVariants({ variant, size, state: finalState }),
          leftIcon && 'pl-10',
          rightIcon && 'pr-10',
          className
        )}
        ref={ref}
        id={inputId}
        aria-describedby={helperTextId}
        {...props}
      />
    ) : (
      <input
        type={type}
        className={cn(
          inputVariants({ variant, size, state: finalState }),
          leftIcon && 'pl-10',
          rightIcon && 'pr-10',
          className
        )}
        ref={ref}
        id={inputId}
        aria-describedby={helperTextId}
        {...props}
      />
    );

    return (
      <div className="relative w-full">
        {label && (
          <LabelPrimitive.Root
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block',
              error && 'text-destructive'
            )}
            {...labelProps}
          >
            {label}
          </LabelPrimitive.Root>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className={cn(
                'text-muted-foreground',
                error && 'text-destructive'
              )}>
                {leftIcon}
              </span>
            </div>
          )}
          {inputElement}
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className={cn(
                'text-muted-foreground',
                error && 'text-destructive'
              )}>
                {rightIcon}
              </span>
            </div>
          )}
        </div>
        {helperText && (
          <p 
            id={helperTextId}
            className={cn(
              'mt-1 text-xs',
              error ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Label component for standalone use
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  />
));
Label.displayName = 'Label';

export { Input, Label, inputVariants };