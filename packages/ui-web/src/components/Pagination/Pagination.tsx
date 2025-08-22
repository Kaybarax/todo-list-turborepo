import React from 'react';

import { cn, cv, type VariantProps } from '../../utils';

const paginationVariants = cv('inline-flex items-center gap-1', {
  variants: {
    size: {
      sm: '[&_.btn]:btn-xs',
      md: '[&_.btn]:btn-sm',
      lg: '[&_.btn]:btn-md',
    },
  },
  defaultVariants: { size: 'md' },
});

export interface PaginationProps extends React.HTMLAttributes<NavElement>, VariantProps<typeof paginationVariants> {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  showEdges?: boolean;
}

type NavElement = HTMLElement & HTMLDivElement; // using nav semantics via role

export const Pagination = React.forwardRef<NavElement, PaginationProps>(
  ({ className, size, currentPage, totalPages, onPageChange, showEdges = true, ...props }, ref) => {
    const go = (p: number) => onPageChange?.(Math.min(totalPages, Math.max(1, p)));
    const canPrev = currentPage > 1;
    const canNext = currentPage < totalPages;

    const pages: (number | 'ellipsis')[] = [];
    const push = (v: number | 'ellipsis') => pages.push(v);

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) push(i);
    } else {
      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages, currentPage + 1);
      if (showEdges) {
        push(1);
        if (start > 2) push('ellipsis');
      }
      for (let i = start; i <= end; i++) push(i);
      if (showEdges) {
        if (end < totalPages - 1) push('ellipsis');
        push(totalPages);
      }
    }

    return (
      <nav
        ref={ref as any}
        aria-label="Pagination"
        role="navigation"
        className={cn(paginationVariants({ size }), className)}
        {...props}
      >
        <button
          type="button"
          className="btn"
          onClick={() => canPrev && go(currentPage - 1)}
          aria-label="Previous Page"
          disabled={!canPrev}
        >
          «
        </button>
        {pages.map((p, idx) =>
          p === 'ellipsis' ? (
            <span key={`e-${idx}`} className="px-2 opacity-60" aria-hidden>
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              className={cn('btn', p === currentPage && 'btn-active')}
              aria-current={p === currentPage ? 'page' : undefined}
              aria-label={`Page ${p}`}
              onClick={() => go(p)}
            >
              {p}
            </button>
          ),
        )}
        <button
          type="button"
          className="btn"
          onClick={() => canNext && go(currentPage + 1)}
          aria-label="Next Page"
          disabled={!canNext}
        >
          »
        </button>
      </nav>
    );
  },
);
Pagination.displayName = 'Pagination';
