import React from 'react';

import { cn, cv, type VariantProps } from '@todo/utils/ui/web';

const switchVariants = cv('toggle', {
  variants: {
    size: {
      sm: 'toggle-sm',
      md: 'toggle-md',
      lg: 'toggle-lg',
    },
    state: {
      default: '',
      success: 'toggle-success',
      error: 'toggle-error',
    },
  },
  defaultVariants: {
    size: 'md',
    state: 'default',
  },
});

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>,
    VariantProps<typeof switchVariants> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, size, state, id, label, helperText, disabled, ...props }, ref) => {
    const classes = switchVariants({ size, state });
    const helpId = helperText ? `${id ?? 'switch'}-help` : undefined;

    return (
      <div className="form-control w-full">
        <label className="label cursor-pointer justify-start gap-3">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            role="switch"
            aria-checked={props.checked}
            aria-describedby={helpId}
            disabled={disabled}
            className={cn(classes, className)}
            {...props}
          />
          {label && <span className="label-text">{label}</span>}
        </label>
        {helperText && (
          <div className="label py-0">
            <span id={helpId} className={cn('label-text-alt', state === 'error' && 'text-error')}>
              {helperText}
            </span>
          </div>
        )}
      </div>
    );
  },
);
Switch.displayName = 'Switch';
