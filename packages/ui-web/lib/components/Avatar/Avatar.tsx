import React from 'react';

import { cn, cv, type VariantProps } from '@todo/utils/ui/web';

const avatarVariants = cv('avatar', {
  variants: {
    size: {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
      xl: 'w-24 h-24',
    },
    shape: {
      round: 'rounded-full',
      square: 'rounded-md',
    },
  },
  defaultVariants: { size: 'md', shape: 'round' },
});

export interface AvatarProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'size'>,
    VariantProps<typeof avatarVariants> {
  fallback?: React.ReactNode;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size, shape, children, ...imgProps }, ref) => {
    const [errored, setErrored] = React.useState(false);

    const showFallback = errored || !src;

    return (
      <div ref={ref} className={cn(avatarVariants({ size, shape }), 'inline-block', className)}>
        <div className={cn('w-full h-full overflow-hidden', shape === 'round' ? 'rounded-full' : 'rounded-md')}>
          {!showFallback ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <img
              {...imgProps}
              src={src}
              alt={alt}
              className="w-full h-full object-cover"
              onLoad={() => {}}
              onError={() => setErrored(true)}
            />
          ) : (
            <div
              role="img"
              aria-label={alt}
              className={cn(
                'flex h-full w-full items-center justify-center bg-base-200 text-base-content/70',
                shape === 'round' ? 'rounded-full' : 'rounded-md',
              )}
            >
              {fallback ?? (
                <span className="text-sm font-medium" aria-hidden>
                  {typeof children === 'string' ? children.slice(0, 2).toUpperCase() : '👤'}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);
Avatar.displayName = 'Avatar';
