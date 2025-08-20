import React from 'react';
import { cn } from '../../utils';

// Simple wrapper around Flowbite Select
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'color' | 'size'> {
  helperText?: string;
  error?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, helperText, error, children, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, ...props },
    ref,
  ) => {
    // Ensure accessibility by providing a fallback aria-label if none is provided
    const accessibilityProps = {
      'aria-label': ariaLabel || (ariaLabelledby ? undefined : 'Select option'),
      'aria-labelledby': ariaLabelledby,
    };

    return (
      <div className="w-full">
        <select
          ref={ref}
          className={cn('select select-bordered w-full', error && 'select-error', className)}
          {...accessibilityProps}
          {...props}
        >
          {children}
        </select>

        {helperText && (
          <div className="label">
            <span className={cn('label-text-alt', error && 'text-error')}>{helperText}</span>
          </div>
        )}
      </div>
    );
  },
);
Select.displayName = 'Select';

// For backward compatibility, create simple wrapper components
const SelectGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => (
  <option value="" disabled>
    {placeholder}
  </option>
);
const SelectTrigger = Select;
const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
const SelectLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => <optgroup label={children as string} />;
const SelectItem: React.FC<{ value: string; children: React.ReactNode }> = ({ value, children }) => (
  <option value={value}>{children}</option>
);
const SelectSeparator: React.FC = () => <hr />;

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator };
