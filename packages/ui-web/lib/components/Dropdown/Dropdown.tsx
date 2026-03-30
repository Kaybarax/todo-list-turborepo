import React from 'react';

import { cn } from '@todo/utils/ui/web';

export interface DropdownItem {
  id: string;
  label: React.ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  items: DropdownItem[];
  label?: React.ReactNode;
}

export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({ className, open, defaultOpen, onOpenChange, items, label = 'Menu', ...props }, _ref) => {
    const isControlled = open !== undefined;
    const [internalOpen, setInternalOpen] = React.useState(!!defaultOpen);
    const actualOpen = isControlled ? (open as boolean) : internalOpen;

    const wrapperRef = React.useRef<HTMLDivElement | null>(null);
    const menuRef = React.useRef<HTMLUListElement | null>(null);
    const buttonsRef = React.useRef<Array<HTMLButtonElement | null>>([]);
    const [activeIndex, setActiveIndex] = React.useState(0);

    const setOpen = (v: boolean) => {
      if (!isControlled) setInternalOpen(v);
      onOpenChange?.(v);
    };

    const focusItem = (idx: number) => {
      buttonsRef.current[idx]?.focus();
      setActiveIndex(idx);
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
      // focus first enabled item when opened
      const firstIdx = items.findIndex(it => !it.disabled);
      if (firstIdx >= 0) setTimeout(() => focusItem(firstIdx), 0);
      return () => {
        document.removeEventListener('keydown', onDocKey);
        document.removeEventListener('mousedown', onClickOutside);
      };
    }, [actualOpen, items]);

    const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
      }
    };

    const onMenuKeyDown = (e: React.KeyboardEvent) => {
      const count = items.length;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        let next = activeIndex;
        do {
          next = (next + 1) % count;
        } while (items[next]?.disabled && next !== activeIndex);
        focusItem(next);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        let prev = activeIndex;
        do {
          prev = (prev - 1 + count) % count;
        } while (items[prev]?.disabled && prev !== activeIndex);
        focusItem(prev);
      } else if (e.key === 'Home') {
        e.preventDefault();
        const firstIdx = items.findIndex(it => !it.disabled);
        if (firstIdx >= 0) focusItem(firstIdx);
      } else if (e.key === 'End') {
        e.preventDefault();
        const lastIdx = [...items].reverse().findIndex(it => !it.disabled);
        if (lastIdx >= 0) focusItem(count - 1 - lastIdx);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const it = items[activeIndex];
        if (it && !it.disabled) {
          it.onSelect?.();
          setOpen(false);
        }
      }
    };

    const menuId = React.useId();

    return (
      <div ref={wrapperRef} className={cn('dropdown', className)} {...props}>
        <button
          type="button"
          className="btn"
          aria-haspopup="menu"
          aria-expanded={actualOpen}
          aria-controls={menuId}
          onClick={() => setOpen(!actualOpen)}
          onKeyDown={onTriggerKeyDown}
        >
          {label}
        </button>
        <ul
          ref={menuRef}
          role="menu"
          id={menuId}
          hidden={!actualOpen}
          className={cn('menu menu-sm dropdown-content z-50 mt-2 w-52 rounded-box bg-base-100 p-2 shadow')}
          onKeyDown={onMenuKeyDown}
        >
          {items.map((it, i) => (
            <li key={it.id} role="none">
              <button
                ref={el => {
                  buttonsRef.current[i] = el;
                }}
                role="menuitem"
                type="button"
                className="w-full text-left"
                tabIndex={-1}
                aria-disabled={it.disabled || undefined}
                disabled={it.disabled}
                onClick={() => {
                  if (!it.disabled) {
                    it.onSelect?.();
                    setOpen(false);
                  }
                }}
              >
                {it.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  },
);
Dropdown.displayName = 'Dropdown';
