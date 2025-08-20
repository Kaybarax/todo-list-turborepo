import React from 'react';
import { Badge as FlowbiteBadge } from 'flowbite-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils';

// Map our variants to Flowbite variants
const variantMap = {
  default: 'info',
  secondary: 'gray',
  destructive: 'failure',
  outline: 'gray',
  success: 'success',
  warning: 'warning',
  info: 'info',
} as const;

const badgeVariants = cva('', {
  variants: {
    variant: {
      default: '',
      secondary: '',
      destructive: '',
      outline: '',
      success: '',
      warning: '',
      info: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

function Badge({ className, variant = 'default', icon, children, ...props }: BadgeProps) {
  const flowbiteVariant = variant ? variantMap[variant] || 'info' : 'info';

  return (
    <FlowbiteBadge color={flowbiteVariant as any} className={cn(badgeVariants({ variant }), className)} {...props}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </FlowbiteBadge>
  );
}

export { Badge, badgeVariants };
