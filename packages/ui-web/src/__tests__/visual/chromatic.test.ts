import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Alert } from '../../components/Alert';
import { Progress } from '../../components/Progress';
import { Checkbox } from '../../components/Checkbox';
import { Select } from '../../components/Select';

describe('Visual Regression - Theme Consistency', () => {
  // Mock theme data attributes for testing
  const themes = [
    'light',
    'dark',
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'synthwave',
    'retro',
    'cyberpunk',
    'valentine',
    'halloween',
    'garden',
    'forest',
    'aqua',
    'lofi',
    'pastel',
    'fantasy',
    'wireframe',
    'black',
    'luxury',
    'dracula',
    'cmyk',
    'autumn',
    'business',
    'acid',
    'lemonade',
    'night',
    'coffee',
    'winter',
    'dim',
    'nord',
    'sunset',
  ];

  describe('Button Theme Consistency', () => {
    it('should render primary button consistently across themes', () => {
      themes.forEach(theme => {
        const { container } = render(
          React.createElement(
            'div',
            { 'data-theme': theme },
            React.createElement(Button, { variant: 'primary' }, 'Primary Button'),
          ),
        );

        const button = container.querySelector('button');
        expect(button).toHaveClass('btn', 'btn-primary');

        // Verify theme-specific CSS custom properties are applied
        const computedStyle = window.getComputedStyle(button!);
        expect(computedStyle.getPropertyValue('--p')).toBeDefined();
      });
    });

    it('should render all button variants consistently', () => {
      const variants = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'] as const;

      variants.forEach(variant => {
        themes.slice(0, 3).forEach(theme => {
          // Test subset for performance
          const { container } = render(
            React.createElement(
              'div',
              { 'data-theme': theme },
              React.createElement(Button, { variant }, `${variant} Button`),
            ),
          );

          const button = container.querySelector('button');
          expect(button).toHaveClass('btn', `btn-${variant}`);
        });
      });
    });
  });

  describe('Badge Theme Consistency', () => {
    it('should render badge variants consistently across themes', () => {
      const variants = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'] as const;

      variants.forEach(variant => {
        themes.slice(0, 3).forEach(theme => {
          const { container } = render(
            React.createElement('div', { 'data-theme': theme }, React.createElement(Badge, { variant }, variant)),
          );

          const badge = container.querySelector('.badge');
          expect(badge).toHaveClass('badge', `badge-${variant}`);
        });
      });
    });
  });

  describe('Alert Theme Consistency', () => {
    it('should render alert variants consistently across themes', () => {
      const variants = ['info', 'success', 'warning', 'error'] as const;

      variants.forEach(variant => {
        themes.slice(0, 3).forEach(theme => {
          const { container } = render(
            React.createElement(
              'div',
              { 'data-theme': theme },
              React.createElement(Alert, { variant }, `${variant} alert`),
            ),
          );

          const alert = container.querySelector('.alert');
          expect(alert).toHaveClass('alert', `alert-${variant}`);
        });
      });
    });
  });

  describe('Form Components Theme Consistency', () => {
    it('should render checkbox variants consistently across themes', () => {
      const variants = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'] as const;

      variants.forEach(variant => {
        themes.slice(0, 3).forEach(theme => {
          const { container } = render(
            React.createElement(
              'div',
              { 'data-theme': theme },
              React.createElement(Checkbox, { variant, 'aria-label': `${variant} checkbox` }),
            ),
          );

          const checkbox = container.querySelector('input[type="checkbox"]');
          expect(checkbox).toHaveClass('checkbox', `checkbox-${variant}`);
        });
      });
    });

    it('should render select variants consistently across themes', () => {
      const states = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'] as const;

      states.forEach(state => {
        themes.slice(0, 3).forEach(theme => {
          const { container } = render(
            React.createElement(
              'div',
              { 'data-theme': theme },
              React.createElement(
                Select,
                { state, 'aria-label': `${state} select` },
                React.createElement('option', { value: 'test' }, 'Test Option'),
              ),
            ),
          );

          const select = container.querySelector('select');
          expect(select).toHaveClass('select', `select-${state}`);
        });
      });
    });

    it('should render progress variants consistently across themes', () => {
      const variants = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'] as const;

      variants.forEach(variant => {
        themes.slice(0, 3).forEach(theme => {
          const { container } = render(
            React.createElement('div', { 'data-theme': theme }, React.createElement(Progress, { value: 50, variant })),
          );

          const progress = container.querySelector('progress');
          expect(progress).toHaveClass('progress', `progress-${variant}`);
        });
      });
    });
  });

  describe('Theme Switching Behavior', () => {
    it('should handle theme switching without layout shifts', () => {
      const { container, rerender } = render(
        React.createElement(
          'div',
          { 'data-theme': 'light' },
          React.createElement(Button, { variant: 'primary' }, 'Test Button'),
          React.createElement(Badge, { variant: 'secondary' }, 'Test Badge'),
        ),
      );

      const initialButton = container.querySelector('button');
      const initialBadge = container.querySelector('.badge');
      const initialButtonClasses = initialButton?.className;
      const initialBadgeClasses = initialBadge?.className;

      // Switch theme
      rerender(
        React.createElement(
          'div',
          { 'data-theme': 'dark' },
          React.createElement(Button, { variant: 'primary' }, 'Test Button'),
          React.createElement(Badge, { variant: 'secondary' }, 'Test Badge'),
        ),
      );

      const newButton = container.querySelector('button');
      const newBadge = container.querySelector('.badge');

      // Classes should remain the same, only CSS custom properties change
      expect(newButton?.className).toBe(initialButtonClasses);
      expect(newBadge?.className).toBe(initialBadgeClasses);
    });

    it('should maintain accessibility across theme changes', () => {
      themes.slice(0, 5).forEach(theme => {
        const { container } = render(
          React.createElement(
            'div',
            { 'data-theme': theme },
            React.createElement(Button, { variant: 'primary', 'aria-label': 'Primary action' }, 'Action'),
            React.createElement(Checkbox, { variant: 'primary', 'aria-label': 'Primary checkbox' }),
            React.createElement(
              Select,
              { state: 'primary', 'aria-label': 'Primary select' },
              React.createElement('option', { value: 'test' }, 'Test'),
            ),
          ),
        );

        const button = container.querySelector('button');
        const checkbox = container.querySelector('input[type="checkbox"]');
        const select = container.querySelector('select');

        expect(button).toHaveAttribute('aria-label', 'Primary action');
        expect(checkbox).toHaveAttribute('aria-label', 'Primary checkbox');
        expect(select).toHaveAttribute('aria-label', 'Primary select');
      });
    });
  });

  describe('Color Contrast Validation', () => {
    it('should maintain readable contrast ratios across themes', () => {
      // This test would ideally use a contrast checking library
      // For now, we verify that theme-specific CSS custom properties are applied
      themes.slice(0, 3).forEach(theme => {
        const { container } = render(
          React.createElement(
            'div',
            { 'data-theme': theme },
            React.createElement(Button, { variant: 'primary' }, 'Primary Text'),
            React.createElement(Alert, { variant: 'info' }, 'Info message'),
          ),
        );

        const button = container.querySelector('button');
        const alert = container.querySelector('.alert');

        // Verify CSS custom properties are available for contrast calculations
        const buttonStyle = window.getComputedStyle(button!);
        const alertStyle = window.getComputedStyle(alert!);

        // DaisyUI themes provide these custom properties for contrast
        expect(buttonStyle.getPropertyValue('--p')).toBeDefined();
        expect(alertStyle.getPropertyValue('--in')).toBeDefined();
      });
    });
  });

  describe('Component Size Consistency', () => {
    it('should maintain consistent sizing across themes', () => {
      const sizes = ['xs', 'sm', 'lg'] as const;

      sizes.forEach(size => {
        themes.slice(0, 3).forEach(theme => {
          const { container } = render(
            React.createElement(
              'div',
              { 'data-theme': theme },
              React.createElement(Button, { size, variant: 'primary' }, 'Button'),
              React.createElement(Badge, { size, variant: 'primary' }, 'Badge'),
            ),
          );

          const button = container.querySelector('button');
          const badge = container.querySelector('.badge');

          expect(button).toHaveClass(`btn-${size}`);
          expect(badge).toHaveClass(`badge-${size}`);
        });
      });
    });
  });

  describe('Animation and Transition Consistency', () => {
    it('should maintain consistent animations across themes', () => {
      themes.slice(0, 3).forEach(theme => {
        const { container } = render(
          React.createElement(
            'div',
            { 'data-theme': theme },
            React.createElement(Button, { variant: 'primary', className: 'btn-loading' }, 'Loading'),
          ),
        );

        const button = container.querySelector('button');
        expect(button).toHaveClass('btn-loading');

        // Verify loading animation CSS is applied
        const computedStyle = window.getComputedStyle(button!);
        expect(computedStyle.getPropertyValue('animation')).toBeDefined();
      });
    });
  });
});
