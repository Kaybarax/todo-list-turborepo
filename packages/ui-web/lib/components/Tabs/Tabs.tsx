import React from 'react';

import { cn, cv, type VariantProps } from '@todo/utils/ui/web';

const tabsVariants = cv('flex', {
  variants: {
    orientation: {
      horizontal: 'flex-col',
      vertical: 'flex-row',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});

const tabListVariants = cv('tabs tabs-bordered', {
  variants: {
    orientation: {
      horizontal: 'tabs-horizontal',
      vertical: 'tabs-vertical mr-4',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});

export interface TabItem {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof tabsVariants>,
    VariantProps<typeof tabListVariants> {
  items: TabItem[];
  defaultIndex?: number;
  index?: number;
  onChange?: (index: number) => void;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, orientation = 'horizontal', items, defaultIndex = 0, index, onChange, ...props }, ref) => {
    const isControlled = index !== undefined;
    const [internalIndex, setInternalIndex] = React.useState(defaultIndex);
    const activeIndex = isControlled ? (index as number) : internalIndex;

    const tabsRef = React.useRef<Array<HTMLButtonElement | null>>([]);

    const setIndex = (i: number) => {
      if (!isControlled) setInternalIndex(i);
      onChange?.(i);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
      const count = items.length;
      const dir = orientation === 'vertical' ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'];
      let next = activeIndex;
      if (e.key === dir[0]) {
        e.preventDefault();
        next = (activeIndex - 1 + count) % count;
      } else if (e.key === dir[1]) {
        e.preventDefault();
        next = (activeIndex + 1) % count;
      } else if (e.key === 'Home') {
        e.preventDefault();
        next = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        next = count - 1;
      }
      if (next !== activeIndex) {
        setIndex(next);
        tabsRef.current[next]?.focus();
      }
    };

    return (
      <div ref={ref} className={cn(tabsVariants({ orientation }), className)} {...props}>
        <div
          // role="tablist" // TODO: go figure
          // aria-orientation={orientation || undefined} // TODO: go figure
          className={cn(tabListVariants({ orientation }))}
          onKeyDown={onKeyDown}
        >
          {items.map((it, i) => {
            const selected = i === activeIndex;
            const panelId = `${it.id}-panel`;
            const tabId = `${it.id}-tab`;
            return (
              <button
                key={it.id}
                ref={el => {
                  tabsRef.current[i] = el;
                }}
                // role="tab" // TODO: go figure
                id={tabId}
                // aria-selected={selected} // TODO: go figure
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                disabled={it.disabled}
                className={cn('tab', selected && 'tab-active')}
                onClick={() => setIndex(i)}
                type="button"
              >
                {it.label}
              </button>
            );
          })}
        </div>
        {items.map((it, i) => {
          const selected = i === activeIndex;
          const panelId = `${it.id}-panel`;
          const tabId = `${it.id}-tab`;
          return (
            <div
              key={panelId}
              role="tabpanel"
              id={panelId}
              aria-labelledby={tabId}
              hidden={!selected}
              className={cn('mt-3', orientation === 'vertical' && 'mt-0 ml-4 flex-1')}
            >
              {selected ? it.content : null}
            </div>
          );
        })}
      </div>
    );
  },
);
Tabs.displayName = 'Tabs';
