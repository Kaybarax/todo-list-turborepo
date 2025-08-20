import React from 'react';

import { cn } from '../../utils';

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'color'> {
  error?: boolean;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, helperText, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const textareaClasses = cn('textarea textarea-bordered w-full', error && 'textarea-error', className);

    const containerClasses = cn(
      'relative w-full group',
      isFocused && 'transform scale-[1.01] transition-transform duration-200',
    );

    return (
      <div className="w-full space-y-2">
        <div className={containerClasses}>
          <textarea
            ref={ref}
            className={textareaClasses}
            onFocus={e => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={e => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />

          {/* Animated border gradient */}
          <div
            className={cn(
              'absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none',
              'bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 p-[2px]',
              isFocused && !error && 'opacity-20',
            )}
          >
            <div className="w-full h-full bg-white rounded-[10px]" />
          </div>

          {/* Resize handle indicator */}
          <div
            className={cn(
              'absolute bottom-2 right-2 w-4 h-4 opacity-20 transition-opacity duration-200',
              'bg-gradient-to-br from-gray-400 to-gray-600',
              'mask-image-[radial-gradient(circle_at_center,_black_30%,_transparent_30%)]',
              isFocused && 'opacity-40',
            )}
          >
            <div className="w-full h-full bg-current" />
          </div>
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

Textarea.displayName = 'Textarea';

export { Textarea };
