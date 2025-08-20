import React from 'react';

import { cn } from '../../utils';

// Wrapper around Flowbite Modal
export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => onOpenChange?.(false)}
        >
          ✕
        </button>
        {children}
      </div>
      <div className="modal-backdrop" onClick={() => onOpenChange?.(false)} />
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
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left p-6 pb-4', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('modal-action', className)} {...props} />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <h3 className={cn('text-xl font-bold', className)}>{children}</h3>
);
DialogTitle.displayName = 'DialogTitle';

const DialogDescription: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <p className={cn('text-sm opacity-70', className)}>{children}</p>
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
