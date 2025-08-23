import React from 'react';

import { cn, cv, type VariantProps } from '@/utils';

const containerVariants = cv('mx-auto w-full', {
  variants: {
    maxWidth: {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      full: 'max-w-full',
    },
    pad: {
      none: '',
      sm: 'px-3',
      md: 'px-4',
      lg: 'px-6',
    },
  },
  defaultVariants: {
    maxWidth: 'lg',
    pad: 'md',
  },
});

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof containerVariants> {}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, maxWidth, pad, ...props }, ref) => {
    return <div ref={ref} className={cn(containerVariants({ maxWidth, pad }), className)} {...props} />;
  },
);
Container.displayName = 'Container';
