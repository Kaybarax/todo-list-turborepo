import React from 'react';

import { cn } from '@todo/utils/ui/web';

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
  current?: boolean;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, items, separator = '/', ...props }, ref) => {
    return (
      <nav ref={ref} aria-label="Breadcrumb" className={cn('text-sm', className)} {...props}>
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            const content =
              item.href && !isLast && !item.current ? (
                <a href={item.href} className="link link-hover" aria-current={undefined}>
                  {item.label}
                </a>
              ) : (
                <span
                  aria-current={item.current || isLast ? 'page' : undefined}
                  className={cn(isLast ? 'font-semibold' : undefined)}
                >
                  {item.label}
                </span>
              );
            return (
              <li key={idx} className="inline-flex items-center gap-2">
                {content}
                {!isLast && (
                  <span className="opacity-60" aria-hidden>
                    {separator}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
);
Breadcrumb.displayName = 'Breadcrumb';
