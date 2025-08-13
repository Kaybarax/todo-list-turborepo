// Mock for class-variance-authority
export const cva = (base: string, options?: any) => {
  return (props?: any) => {
    let classes = base;

    if (options?.variants && props) {
      Object.keys(props).forEach(key => {
        if (options.variants[key] && options.variants[key][props[key]]) {
          classes += ' ' + options.variants[key][props[key]];
        }
      });
    }

    if (options?.defaultVariants) {
      Object.keys(options.defaultVariants).forEach(key => {
        if (!props || props[key] === undefined) {
          const defaultValue = options.defaultVariants[key];
          if (options.variants[key] && options.variants[key][defaultValue]) {
            classes += ' ' + options.variants[key][defaultValue];
          }
        }
      });
    }

    return classes;
  };
};

export type VariantProps<T> = T extends (...args: any[]) => any ? Parameters<T>[0] : never;
