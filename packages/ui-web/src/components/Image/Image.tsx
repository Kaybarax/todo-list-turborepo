import React from 'react';

import { cn, cv, type VariantProps } from '../../utils';

const imageVariants = cv('', {
  variants: {
    fit: {
      cover: 'object-cover',
      contain: 'object-contain',
      fill: 'object-fill',
      none: 'object-none',
      scaleDown: 'object-scale-down',
    },
    rounded: {
      none: 'rounded-none',
      sm: 'rounded',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    },
  },
  defaultVariants: { fit: 'cover', rounded: 'md' },
});

export interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'>,
    VariantProps<typeof imageVariants> {
  fallback?: React.ReactNode;
  showLoading?: boolean;
}

export const Image = React.forwardRef<HTMLDivElement, ImageProps>(
  ({ className, src, alt, fallback, fit, rounded, showLoading = true, ...imgProps }, ref) => {
    const [loaded, setLoaded] = React.useState(false);
    const [errored, setErrored] = React.useState(false);

    return (
      <div ref={ref} className={cn('relative inline-block overflow-hidden', imageVariants({ rounded }), className)}>
        {!errored && src ? (
          // eslint-disable-next-line jsx-a11y/alt-text
          <img
            {...imgProps}
            src={src}
            alt={alt}
            className={cn('w-full h-full', imageVariants({ fit }))}
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
          />
        ) : (
          <div role="img" aria-label={alt} className={cn('flex items-center justify-center w-full h-full bg-base-200')}>
            {fallback ?? (
              <span className="text-sm text-base-content/70" aria-hidden>
                Image unavailable
              </span>
            )}
          </div>
        )}

        {showLoading && !loaded && !errored && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-base-100/40 backdrop-blur-sm"
            aria-hidden
          >
            <span className="loading loading-spinner loading-sm" />
          </div>
        )}
      </div>
    );
  },
);
Image.displayName = 'Image';
