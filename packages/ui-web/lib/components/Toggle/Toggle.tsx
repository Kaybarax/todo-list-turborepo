import React from 'react';

import { cn, cv, type VariantProps } from '@todo/utils/ui/web';

const toggleVariants = cv('btn', {
  variants: {
    variant: {
      default: 'btn-primary',
      secondary: 'btn-secondary',
      ghost: 'btn-ghost',
      outline: 'btn-outline',
    },
    size: {
      sm: 'btn-sm',
      md: 'btn-md',
      lg: 'btn-lg',
    },
    pressed: {
      true: '',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export interface ToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'size'>,
    VariantProps<typeof toggleVariants> {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, variant, size, pressed: pressedProp, onPressedChange, onClick, ...props }, ref) => {
    const [pressed, setPressed] = React.useState<boolean>(Boolean(pressedProp));

    React.useEffect(() => {
      if (typeof pressedProp === 'boolean') setPressed(pressedProp);
    }, [pressedProp]);

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = e => {
      if (pressedProp === undefined) setPressed(p => !p);
      onPressedChange?.(!pressed);
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        role="button"
        aria-pressed={pressed}
        data-state={pressed ? 'on' : 'off'}
        className={cn(toggleVariants({ variant, size, pressed }), className)}
        onClick={handleClick}
        {...props}
      />
    );
  },
);
Toggle.displayName = 'Toggle';
