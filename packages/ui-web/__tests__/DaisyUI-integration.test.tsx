import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../lib/components/Button';
import { Badge } from '../lib/components/Badge';
import { Alert } from '../lib/components/Alert';
import { Modal } from '../lib/components/Modal';
import { Loading } from '../lib/components/Loading';

describe('DaisyUI Component Integration', () => {
  describe('Cross-Component Theme Consistency', () => {
    it('should apply consistent primary variant across components', () => {
      render(
        <div>
          <Button variant="primary" data-testid="button">
            Button
          </Button>
          <Badge variant="primary" data-testid="badge">
            Badge
          </Badge>
          <Alert variant="info" data-testid="alert">
            Alert
          </Alert>
        </div>,
      );

      const button = screen.getByTestId('button');
      const badge = screen.getByTestId('badge');
      const alert = screen.getByTestId('alert');

      expect(button).toHaveClass('btn-primary');
      expect(badge).toHaveClass('badge-primary');
      expect(alert).toHaveClass('alert-info');
    });

    it('should maintain DaisyUI class naming conventions', () => {
      const components = [
        { Component: Button, props: { variant: 'secondary' }, expectedClass: 'btn-secondary' },
        { Component: Badge, props: { variant: 'accent' }, expectedClass: 'badge-accent' },
        { Component: Alert, props: { variant: 'success' }, expectedClass: 'alert-success' },
      ];

      components.forEach(({ Component, props, expectedClass }, index) => {
        const { unmount } = render(
          <Component {...props} data-testid={`component-${index}`}>
            Test
          </Component>,
        );
        const element = screen.getByTestId(`component-${index}`);
        expect(element).toHaveClass(expectedClass);
        unmount();
      });
    });
  });

  describe('Size Consistency', () => {
    it('should apply consistent size classes across components', () => {
      render(
        <div>
          <Button size="lg" data-testid="button-lg">
            Large Button
          </Button>
          <Badge size="lg" data-testid="badge-lg">
            Large Badge
          </Badge>
        </div>,
      );

      const button = screen.getByTestId('button-lg');
      const badge = screen.getByTestId('badge-lg');

      expect(button).toHaveClass('btn-lg');
      expect(badge).toHaveClass('badge-lg');
    });

    it('should handle size variants consistently', () => {
      const sizes = ['xs', 'sm', 'lg'] as const;

      sizes.forEach(size => {
        const { unmount } = render(
          <div>
            <Button size={size} data-testid={`btn-${size}`}>
              Button
            </Button>
            <Badge size={size} data-testid={`badge-${size}`}>
              Badge
            </Badge>
          </div>,
        );

        const button = screen.getByTestId(`btn-${size}`);
        const badge = screen.getByTestId(`badge-${size}`);

        expect(button).toHaveClass(`btn-${size}`);
        expect(badge).toHaveClass(`badge-${size}`);
        unmount();
      });
    });
  });

  describe('State Management Integration', () => {
    it('should handle disabled state consistently', () => {
      render(
        <div>
          <Button disabled data-testid="disabled-button">
            Disabled Button
          </Button>
          <select className="select" disabled data-testid="disabled-select">
            <option>Disabled Select</option>
          </select>
        </div>,
      );

      const button = screen.getByTestId('disabled-button');
      const select = screen.getByTestId('disabled-select');

      expect(button).toBeDisabled();
      expect(select).toBeDisabled();
    });

    it('should handle loading states with DaisyUI classes', () => {
      render(
        <div>
          <Button loading data-testid="loading-button">
            Loading
          </Button>
          <Loading data-testid="loading-spinner" />
        </div>,
      );

      const button = screen.getByTestId('loading-button');
      const spinner = screen.getByTestId('loading-spinner');

      expect(button).toHaveClass('loading');
      expect(spinner).toHaveClass('loading');
    });
  });

  describe('Modal and Dialog Integration', () => {
    it('should apply DaisyUI modal classes correctly', () => {
      render(
        <Modal open data-testid="modal">
          <div>Modal Content</div>
        </Modal>,
      );

      const modal = screen.getByTestId('modal');
      expect(modal).toHaveClass('modal');
      expect(modal).toHaveClass('modal-open');
    });

    it('should handle modal backdrop and box classes', () => {
      render(
        <Modal open data-testid="modal">
          <div className="modal-box" data-testid="modal-box">
            Modal Content
          </div>
        </Modal>,
      );

      const modal = screen.getByTestId('modal');
      const modalBox = screen.getByTestId('modal-box');

      expect(modal).toHaveClass('modal');
      expect(modalBox).toHaveClass('modal-box');
    });
  });

  describe('Form Control Integration', () => {
    it('should work within DaisyUI form-control structure', () => {
      render(
        <div className="form-control" data-testid="form-control">
          <label className="label" data-testid="label">
            <span className="label-text">Form Label</span>
          </label>
          <Button data-testid="form-button">Form Button</Button>
          <div className="label" data-testid="helper">
            <span className="label-text-alt">Helper text</span>
          </div>
        </div>,
      );

      const formControl = screen.getByTestId('form-control');
      const label = screen.getByTestId('label');
      const button = screen.getByTestId('form-button');
      const helper = screen.getByTestId('helper');

      expect(formControl).toHaveClass('form-control');
      expect(label).toHaveClass('label');
      expect(button).toHaveClass('btn');
      expect(helper).toHaveClass('label');
    });
  });

  describe('Responsive Design Integration', () => {
    it('should support DaisyUI responsive classes', () => {
      render(
        <div>
          <Button className="btn-sm md:btn-md lg:btn-lg" data-testid="responsive-button">
            Responsive Button
          </Button>
          <Badge className="badge-sm md:badge-md lg:badge-lg" data-testid="responsive-badge">
            Responsive Badge
          </Badge>
        </div>,
      );

      const button = screen.getByTestId('responsive-button');
      const badge = screen.getByTestId('responsive-badge');

      expect(button).toHaveClass('btn-sm', 'md:btn-md', 'lg:btn-lg');
      expect(badge).toHaveClass('badge-sm', 'md:badge-md', 'lg:badge-lg');
    });
  });

  describe('Animation and Transition Integration', () => {
    it('should support DaisyUI animation classes', () => {
      render(
        <div>
          <Loading variant="spinner" data-testid="spinner" />
          <Loading variant="dots" data-testid="dots" />
          <Loading variant="ring" data-testid="ring" />
        </div>,
      );

      const spinner = screen.getByTestId('spinner');
      const dots = screen.getByTestId('dots');
      const ring = screen.getByTestId('ring');

      expect(spinner).toHaveClass('loading', 'loading-spinner');
      expect(dots).toHaveClass('loading', 'loading-dots');
      expect(ring).toHaveClass('loading', 'loading-ring');
    });
  });

  describe('Color System Integration', () => {
    it('should use DaisyUI semantic color system', () => {
      const semanticColors = [
        { variant: 'primary', component: Button },
        { variant: 'secondary', component: Button },
        { variant: 'accent', component: Button },
        { variant: 'info', component: Alert },
        { variant: 'success', component: Alert },
        { variant: 'warning', component: Alert },
        { variant: 'error', component: Alert },
      ] as const;

      semanticColors.forEach(({ variant, component: Component }, index) => {
        const { unmount } = render(
          <Component variant={variant} data-testid={`semantic-${index}`}>
            Test
          </Component>,
        );

        const element = screen.getByTestId(`semantic-${index}`);
        const expectedClass = Component === Button ? `btn-${variant}` : `alert-${variant}`;
        expect(element).toHaveClass(expectedClass);
        unmount();
      });
    });
  });

  describe('Accessibility Integration', () => {
    it('should maintain ARIA attributes with DaisyUI classes', () => {
      render(
        <div>
          <Button variant="primary" aria-label="Primary action button" data-testid="aria-button">
            Action
          </Button>
          <Alert variant="info" role="alert" aria-live="polite" data-testid="aria-alert">
            Information message
          </Alert>
        </div>,
      );

      const button = screen.getByTestId('aria-button');
      const alert = screen.getByTestId('aria-alert');

      expect(button).toHaveClass('btn-primary');
      expect(button).toHaveAttribute('aria-label', 'Primary action button');

      expect(alert).toHaveClass('alert-info');
      expect(alert).toHaveAttribute('role', 'alert');
      expect(alert).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Custom Property Integration', () => {
    it('should work with CSS custom properties from Style Dictionary', () => {
      render(
        <div>
          <Button
            variant="primary"
            style={{ '--custom-padding': '1rem' } as React.CSSProperties}
            data-testid="custom-button"
          >
            Custom Button
          </Button>
        </div>,
      );

      const button = screen.getByTestId('custom-button');
      expect(button).toHaveClass('btn-primary');
      expect(button).toHaveStyle({ '--custom-padding': '1rem' });
    });
  });
});
