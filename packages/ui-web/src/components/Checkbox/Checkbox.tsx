import React from 'react';
import { Checkbox as FlowbiteCheckbox } from 'flowbite-react';
import { cn } from '../../utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'color'> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      onCheckedChange?.(event.target.checked);
    };

    return <FlowbiteCheckbox ref={ref} className={cn(className)} onChange={handleChange} {...props} />;
  },
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
