import React from 'react';

import { cn } from '@todo/utils/ui/web';
import { Label } from '../Label/Label';

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  label?: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  error?: boolean;
  success?: boolean;
  helperText?: React.ReactNode;
  /** The form control element. If it accepts id/aria props, they will be injected. */
  children: React.ReactElement;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ id, label, required, optional, error, success, helperText, className, children, ...props }, ref) => {
    const fieldId = id ?? React.useId();
    const helpId = helperText ? `${fieldId}-help` : undefined;

    const control = React.cloneElement(children, {
      id: (children.props as any).id ?? fieldId,
      'aria-describedby': cn((children.props as any)['aria-describedby'], helpId),
      'aria-invalid': error ? true : (children.props as any)['aria-invalid'],
    } as any);

    return (
      <div ref={ref} className={cn('form-control w-full', className)} {...props}>
        {label && (
          <Label htmlFor={fieldId} required={required} optional={optional} error={error} success={success}>
            {label}
          </Label>
        )}
        {control}
        {helperText && (
          <div className="label py-0">
            <span id={helpId} className={cn('label-text-alt', error && 'text-error', success && 'text-success')}>
              {helperText}
            </span>
          </div>
        )}
      </div>
    );
  },
);
FormField.displayName = 'FormField';

export interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  legend?: React.ReactNode;
  description?: React.ReactNode;
}

export const FormGroup = React.forwardRef<HTMLDivElement, FormGroupProps>(
  ({ legend, description, className, children, ...props }, ref) => {
    const groupId = React.useId();
    const descId = description ? `${groupId}-desc` : undefined;

    return (
      <fieldset ref={ref as any} className={cn('w-full space-y-2 border-0', className)} {...(props as any)}>
        {(legend || description) && (
          <div className="space-y-1">
            {legend && <legend className="font-semibold text-sm">{legend}</legend>}
            {description && (
              <p id={descId} className="text-xs text-base-content/70">
                {description}
              </p>
            )}
          </div>
        )}
        <div aria-describedby={descId} className="grid gap-3">
          {children}
        </div>
      </fieldset>
    );
  },
);
FormGroup.displayName = 'FormGroup';
