import React from 'react';

import { cn } from '@todo/utils/ui/web';

// Wrapper around Flowbite Modal
export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Optional id for heading element to link with aria-labelledby */
  titleId?: string;
  /** Size of the dialog content */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

const sizeClass: Record<NonNullable<DialogProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, titleId, size = 'md', children, className, ...rest }) => {
  const overlayRef = React.useRef<HTMLDivElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange?.(false);
    };
    document.addEventListener('keydown', onKey);
    // focus content when opened
    const t = setTimeout(() => contentRef.current?.focus(), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className={cn('modal modal-open', className)} {...rest}>
      <div
        ref={contentRef}
        className={cn('modal-box outline-none', sizeClass[size])}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => onOpenChange?.(false)}
          aria-label="Close"
        >
          ✕
        </button>
        {children}
      </div>
      <div ref={overlayRef} className="modal-backdrop" onClick={() => onOpenChange?.(false)} aria-hidden />
    </div>
  );
};

const DialogTrigger: React.FC<{ children: React.ReactNode; asChild?: boolean }> = ({ children }) => <>{children}</>;

const DialogPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

const DialogClose: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

const DialogOverlay: React.FC = () => null;

const DialogContent: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <div className={cn('p-6', className)}>{children}</div>
);

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 p-6 pb-0', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('modal-action flex flex-col-reverse sm:flex-row sm:justify-end border-t', className)} {...props} />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle: React.FC<{ className?: string; children: React.ReactNode; id?: string }> = ({
  className,
  children,
  id,
}) => (
  <h3 id={id} className={cn('text-lg font-semibold leading-none tracking-tight', className)}>
    {children}
  </h3>
);
DialogTitle.displayName = 'DialogTitle';

const DialogDescription: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <p className={cn('text-sm text-gray-600', className)}>{children}</p>
);
DialogDescription.displayName = 'DialogDescription';

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
