import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { cn } from '../../utils';

const iconButtonVariants = cva(
  'relative inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden group aspect-square',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:from-blue-500 hover:to-blue-700 focus:ring-blue-500 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity',
        destructive:
          'bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:from-red-500 hover:to-red-700 focus:ring-red-500 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity',
        outline:
          'border-2 border-gray-300 bg-white text-gray-700 shadow-md hover:bg-gray-50 hover:border-gray-400 hover:shadow-lg focus:ring-gray-500 hover:text-gray-900 backdrop-blur-sm',
        secondary:
          'bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 text-gray-800 shadow-md hover:shadow-lg hover:from-gray-200 hover:to-gray-400 focus:ring-gray-400 border border-gray-200',
        ghost:
          'text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:shadow-md focus:ring-gray-400',
        link: 'text-blue-600 hover:text-blue-800 focus:ring-blue-500 hover:bg-blue-50 rounded-lg',
      },
      size: {
        xs: 'h-8 w-8 p-1.5',
        sm: 'h-9 w-9 p-2',
        default: 'h-12 w-12 p-3',
        lg: 'h-14 w-14 p-3.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'size'>,
    VariantProps<typeof iconButtonVariants> {
  asChild?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, children, ...props }, ref) => {
    // Handle asChild by rendering a span wrapper if needed
    if (asChild) {
      return <span className={cn(iconButtonVariants({ variant, size }), className)}>{children}</span>;
    }

    return (
      <button ref={ref} className={cn(iconButtonVariants({ variant, size }), className)} {...props}>
        <span className="relative z-10 transition-transform duration-200 group-hover:scale-110">{children}</span>
      </button>
    );
  },
);
IconButton.displayName = 'IconButton';

export { IconButton, iconButtonVariants };
