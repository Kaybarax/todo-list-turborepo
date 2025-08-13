import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils';

const cardVariants = cva('rounded-lg border bg-card text-card-foreground shadow-sm', {
  variants: {
    variant: {
      default: 'border-border',
      outline: 'border-2 border-border',
      elevated: 'shadow-md border-0',
      ghost: 'border-0 shadow-none bg-transparent',
    },
    size: {
      default: '',
      sm: 'text-sm',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';

    return <Comp ref={ref} className={cn(cardVariants({ variant, size, className }))} {...props} />;
  },
);
Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';

    return <Comp ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />;
  },
);
CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  asChild?: boolean;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, asChild = false, level = 3, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot ref={ref} className={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...props} />
      );
    }

    const headingProps = {
      ref,
      className: cn('text-2xl font-semibold leading-none tracking-tight', className),
      ...props,
    };

    switch (level) {
      case 1:
        return <h1 {...headingProps} />;
      case 2:
        return <h2 {...headingProps} />;
      case 3:
        return <h3 {...headingProps} />;
      case 4:
        return <h4 {...headingProps} />;
      case 5:
        return <h5 {...headingProps} />;
      case 6:
        return <h6 {...headingProps} />;
      default:
        return <h3 {...headingProps} />;
    }
  },
);
CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  asChild?: boolean;
}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'p';

    return <Comp ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />;
  },
);
CardDescription.displayName = 'CardDescription';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';

    return <Comp ref={ref} className={cn('p-6 pt-0', className)} {...props} />;
  },
);
CardContent.displayName = 'CardContent';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';

    return <Comp ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />;
  },
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };
