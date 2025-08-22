import React from 'react';

import { cn, cv, type VariantProps } from '../../utils';

const checkboxVariants = cv('checkbox', {
  variants: {
    size: {
      xs: 'checkbox-xs',
      sm: 'checkbox-sm',
      md: 'checkbox-md',
      lg: 'checkbox-lg',
      xl: 'checkbox-lg',
    },
    state: {
      default: '',
      success: 'checkbox-success',
      error: 'checkbox-error',
    },
  },
  defaultVariants: {
    size: 'md',
    state: 'default',
  },
});

export type CheckboxSize = NonNullable<VariantProps<typeof checkboxVariants>['size']>;
export type CheckboxState = NonNullable<VariantProps<typeof checkboxVariants>['state']>;

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    Partial<Pick<VariantProps<typeof checkboxVariants>, 'size' | 'state'>> {
  indeterminate?: boolean;
  label?: React.ReactNode;
  helperText?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, size = 'md', state = 'default', indeterminate, label, helperText, id, ...props }, ref) => {
    const innerRef = React.useRef<HTMLInputElement | null>(null);
    const combinedRef = (node: HTMLInputElement | null) => {
      innerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref && 'current' in ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    };

    React.useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = Boolean(indeterminate);
        // Keep aria-checked mixed for screen readers when indeterminate
        if (indeterminate) innerRef.current.setAttribute('aria-checked', 'mixed');
        else innerRef.current.removeAttribute('aria-checked');
      }
    }, [indeterminate]);

    const classes = checkboxVariants({ size, state });
    const helperId = helperText ? `${id ?? 'checkbox'}-help` : undefined;

    return (
      <div className="form-control w-full">
        <label className="label cursor-pointer justify-start gap-3">
          <input
            ref={combinedRef}
            id={id}
            type="checkbox"
            className={cn(classes, className)}
            aria-describedby={helperId}
            {...props}
          />
          {label && <span className="label-text">{label}</span>}
        </label>
        {helperText && (
          <div className="label py-0">
            <span id={helperId} className={cn('label-text-alt', state === 'error' && 'text-error')}>
              {helperText}
            </span>
          </div>
        )}
      </div>
    );
  },
);
Checkbox.displayName = 'Checkbox';
