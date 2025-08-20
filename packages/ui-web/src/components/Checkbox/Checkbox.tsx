import React from 'react';

import { cn } from '../../utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'color'> {
  onCheckedChange?: (checked: boolean) => void;
  error?: boolean;
  helperText?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, onChange, error, helperText, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      onCheckedChange?.(event.target.checked);
    };

    const checkboxClasses = cn('checkbox', error && 'checkbox-error', className);

    return (
      <div className="relative inline-flex items-center">
        <input ref={ref} type="checkbox" className={checkboxClasses} onChange={handleChange} {...props} />
        {helperText && (
          <div className="label">
            <span className={cn('label-text-alt', error && 'text-error')}>{helperText}</span>
          </div>
        )}
      </div>
    );
  },
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
