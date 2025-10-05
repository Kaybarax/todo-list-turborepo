import React from 'react';

import { cn, cv, type VariantProps } from '@todo/utils/ui/web';
import { ariaAttr, mergeRefs } from '@todo/utils/ui/web/a11y';

export type ComboboxOption = { value: string; label: string };

const inputVariants = cv('input input-bordered w-full', {
  variants: {
    size: {
      xs: 'input-xs',
      sm: 'input-sm',
      md: 'input-md',
      lg: 'input-lg',
      xl: 'input-lg text-lg',
    },
    state: {
      default: '',
      success: 'input-success',
      error: 'input-error',
    },
  },
  defaultVariants: { size: 'md', state: 'default' },
});

export interface ComboboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'defaultValue' | 'onChange'>,
    Partial<Pick<VariantProps<typeof inputVariants>, 'size' | 'state'>> {
  options: ComboboxOption[];
  multiple?: boolean;
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  helperText?: string;
  listHeight?: number;
}

export const Combobox = React.forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      className,
      options,
      multiple,
      value,
      defaultValue,
      onChange,
      helperText,
      size = 'md',
      state = 'default',
      id,
      placeholder = 'Search…',
      listHeight = 200,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const [highlighted, setHighlighted] = React.useState(0);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const listRef = React.useRef<HTMLUListElement | null>(null);
    const combinedRef = mergeRefs(ref, inputRef);

    const controlled = value !== undefined;
    const [internal, setInternal] = React.useState<string | string[] | undefined>(defaultValue);

    const currentValue = (controlled ? value : internal) ?? (multiple ? [] : '');

    const isSelected = React.useCallback(
      (v: string) => {
        return Array.isArray(currentValue) ? currentValue.includes(v) : currentValue === v;
      },
      [currentValue],
    );

    const setValue = (next: string | string[]) => {
      if (!controlled) setInternal(next);
      onChange?.(next);
    };

    const filtered = React.useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return options;
      return options.filter(o => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q));
    }, [options, query]);

    React.useEffect(() => {
      if (highlighted >= filtered.length) setHighlighted(filtered.length - 1);
      if (highlighted < 0) setHighlighted(0);
    }, [filtered.length, highlighted]);

    const helperId = helperText ? `${id ?? 'combobox'}-help` : undefined;

    const selectAt = (index: number) => {
      const opt = filtered[index];
      if (!opt) return;
      if (multiple) {
        const next = Array.isArray(currentValue) ? [...currentValue] : [];
        const i = next.indexOf(opt.value);
        if (i >= 0) next.splice(i, 1);
        else next.push(opt.value);
        setValue(next);
      } else {
        setValue(opt.value);
        setOpen(false);
      }
    };

    const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = e => {
      if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        setOpen(true);
        e.preventDefault();
        return;
      }
      switch (e.key) {
        case 'ArrowDown':
          setHighlighted(h => Math.min(h + 1, filtered.length - 1));
          e.preventDefault();
          break;
        case 'ArrowUp':
          setHighlighted(h => Math.max(h - 1, 0));
          e.preventDefault();
          break;
        case 'Enter':
          if (open) {
            selectAt(highlighted);
            e.preventDefault();
          }
          break;
        case 'Escape':
          setOpen(false);
          break;
        default:
          break;
      }
    };

    const onInput: React.ChangeEventHandler<HTMLInputElement> = e => {
      setQuery(e.target.value);
      if (!open) setOpen(true);
      props.onInput?.(e as any);
    };

    const displayValue = React.useMemo(() => {
      if (multiple) return '';
      if (typeof currentValue === 'string') {
        const found = options.find(o => o.value === currentValue);
        return found?.label ?? '';
      }
      return '';
    }, [currentValue, multiple, options]);

    const classes = inputVariants({ size, state });

    return (
      <div className="w-full space-y-1.5">
        <div className="relative w-full">
          <input
            ref={combinedRef}
            id={id}
            // role="combobox" // TODO: go figure
            aria-autocomplete="list"
            // aria-expanded={ariaAttr(open)} // TODO: go figure
            aria-controls={id ? `${id}-listbox` : undefined}
            aria-activedescendant={open && filtered[highlighted] ? `${id ?? 'combobox'}-opt-${highlighted}` : undefined}
            aria-describedby={helperId}
            placeholder={placeholder}
            value={displayValue || query}
            onChange={onInput}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            className={cn(classes, className)}
            autoComplete="off"
            {...props}
          />

          {/* Listbox */}
          {open && (
            <ul
              ref={listRef}
              id={id ? `${id}-listbox` : undefined}
              // role="listbox" // TODO: go figure
              className="menu bg-base-100 w-full shadow rounded-box mt-1 max-h-[--cbx-h] overflow-auto"
              style={{ ['--cbx-h' as any]: `${listHeight}px` }}
            >
              {filtered.length === 0 && <li className="menu-title px-3 py-2 opacity-60">No results</li>}
              {filtered.map((opt, i) => (
                <li key={opt.value}>
                  <button
                    id={`${id ?? 'combobox'}-opt-${i}`}
                    type="button"
                    // role="option" // TODO: go figure
                    // aria-selected={ariaAttr(isSelected(opt.value))} // TODO: go figure
                    className={cn(
                      'w-full text-left px-3 py-2',
                      i === highlighted && 'bg-base-200',
                      isSelected(opt.value) && 'font-medium',
                    )}
                    onMouseEnter={() => setHighlighted(i)}
                    onClick={() => selectAt(i)}
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {helperText && (
          <div className="label py-0">
            <span id={helperId} className={cn('label-text-alt', state === 'error' && 'text-error')}>
              {helperText}
            </span>
          </div>
        )}
      </div>
    );
  },
);

Combobox.displayName = 'Combobox';
