import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground border-border',
        success: 
          'border-transparent bg-green-500 text-white hover:bg-green-500/80',
        warning:
          'border-transparent bg-yellow-500 text-white hover:bg-yellow-500/80',
        info:
          'border-transparent bg-blue-500 text-white hover:bg-blue-500/80',
        ghost:
          'border-transparent bg-transparent text-foreground hover:bg-accent',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
      shape: {
        default: 'rounded-full',
        square: 'rounded-md',
        pill: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      shape: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ 
    className, 
    variant, 
    size,
    shape,
    asChild = false,
    icon, 
    closable = false,
    onClose,
    dot = false,
    children, 
    ...props 
  }, ref) => {

    
    const handleClose = (e: React.MouseEvent) => {
      e.stopPropagation();
      onClose?.();
    };

    if (asChild) {
      return (
        <Slot 
          className={cn(badgeVariants({ variant, size, shape }), className)} 
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <div 
        className={cn(badgeVariants({ variant, size, shape }), className)} 
        ref={ref}
        {...props}
      >
        {dot && (
          <span 
            className={cn(
              'mr-1.5 h-2 w-2 rounded-full',
              variant === 'outline' ? 'bg-current' : 'bg-current opacity-75'
            )}
            aria-hidden="true"
          />
        )}
        {!dot && icon && (
          <span className="mr-1.5 flex items-center" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="truncate">{children}</span>
        {closable && (
          <button
            type="button"
            className={cn(
              'ml-1.5 flex items-center justify-center rounded-full hover:bg-black/10 focus:outline-none focus:ring-1 focus:ring-current',
              'h-4 w-4 transition-colors'
            )}
            onClick={handleClose}
            aria-label="Remove badge"
          >
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };