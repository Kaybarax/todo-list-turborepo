import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ThemeProvider } from '../lib/../../theme';

// Mock the theme context
const mockSetTheme = vi.fn();
const mockSetDaisyUITheme = vi.fn();

const mockThemeContext = {
  mode: 'system' as const,
  resolvedType: 'light' as const,
  theme: { name: 'light', displayName: 'Light', type: 'light' as const, daisyUITheme: 'light' as const },
  themes: [
    { name: 'light', displayName: 'Light', type: 'light' as const, daisyUITheme: 'light' as const },
    { name: 'dark', displayName: 'Dark', type: 'dark' as const, daisyUITheme: 'dark' as const },
    { name: 'cupcake', displayName: 'Cupcake', type: 'light' as const, daisyUITheme: 'cupcake' as const },
    { name: 'synthwave', displayName: 'Synthwave', type: 'dark' as const, daisyUITheme: 'synthwave' as const },
  ],
  daisyUITheme: 'light' as const,
  setMode: vi.fn(),
  setTheme: mockSetTheme,
  setDaisyUITheme: mockSetDaisyUITheme,
};

vi.mock('../../../theme', async () => {
  const actual = await vi.importActual('../../../theme');
  return {
    ...actual,
    useThemeContext: () => mockThemeContext,
  };
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => <ThemeProvider>{children}</ThemeProvider>;

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(
        <TestWrapper>
          <ThemeSwitcher />
        </TestWrapper>,
      );

      expect(screen.getByText('Theme')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Light')).toBeInTheDocument();
    });

    it('should render without label when showLabel is false', () => {
      render(
        <TestWrapper>
          <ThemeSwitcher showLabel={false} />
        </TestWrapper>,
      );

      expect(screen.queryByText('Theme')).not.toBeInTheDocument();
    });

    it('should render with custom test id', () => {
      render(
        <TestWrapper>
          <ThemeSwitcher data-testid="custom-theme-switcher" />
        </TestWrapper>,
      );

      expect(screen.getByTestId('custom-theme-switcher')).toBeInTheDocument();
    });

    it('should render different sizes correctly', () => {
      const { rerender } = render(
        <TestWrapper>
          <ThemeSwitcher size="sm" />
        </TestWrapper>,
      );

      expect(screen.getByRole('combobox')).toHaveClass('select-sm');

      rerender(
        <TestWrapper>
          <ThemeSwitcher size="lg" />
        </TestWrapper>,
      );

      expect(screen.getByRole('combobox')).toHaveClass('select-lg');
    });
  });

  describe('Select Variant', () => {
    it('should render select variant with grouped themes', () => {
      render(
        <TestWrapper>
          <ThemeSwitcher variant="select" groupThemes={true} />
        </TestWrapper>,
      );

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();

      // Check for optgroups
      expect(screen.getByText('Light Themes')).toBeInTheDocument();
      expect(screen.getByText('Dark Themes')).toBeInTheDocument();
    });

    it('should render select variant without grouped themes', () => {
      render(
        <TestWrapper>
          <ThemeSwitcher variant="select" groupThemes={false} />
        </TestWrapper>,
      );

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();

      // Should not have optgroups
      expect(screen.queryByText('Light Themes')).not.toBeInTheDocument();
      expect(screen.queryByText('Dark Themes')).not.toBeInTheDocument();
    });

    it('should handle theme change in select variant', async () => {
      render(
        <TestWrapper>
          <ThemeSwitcher variant="select" />
        </TestWrapper>,
      );

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'dark' } });

      await waitFor(() => {
        expect(mockSetDaisyUITheme).toHaveBeenCalledWith('dark');
      });
    });
  });

  describe('Dropdown Variant', () => {
    it('should render dropdown variant', () => {
      render(
        <TestWrapper>
          <ThemeSwitcher variant="dropdown" />
        </TestWrapper>,
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('Light')).toBeInTheDocument();
    });

    it('should open dropdown and show themes', async () => {
      render(
        <TestWrapper>
          <ThemeSwitcher variant="dropdown" groupThemes={true} />
        </TestWrapper>,
      );

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Light Themes')).toBeInTheDocument();
        expect(screen.getByText('Dark Themes')).toBeInTheDocument();
      });
    });
  });

  describe('Buttons Variant', () => {
    it('should render buttons variant', () => {
      render(
        <TestWrapper>
          <ThemeSwitcher variant="buttons" />
        </TestWrapper>,
      );

      // Should render theme buttons
      expect(screen.getByText('Light')).toBeInTheDocument();
      expect(screen.getByText('Dark')).toBeInTheDocument();
    });

    it('should handle theme change in buttons variant', async () => {
      render(
        <TestWrapper>
          <ThemeSwitcher variant="buttons" />
        </TestWrapper>,
      );

      const darkButton = screen.getByText('Dark');
      fireEvent.click(darkButton);

      await waitFor(() => {
        expect(mockSetDaisyUITheme).toHaveBeenCalledWith('dark');
      });
    });

    it('should show more dropdown when there are many themes', () => {
      const manyThemes = Array.from({ length: 10 }, (_, i) => `theme-${i}`);

      render(
        <TestWrapper>
          <ThemeSwitcher variant="buttons" customThemes={manyThemes} />
        </TestWrapper>,
      );

      expect(screen.getByText('More...')).toBeInTheDocument();
    });
  });

  describe('Theme Formatting', () => {
    it('should format theme names correctly', () => {
      render(
        <TestWrapper>
          <ThemeSwitcher customThemes={['light', 'dark-mode', 'custom-theme']} />
        </TestWrapper>,
      );

      expect(screen.getByText('Light')).toBeInTheDocument();
      expect(screen.getByText('Dark Mode')).toBeInTheDocument();
      expect(screen.getByText('Custom Theme')).toBeInTheDocument();
    });
  });

  describe('Custom Themes', () => {
    it('should render only custom themes when provided', () => {
      const customThemes = ['light', 'dark'];

      render(
        <TestWrapper>
          <ThemeSwitcher customThemes={customThemes} />
        </TestWrapper>,
      );

      const select = screen.getByRole('combobox');
      const options = select.querySelectorAll('option');

      expect(options).toHaveLength(2);
      expect(screen.getByText('Light')).toBeInTheDocument();
      expect(screen.getByText('Dark')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes for select variant', () => {
      render(
        <TestWrapper>
          <ThemeSwitcher variant="select" />
        </TestWrapper>,
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-label', expect.any(String));
    });

    it('should support keyboard navigation in dropdown variant', async () => {
      render(
        <TestWrapper>
          <ThemeSwitcher variant="dropdown" />
        </TestWrapper>,
      );

      const trigger = screen.getByRole('button');

      // Focus and activate with keyboard
      trigger.focus();
      fireEvent.keyDown(trigger, { key: 'Enter' });

      await waitFor(() => {
        expect(screen.getByText('Light Themes')).toBeInTheDocument();
      });
    });

    it('should support keyboard navigation in buttons variant', () => {
      render(
        <TestWrapper>
          <ThemeSwitcher variant="buttons" />
        </TestWrapper>,
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('tabIndex', expect.any(String));
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle missing theme gracefully', () => {
      const contextWithMissingTheme = {
        ...mockThemeContext,
        theme: { name: 'missing-theme', displayName: 'Missing', type: 'light' as const },
        daisyUITheme: 'missing-theme' as any,
      };

      vi.mocked(require('../../../theme').useThemeContext).mockReturnValue(contextWithMissingTheme);

      expect(() => {
        render(
          <TestWrapper>
            <ThemeSwitcher />
          </TestWrapper>,
        );
      }).not.toThrow();
    });

    it('should fallback to select variant for invalid variant', () => {
      render(
        <TestWrapper>
          <ThemeSwitcher variant={'invalid' as any} />
        </TestWrapper>,
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });
});
