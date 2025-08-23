import React from 'react';

import { cn, cv, type VariantProps } from '@todo/utils/ui/web';

const tooltipVariants = cv('tooltip', {
  variants: {
    placement: {
      top: 'tooltip-top',
      right: 'tooltip-right',
      bottom: 'tooltip-bottom',
      left: 'tooltip-left',
    },
    color: {
      neutral: '',
      primary: 'tooltip-primary',
      secondary: 'tooltip-secondary',
      accent: 'tooltip-accent',
      info: 'tooltip-info',
      success: 'tooltip-success',
      warning: 'tooltip-warning',
      error: 'tooltip-error',
    },
  },
  defaultVariants: { placement: 'top', color: 'neutral' },
});

export interface TooltipProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'color' | 'content'>,
    VariantProps<typeof tooltipVariants> {
  content: React.ReactNode;
  children: React.ReactElement;
  id?: string;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, placement, color, content, children, id, ...props }, ref) => {
    const tooltipId = id || React.useId();

    // Clone child to add aria-describedby
    const child = React.cloneElement(children, {
      'aria-describedby': tooltipId,
    } as any);

    return (
      <div className={cn(tooltipVariants({ placement, color }), className)} {...props} ref={ref}>
        <div role="tooltip" id={tooltipId} className="tooltip-content" aria-hidden={false}>
          {content}
        </div>
        {child}
      </div>
    );
  },
);
Tooltip.displayName = 'Tooltip';
