import React from 'react';

import { cn, cv, type VariantProps } from '../../utils';

const listVariants = cv('list', {
  variants: {
    variant: {
      unordered: 'list-disc',
      ordered: 'list-decimal',
      none: 'list-none',
    },
    spacing: {
      none: 'space-y-0',
      sm: 'space-y-1',
      md: 'space-y-2',
      lg: 'space-y-3',
    },
  },
  defaultVariants: { variant: 'unordered', spacing: 'md' },
});

export interface ListProps extends React.HTMLAttributes<HTMLUListElement>, VariantProps<typeof listVariants> {
  items: React.ReactNode[];
  as?: 'ul' | 'ol';
}

export const List = React.forwardRef<HTMLUListElement, ListProps>(
  ({ className, items, as = 'ul', variant, spacing, ...props }, ref) => {
    const Comp: any = as;
    return (
      <Comp ref={ref} className={cn(listVariants({ variant, spacing }), className)} {...props}>
        {items.map((it, i) => (
          <li key={i} className="ml-6">
            {it}
          </li>
        ))}
      </Comp>
    );
  },
);
List.displayName = 'List';
