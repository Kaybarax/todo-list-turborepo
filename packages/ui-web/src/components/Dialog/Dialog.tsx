import React from 'react';
import { Modal } from 'flowbite-react';
import { cn } from '../../utils';

// Wrapper around Flowbite Modal
export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  return (
    <Modal show={open} onClose={() => onOpenChange?.(false)}>
      {children}
    </Modal>
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
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left p-6 pb-0', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 border-t', className)}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <h3 className={cn('text-lg font-semibold leading-none tracking-tight', className)}>{children}</h3>
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
