import { cn, cv, cvm } from '../cva';

describe('cva utilities', () => {
  describe('cn', () => {
    it('should combine class names', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional');
    });

    it('should merge Tailwind classes', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2');
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('should handle arrays and objects', () => {
      expect(cn(['class1', 'class2'], { class3: true, class4: false })).toBe('class1 class2 class3');
    });

    it('should handle undefined and null values', () => {
      expect(cn('base', undefined, null, 'end')).toBe('base end');
    });

    it('should handle empty inputs', () => {
      expect(cn()).toBe('');
      expect(cn('')).toBe('');
    });
  });

  describe('cv', () => {
    it('should create class variance authority function', () => {
      const buttonVariants = cv('btn', {
        variants: {
          variant: {
            primary: 'btn-primary',
            secondary: 'btn-secondary',
          },
          size: {
            sm: 'btn-sm',
            lg: 'btn-lg',
          },
        },
        defaultVariants: {
          variant: 'primary',
          size: 'sm',
        },
      });

      expect(buttonVariants()).toBe('btn btn-primary btn-sm');
      expect(buttonVariants({ variant: 'secondary' })).toBe('btn btn-secondary btn-sm');
      expect(buttonVariants({ size: 'lg' })).toBe('btn btn-primary btn-lg');
      expect(buttonVariants({ variant: 'secondary', size: 'lg' })).toBe('btn btn-secondary btn-lg');
    });
  });

  describe('cvm', () => {
    it('should merge cva output with className', () => {
      const buttonVariants = cv('btn', {
        variants: {
          variant: {
            primary: 'btn-primary',
            secondary: 'btn-secondary',
          },
        },
        defaultVariants: {
          variant: 'primary',
        },
      });

      expect(cvm(buttonVariants, {}, 'custom-class')).toBe('btn btn-primary custom-class');
      expect(cvm(buttonVariants, { variant: 'secondary' }, 'custom-class')).toBe('btn btn-secondary custom-class');
    });

    it('should handle undefined className', () => {
      const buttonVariants = cv('btn', {
        variants: {
          variant: {
            primary: 'btn-primary',
          },
        },
        defaultVariants: {
          variant: 'primary',
        },
      });

      expect(cvm(buttonVariants, {}, undefined)).toBe('btn btn-primary');
    });

    it('should merge conflicting Tailwind classes', () => {
      const buttonVariants = cv('btn p-4', {
        variants: {
          variant: {
            primary: 'btn-primary',
          },
        },
        defaultVariants: {
          variant: 'primary',
        },
      });

      expect(cvm(buttonVariants, {}, 'p-2')).toBe('btn btn-primary p-2');
    });
  });
});
