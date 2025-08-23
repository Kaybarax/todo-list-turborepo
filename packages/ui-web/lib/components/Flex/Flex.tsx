import React from 'react';

import { cn, cv, type VariantProps } from '@/utils';

const flexVariants = cv('flex', {
  variants: {
    direction: {
      row: 'flex-row',
      row_reverse: 'flex-row-reverse',
      column: 'flex-col',
      column_reverse: 'flex-col-reverse',
    },
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
      xl: 'gap-6',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    wrap: {
      nowrap: 'flex-nowrap',
      wrap: 'flex-wrap',
      wrap_reverse: 'flex-wrap-reverse',
    },
  },
  defaultVariants: {
    direction: 'row',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
    wrap: 'nowrap',
  },
});

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof flexVariants> {}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, direction, gap, align, justify, wrap, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(flexVariants({ direction, gap, align, justify, wrap }), className)} {...props} />
    );
  },
);
Flex.displayName = 'Flex';
