import React from 'react';
import { cn, cv, type VariantProps } from '@todo/utils/ui/web';

const textVariants = cv('', {
  variants: {
    variant: {
      h1: 'text-4xl font-bold tracking-tight',
      h2: 'text-3xl font-semibold tracking-tight',
      h3: 'text-2xl font-semibold tracking-tight',
      h4: 'text-xl font-semibold tracking-tight',
      p: 'leading-7',
      blockquote: 'mt-6 border-l-2 pl-6 italic',
      list: 'my-6 ml-6 list-disc [&>li]:mt-2',
      lead: 'text-xl text-muted-foreground',
      large: 'text-lg font-semibold',
      small: 'text-sm font-medium leading-none',
      muted: 'text-sm text-muted-foreground',
    },
    variantColor: {
      primary: 'text-primary-content',
      secondary: 'text-secondary-content',
      accent: 'text-accent-content',
      neutral: 'text-neutral-content',
      info: 'text-info-content',
      success: 'text-success-content',
      warning: 'text-warning-content',
      error: 'text-error-content',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
});

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, 'color'>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, variant, variantColor, as: Component = 'p', ...props }, ref) => {
    return <Component className={cn(textVariants({ variant, variantColor }), className)} ref={ref} {...props} />;
  },
);
Text.displayName = 'Text';

export { Text, textVariants };
