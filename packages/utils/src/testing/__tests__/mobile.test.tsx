import { vi } from 'vitest';
import { createMockTheme, testAccessibility, testThemeSwitch, measureRenderTime } from '../mobile';

// Mock @testing-library/react-native for testing
vi.mock('@testing-library/react-native', () => ({
  render: vi.fn(() => ({
    getByText: vi.fn(() => ({ textContent: 'Test' })),
    getByRole: vi.fn(() => ({ textContent: 'Test' })),
    getByLabelText: vi.fn(() => ({ textContent: 'Test' })),
    getByA11yLabel: vi.fn(() => ({ textContent: 'Test' })),
  })),
}));

describe('Mobile Testing Utilities', () => {
  describe('createMockTheme', () => {
    it('should create default theme object', () => {
      const theme = createMockTheme();

      expect(theme).toEqual({
        'color-primary-default': '#3366FF',
        'color-success-default': '#00E096',
        'color-danger-default': '#FF3D71',
        'background-basic-color-1': '#FFFFFF',
        'text-basic-color': '#222B45',
        'spacing-tiny': 4,
        'spacing-small': 8,
        'spacing-medium': 16,
        'spacing-large': 24,
        'border-radius-small': 4,
        'border-radius-medium': 8,
        'border-radius-large': 12,
      });
    });

    it('should apply overrides to default theme', () => {
      const overrides = {
        'color-primary-default': '#FF0000',
        'spacing-large': 32,
        'custom-property': '#CUSTOM',
      };

      const theme = createMockTheme(overrides);

      expect(theme['color-primary-default']).toBe('#FF0000');
      expect(theme['spacing-large']).toBe(32);
      expect(theme['custom-property']).toBe('#CUSTOM');
      expect(theme['color-success-default']).toBe('#00E096'); // Should keep default
    });

    it('should handle empty overrides', () => {
      const theme = createMockTheme({});
      expect(theme['color-primary-default']).toBe('#3366FF');
    });
  });

  describe('utility functions', () => {
    it('should have testAccessibility function', () => {
      expect(typeof testAccessibility).toBe('function');
    });

    it('should have testThemeSwitch function', () => {
      expect(typeof testThemeSwitch).toBe('function');
    });

    it('should have measureRenderTime function', () => {
      expect(typeof measureRenderTime).toBe('function');
    });
  });

  describe('re-exports from @testing-library/react-native', () => {
    it('should re-export testing library functions', async () => {
      // These are imported from the module, so we just verify they exist
      const mobileModule = await import('../mobile');
      expect(typeof mobileModule.render).toBe('function');
      expect(typeof mobileModule.customRender).toBe('function');
      expect(typeof mobileModule.customRenderDark).toBe('function');
    });
  });
});
