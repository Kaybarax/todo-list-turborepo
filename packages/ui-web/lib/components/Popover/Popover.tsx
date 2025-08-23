import React from 'react';

import { cn } from '@/utils';

export interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  titleId?: string;
  content: React.ReactNode;
  children: React.ReactElement; // trigger
}

export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  ({ className, open, defaultOpen, onOpenChange, titleId, content, children, ...props }, ref) => {
    const isControlled = open !== undefined;
    const [internalOpen, setInternalOpen] = React.useState(!!defaultOpen);
    const actualOpen = isControlled ? (open as boolean) : internalOpen;

    const wrapperRef = React.useRef<HTMLDivElement | null>(null);
    const panelRef = React.useRef<HTMLDivElement | null>(null);

    const setOpen = (v: boolean) => {
      if (!isControlled) setInternalOpen(v);
      onOpenChange?.(v);
    };

    React.useEffect(() => {
      if (!actualOpen) return;
      const onDocKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
      };
      const onClickOutside = (e: MouseEvent) => {
        if (!wrapperRef.current) return;
        if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
      };
      document.addEventListener('keydown', onDocKey);
      document.addEventListener('mousedown', onClickOutside);
      return () => {
        document.removeEventListener('keydown', onDocKey);
        document.removeEventListener('mousedown', onClickOutside);
      };
    }, [actualOpen]);

    const trigger = React.cloneElement(children, {
      'aria-haspopup': 'dialog',
      'aria-expanded': actualOpen,
      onClick: (e: React.MouseEvent) => {
        children.props.onClick?.(e);
        setOpen(!actualOpen);
      },
    });

    const dialogId = React.useId();

    return (
      <div ref={wrapperRef} className={cn('relative inline-block', className)} {...props}>
        {trigger}
        <div
          ref={panelRef}
          role="dialog"
          aria-modal={false}
          aria-labelledby={titleId}
          id={dialogId}
          hidden={!actualOpen}
          className={cn('absolute z-50 mt-2 w-64 rounded-md bg-base-100 p-3 shadow-lg border border-base-300')}
        >
          {content}
        </div>
      </div>
    );
  },
);
Popover.displayName = 'Popover';
