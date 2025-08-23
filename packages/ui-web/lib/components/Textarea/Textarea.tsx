import React from 'react';

import { cn, cv, type VariantProps } from '@todo/utils/ui/web';

const textareaVariants = cv('textarea textarea-bordered w-full', {
  variants: {
    size: {
      xs: 'textarea-xs',
      sm: 'textarea-sm',
      md: 'textarea-md',
      lg: 'textarea-lg',
      xl: 'textarea-lg text-lg',
    },
    state: {
      default: '',
      primary: 'textarea-primary',
      secondary: 'textarea-secondary',
      accent: 'textarea-accent',
      info: 'textarea-info',
      success: 'textarea-success',
      warning: 'textarea-warning',
      error: 'textarea-error',
    },
    variant: {
      bordered: 'textarea-bordered',
      ghost: 'textarea-ghost',
    },
  },
  defaultVariants: {
    size: 'md',
    state: 'default',
    variant: 'bordered',
  },
});

export type TextareaSize = NonNullable<VariantProps<typeof textareaVariants>['size']>;
export type TextareaState = NonNullable<VariantProps<typeof textareaVariants>['state']>;

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'color'>,
    Partial<Pick<VariantProps<typeof textareaVariants>, 'size' | 'state' | 'variant'>> {
  error?: boolean; // legacy, maps to state="error"
  helperText?: string;
  autoResize?: boolean;
  showCount?: boolean;
  characterCountFormatter?: (count: number, maxLength?: number) => string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      error,
      helperText,
      autoResize = false,
      showCount = false,
      characterCountFormatter,
      size = 'md',
      state = 'default',
      variant = 'bordered',
      id,
      onInput,
      value,
      defaultValue,
      maxLength,
      ...props
    },
    ref,
  ) => {
    const effectiveState: TextareaState = error ? 'error' : (state ?? 'default');
    const helperId = helperText ? `${id ?? 'textarea'}-help` : undefined;
    const innerRef = React.useRef<HTMLTextAreaElement | null>(null);
    const combinedRef = (node: HTMLTextAreaElement | null) => {
      innerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref && 'current' in ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
    };

    const [isFocused, setIsFocused] = React.useState(false);
    const [count, setCount] = React.useState(() => {
      const initial = (value ?? defaultValue ?? '') as string;
      return initial.length;
    });

    const classes = textareaVariants({ size, state: effectiveState, variant });

    const resize = React.useCallback(() => {
      if (!autoResize || !innerRef.current) return;
      const el = innerRef.current;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }, [autoResize]);

    React.useEffect(() => {
      resize();
    }, [resize, value]);

    const handleInput: React.FormEventHandler<HTMLTextAreaElement> = e => {
      if (showCount) setCount((e.currentTarget.value ?? '').length);
      if (autoResize) resize();
      onInput?.(e);
    };

    return (
      <div className="w-full space-y-1.5">
        <div
          className={cn(
            'relative w-full group',
            isFocused && 'transform scale-[1.01] transition-transform duration-200',
          )}
        >
          <textarea
            ref={combinedRef}
            id={id}
            className={cn(classes, className)}
            aria-invalid={effectiveState === 'error' ? true : undefined}
            aria-describedby={helperId}
            maxLength={maxLength}
            value={value as any}
            defaultValue={defaultValue as any}
            onInput={handleInput}
            onFocus={e => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={e => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />

          {/* Animated border gradient */}
          <div
            className={cn(
              'absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none',
              'bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 p-[2px]',
              isFocused && effectiveState !== 'error' && 'opacity-20',
            )}
          >
            <div className="w-full h-full bg-white rounded-[10px]" />
          </div>
        </div>

        <div className="flex items-start justify-between">
          {helperText && (
            <div className="label py-0">
              <span id={helperId} className={cn('label-text-alt', effectiveState === 'error' && 'text-error')}>
                {helperText}
              </span>
            </div>
          )}

          {showCount && (
            <div className="label py-0 ml-auto">
              <span className="label-text-alt">
                {characterCountFormatter
                  ? characterCountFormatter(count, maxLength)
                  : `${count}${maxLength ? ` / ${maxLength}` : ''}`}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
