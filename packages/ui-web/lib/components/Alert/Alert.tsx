import React from 'react';

import { cn, cv, type VariantProps } from '@todo/utils/ui/web';

const alertVariants = cv('alert', {
  variants: {
    variant: {
      info: 'alert-info',
      success: 'alert-success',
      warning: 'alert-warning',
      error: 'alert-error',
      neutral: 'bg-base-200 text-base-content',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'info',
    size: 'md',
  },
});

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof alertVariants> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, size, title, description, icon, dismissible, onDismiss, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant, size }), 'flex items-start gap-3', className)}
        {...props}
      >
        {icon && (
          <span aria-hidden className="mt-0.5 inline-flex items-center justify-center">
            {icon}
          </span>
        )}
        <div className="flex-1">
          {title && <div className="font-semibold leading-none mb-0.5">{title}</div>}
          {(description ?? children) ? <div className="text-sm opacity-90">{description ?? children}</div> : null}
        </div>
        {dismissible && (
          <button type="button" aria-label="Dismiss" className="btn btn-ghost btn-xs" onClick={onDismiss}>
            ✕
          </button>
        )}
      </div>
    );
  },
);
Alert.displayName = 'Alert';
