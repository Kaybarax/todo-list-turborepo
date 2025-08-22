import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { cn } from '../../utils';

const badgeVariants = cva(
  'badge inline-flex items-center gap-1.5 font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1 shadow-sm',
  {
    variants: {
      variant: {
        default: 'badge-primary shadow-primary/25 hover:shadow-lg hover:shadow-primary/40',
        secondary: 'badge-secondary shadow-secondary/20 hover:shadow-md',
        destructive: 'badge-error shadow-error/25 hover:shadow-lg hover:shadow-error/40',
        outline: 'badge-outline hover:shadow-md',
        success: 'badge-success shadow-success/25 hover:shadow-lg hover:shadow-success/40',
        warning: 'badge-warning shadow-warning/25 hover:shadow-lg hover:shadow-warning/40',
        info: 'badge-info shadow-info/25 hover:shadow-lg hover:shadow-info/40',
      },
      size: {
        xs: 'badge-xs',
        sm: 'badge-sm',
        md: 'badge-md',
        lg: 'badge-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  },
);

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

const Badge = ({ className, variant = 'default', size, icon, children, ...props }: BadgeProps) => {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="flex-shrink-0 transition-transform duration-200 group-hover:rotate-12">{icon}</span>}
      <span className="truncate">{children}</span>
    </span>
  );
};

export { Badge, badgeVariants };
