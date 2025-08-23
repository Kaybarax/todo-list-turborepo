import React from 'react';

import { cn, cv, type VariantProps } from '@todo/utils/ui/web';

const linkVariants = cv('link', {
  variants: {
    variant: {
      default: 'link-primary',
      secondary: 'link-secondary',
      neutral: 'link-neutral',
      success: 'text-success hover:text-success/90 underline-offset-4 hover:underline',
      error: 'text-error hover:text-error/90 underline-offset-4 hover:underline',
      subtle: 'text-base-content/70 hover:text-base-content underline-offset-4 hover:underline',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
    underline: {
      true: 'underline underline-offset-4',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    underline: false,
  },
});

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'color' | 'size'>,
    VariantProps<typeof linkVariants> {
  external?: boolean;
  disabled?: boolean;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, size, underline, external, disabled, href, children, ...props }, ref) => {
    const classes = cn(linkVariants({ variant, size, underline }), disabled && 'pointer-events-none opacity-60');

    if (disabled) {
      return (
        <span className={classes} aria-disabled="true">
          {children}
        </span>
      );
    }

    const rel = external ? cn('noopener', 'noreferrer') : props.rel;
    const target = external ? '_blank' : props.target;

    return (
      <a ref={ref} href={href} className={classes} rel={rel} target={target} {...props}>
        {children}
      </a>
    );
  },
);
Link.displayName = 'Link';
