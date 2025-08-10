import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock external dependencies with inline implementations
vi.mock('clsx', () => ({
  clsx: (...args: any[]) => {
    const processArg = (arg: any): string => {
      if (!arg) return '';
      if (typeof arg === 'string') return arg;
      if (Array.isArray(arg)) {
        return arg.map(processArg).filter(Boolean).join(' ');
      }
      if (typeof arg === 'object' && arg !== null) {
        return Object.keys(arg)
          .filter(key => arg[key])
          .join(' ');
      }
      return '';
    };
    
    return args
      .map(processArg)
      .filter(Boolean)
      .join(' ')
      .trim();
  },
  default: (...args: any[]) => {
    const processArg = (arg: any): string => {
      if (!arg) return '';
      if (typeof arg === 'string') return arg;
      if (Array.isArray(arg)) {
        return arg.map(processArg).filter(Boolean).join(' ');
      }
      if (typeof arg === 'object' && arg !== null) {
        return Object.keys(arg)
          .filter(key => arg[key])
          .join(' ');
      }
      return '';
    };
    
    return args
      .map(processArg)
      .filter(Boolean)
      .join(' ')
      .trim();
  }
}));

vi.mock('tailwind-merge', () => ({
  twMerge: (classString: string) => {
    // Simple mock that removes duplicate classes and handles basic conflicts
    const classes = classString.split(' ').filter(Boolean);
    const result: string[] = [];
    const seen = new Set<string>();
    
    // Process classes in reverse to keep the last occurrence
    for (let i = classes.length - 1; i >= 0; i--) {
      const cls = classes[i];
      
      // Simple conflict resolution for common patterns
      const parts = cls.split('-');
      const baseClass = parts[0];
      let conflictKey = cls;
      
      // Handle specific conflict patterns
      if (['p', 'px', 'py', 'pt', 'pb', 'pl', 'pr'].includes(baseClass)) {
        conflictKey = baseClass; // padding conflicts
      } else if (['m', 'mx', 'my', 'mt', 'mb', 'ml', 'mr'].includes(baseClass)) {
        conflictKey = baseClass; // margin conflicts
      } else if (baseClass === 'text' && parts.length > 1) {
        // text-size vs text-color - only size conflicts with size
        if (['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'].includes(parts[1])) {
          conflictKey = 'text-size';
        } else {
          conflictKey = cls; // colors and other text properties don't conflict
        }
      }
      
      if (!seen.has(conflictKey)) {
        seen.add(conflictKey);
        result.unshift(cls);
      }
    }
    
    return result.join(' ');
  },
  default: (classString: string) => {
    // Simple mock that removes duplicate classes and handles basic conflicts
    const classes = classString.split(' ').filter(Boolean);
    const result: string[] = [];
    const seen = new Set<string>();
    
    // Process classes in reverse to keep the last occurrence
    for (let i = classes.length - 1; i >= 0; i--) {
      const cls = classes[i];
      
      // Simple conflict resolution for common patterns
      const parts = cls.split('-');
      const baseClass = parts[0];
      let conflictKey = cls;
      
      // Handle specific conflict patterns
      if (['p', 'px', 'py', 'pt', 'pb', 'pl', 'pr'].includes(baseClass)) {
        conflictKey = baseClass; // padding conflicts
      } else if (['m', 'mx', 'my', 'mt', 'mb', 'ml', 'mr'].includes(baseClass)) {
        conflictKey = baseClass; // margin conflicts
      } else if (baseClass === 'text' && parts.length > 1) {
        // text-size vs text-color - only size conflicts with size
        if (['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'].includes(parts[1])) {
          conflictKey = 'text-size';
        } else {
          conflictKey = cls; // colors and other text properties don't conflict
        }
      }
      
      if (!seen.has(conflictKey)) {
        seen.add(conflictKey);
        result.unshift(cls);
      }
    }
    
    return result.join(' ');
  }
}));

vi.mock('class-variance-authority', () => ({
  cva: (base: string, options?: any) => {
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
  }
}));

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  root = null;
  rootMargin = '';
  thresholds = [];
  
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() { return []; }
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};