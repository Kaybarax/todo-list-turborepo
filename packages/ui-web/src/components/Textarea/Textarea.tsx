import React from 'react';
import { Textarea as FlowbiteTextarea } from 'flowbite-react';
import { cn } from '../../utils';

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'color'> {
  error?: boolean;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        <FlowbiteTextarea ref={ref} color={error ? 'failure' : 'gray'} className={cn(className)} {...props} />
        {helperText && <p className={cn('mt-1 text-xs', error ? 'text-red-600' : 'text-gray-600')}>{helperText}</p>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
