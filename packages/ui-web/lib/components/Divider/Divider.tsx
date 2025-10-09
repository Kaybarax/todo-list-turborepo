import React from 'react';

import { cn, cv, type VariantProps } from '@todo/utils/ui/web';

const dividerVariants = cv('divider', {
  variants: {
    orientation: {
      horizontal: 'divider-horizontal',
      vertical: 'divider-vertical',
    },
    tone: {
      default: '',
      neutral: 'text-base-content/50',
      muted: 'text-base-content/30',
      strong: 'text-base-content/80',
      primary: 'text-primary',
      secondary: 'text-secondary',
      success: 'text-success',
      error: 'text-error',
    },
    inset: {
      none: '',
      sm: 'mx-1',
      md: 'mx-2',
      lg: 'mx-4',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    tone: 'default',
    inset: 'none',
  },
});

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof dividerVariants> {
  label?: React.ReactNode;
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation, tone, inset, label, role, ...props }, ref) => {
    const classes = dividerVariants({ orientation, tone, inset });

    return (
      <div
        ref={ref}
        className={cn(classes, className)}
        // role={ariaRole} // TODO: go figure
        // aria-orientation={ariaOrientation} // TODO: go figure
        {...props}
      >
        {label}
      </div>
    );
  },
);
Divider.displayName = 'Divider';
