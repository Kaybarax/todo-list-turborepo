import React from 'react';
import { Select as FlowbiteSelect } from 'flowbite-react';
import { cn } from '../../utils';

// Simple wrapper around Flowbite Select
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'color' | 'size'> {
  helperText?: string;
  error?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, helperText, error, children, ...props }, ref) => {
    return (
      <div className="w-full">
        <FlowbiteSelect ref={ref} color={error ? 'failure' : 'gray'} className={cn(className)} {...props}>
          {children}
        </FlowbiteSelect>
        {helperText && <p className={cn('mt-1 text-xs', error ? 'text-red-600' : 'text-gray-600')}>{helperText}</p>}
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
