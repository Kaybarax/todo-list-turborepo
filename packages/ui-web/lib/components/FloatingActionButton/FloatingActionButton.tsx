import React from 'react';
import { cn } from '@todo/utils/ui/web';

export interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // No custom props needed for now
}

const FloatingActionButton = React.forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'btn btn-circle btn-primary shadow-lg fixed bottom-8 right-8 z-40',
          'w-14 h-14',
          'focus:ring-2 focus:ring-primary',
          className,
        )}
        aria-label="Create new todo"
        {...props}
      >
        {children ?? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
          </svg>
        )}
      </button>
    );
  },
);

FloatingActionButton.displayName = 'FloatingActionButton';

export { FloatingActionButton };
