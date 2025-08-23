import React from 'react';

import { cn, cv, type VariantProps } from '@/utils';

const spacerVariants = cv('', {
  variants: {
    size: {
      xs: 'h-1 w-1',
      sm: 'h-2 w-2',
      md: 'h-4 w-4',
      lg: 'h-6 w-6',
      xl: 'h-8 w-8',
      px: 'w-px h-full',
      py: 'h-px w-full',
    },
    direction: {
      vertical: 'w-0',
      horizontal: 'h-0',
      square: '',
    },
  },
  defaultVariants: {
    size: 'md',
    direction: 'vertical',
  },
});

export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof spacerVariants> {}

export const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(({ className, size, direction, ...props }, ref) => {
  return <div ref={ref} aria-hidden className={cn(spacerVariants({ size, direction }), className)} {...props} />;
});
Spacer.displayName = 'Spacer';
