import React from 'react';

import { cn, cv, type VariantProps } from '../../utils';

const gridVariants = cv('grid', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      7: 'grid-cols-7',
      8: 'grid-cols-8',
      9: 'grid-cols-9',
      10: 'grid-cols-10',
      11: 'grid-cols-11',
      12: 'grid-cols-12',
    },
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
      xl: 'gap-6',
    },
  },
  defaultVariants: {
    cols: 2,
    gap: 'md',
  },
});

export interface GridProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof gridVariants> {}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(({ className, cols, gap, ...props }, ref) => {
  return <div ref={ref} className={cn(gridVariants({ cols, gap }), className)} {...props} />;
});
Grid.displayName = 'Grid';
