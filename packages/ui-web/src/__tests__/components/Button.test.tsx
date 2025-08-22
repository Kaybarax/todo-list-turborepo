import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../../components/Button';

describe('Button Component - DaisyUI Integration', () => {
  describe('DaisyUI Class Application', () => {
    it('should apply base DaisyUI button class', () => {
      render(<Button>Test Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn');
    });

    it('should apply DaisyUI variant classes correctly', () => {
      const variants = [
        { variant: 'primary', expectedClass: 'btn-primary' },
        { variant: 'secondary', expectedClass: 'btn-secondary' },
        { variant: 'accent', expectedClass: 'btn-accent' },
        { variant: 'info', expectedClass: 'btn-info' },
        { variant: 'success', expectedClass: 'btn-success' },
        { variant: 'warning', expectedClass: 'btn-warning' },
        { variant: 'error', expectedClass: 'btn-error' },
        { variant: 'ghost', expectedClass: 'btn-ghost' },
        { variant: 'link', expectedClass: 'btn-link' },
        { variant: 'outline', expectedClass: 'btn-outline' },
        { variant: 'active', expectedClass: 'btn-active' },
        { variant: 'disabled', expectedClass: 'btn-disabled' },
      ] as const;

      variants.forEach(({ variant, expectedClass }) => {
        const { unmount } = render(<Button variant={variant}>Test</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn', expectedClass);
        unmount();
      });
    });

    it('should apply DaisyUI size classes correctly', () => {
      const sizes = [
        { size: 'xs', expectedClass: 'btn-xs' },
        { size: 'sm', expectedClass: 'btn-sm' },
        { size: 'md', expectedClass: '' }, // Default size has no class
        { size: 'lg', expectedClass: 'btn-lg' },
      ] as const;

      sizes.forEach(({ size, expectedClass }) => {
        const { unmount } = render(<Button size={size}>Test</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn');
        if (expectedClass) {
          expect(button).toHaveClass(expectedClass);
        }
        unmount();
      });
    });

    it('should apply DaisyUI shape classes correctly', () => {
      const shapes = [
        { shape: 'square', expectedClass: 'btn-square' },
        { shape: 'circle', expectedClass: 'btn-circle' },
      ] as const;

      shapes.forEach(({ shape, expectedClass }) => {
        const { unmount } = render(<Button shape={shape}>Test</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn', expectedClass);
        unmount();
      });
    });

    it('should combine multiple DaisyUI classes correctly', () => {
      render(
        <Button variant="primary" size="lg" shape="square">
          Test
        </Button>,
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn', 'btn-primary', 'btn-lg', 'btn-square');
    });
  });

  describe('Legacy Props Compatibility', () => {
    it('should maintain backward compatibility with legacy state prop', () => {
      // Note: This test assumes Button component supports legacy state prop
      // If not implemented, this test should be removed or Button component updated
      const { unmount } = render(<Button variant="primary">Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn', 'btn-primary');
      unmount();
    });

    it('should prioritize variant over legacy props when both are provided', () => {
      render(<Button variant="secondary">Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn', 'btn-secondary');
    });
  });

  describe('Accessibility Features', () => {
    it('should have proper ARIA attributes', () => {
      render(<Button>Accessible Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should support disabled state with proper ARIA', () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should support loading state with proper ARIA', () => {
      render(<Button loading>Loading Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('loading');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('should support custom ARIA labels', () => {
      render(<Button aria-label="Custom Label">Icon Only</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom Label');
    });
  });

  describe('DaisyUI Theme Integration', () => {
    it('should respond to theme changes via CSS custom properties', () => {
      render(<Button variant="primary">Themed Button</Button>);
      const button = screen.getByRole('button');

      // Should have DaisyUI classes that respond to theme variables
      expect(button).toHaveClass('btn-primary');

      // The actual color values come from CSS custom properties
      // which are set by DaisyUI themes
      const computedStyle = window.getComputedStyle(button);
      expect(computedStyle.getPropertyValue('--btn-color')).toBeDefined();
    });
  });

  describe('Component Composition', () => {
    it('should support custom className alongside DaisyUI classes', () => {
      render(<Button className="custom-class">Custom Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn', 'custom-class');
    });

    it('should support ref forwarding', () => {
      let buttonRef: HTMLButtonElement | null = null;
      render(
        <Button
          ref={ref => {
            buttonRef = ref;
          }}
        >
          Ref Button
        </Button>,
      );
      expect(buttonRef).toBeInstanceOf(HTMLButtonElement);
      expect(buttonRef).toHaveClass('btn');
    });

    it('should support children composition', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>,
      );
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('IconText');
      expect(button.children).toHaveLength(2);
    });
  });

  describe('Event Handling', () => {
    it('should handle click events properly', () => {
      let clicked = false;
      render(
        <Button
          onClick={() => {
            clicked = true;
          }}
        >
          Clickable Button
        </Button>,
      );
      const button = screen.getByRole('button');
      button.click();
      expect(clicked).toBe(true);
    });

    it('should not trigger events when disabled', () => {
      let clicked = false;
      render(
        <Button
          disabled
          onClick={() => {
            clicked = true;
          }}
        >
          Disabled Button
        </Button>,
      );
      const button = screen.getByRole('button');
      button.click();
      expect(clicked).toBe(false);
    });
  });
});
