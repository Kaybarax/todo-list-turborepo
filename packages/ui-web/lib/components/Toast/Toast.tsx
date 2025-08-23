import React from 'react';

import { cn, cv, type VariantProps } from '@/utils';

const toastVariants = cv('alert shadow-lg', {
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

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof toastVariants> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, size, title, description, icon, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        className={cn(toastVariants({ variant, size }), 'flex items-start gap-3', className)}
        {...props}
      >
        {icon && (
          <span aria-hidden className="mt-0.5 inline-flex items-center justify-center">
            {icon}
          </span>
        )}
        <div className="flex-1">
          {title && <div className="font-semibold leading-none mb-0.5">{title}</div>}
          {(description ?? children) && <div className="text-sm opacity-90">{description ?? children}</div>}
        </div>
      </div>
    );
  },
);
Toast.displayName = 'Toast';

const toasterVariants = cv('pointer-events-none fixed z-50 flex flex-col gap-2 p-4', {
  variants: {
    position: {
      'top-left': 'top-0 left-0 items-start',
      'top-right': 'top-0 right-0 items-end',
      'bottom-left': 'bottom-0 left-0 items-start',
      'bottom-right': 'bottom-0 right-0 items-end',
      'top-center': 'top-0 left-1/2 -translate-x-1/2 items-center',
      'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 items-center',
    },
  },
  defaultVariants: { position: 'top-right' },
});

export interface ToasterProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof toasterVariants> {}

export const Toaster = React.forwardRef<HTMLDivElement, ToasterProps>(({ className, position, ...props }, ref) => {
  return <div ref={ref} className={cn(toasterVariants({ position }), className)} {...props} />;
});
Toaster.displayName = 'Toaster';
