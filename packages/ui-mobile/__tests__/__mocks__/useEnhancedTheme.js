// Enhanced mock for useEnhancedTheme hook providing the tokens
// referenced throughout component implementations (spacing, borders, typography, etc.)
export const useEnhancedTheme = () => ({
  theme: {
    colors: {
      primary: { 500: '#3366FF' },
      secondary: { 500: '#8F9BB3' },
      success: { 500: '#00E096' },
      warning: { 500: '#FFAA00' },
      // Provide full error scale shape used by components (maps to design system 'error')
      error: { 500: '#FF3D71' },
      danger: { 500: '#FF3D71' },
      info: { 500: '#0095FF' },
      text: {
        primary: '#222B45',
        secondary: '#8F9BB3',
        disabled: '#C5CEE0',
        inverse: '#FFFFFF',
      },
      background: '#FFFFFF',
      surface: '#FFFFFF',
      border: { default: '#E4E9F2', focus: '#3366FF', error: '#FF3D71' },
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 40,
      xxxl: 48,
      xxxxl: 56,
    },
    borders: {
      width: { thin: 1, medium: 2, thick: 3 },
      radius: { sm: 4, md: 8, lg: 12 },
    },
    typography: {
      fontWeights: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
    },
  },
  evaTheme: {
    'color-primary-default': '#3366FF',
    'color-primary-500': '#3366FF',
    'color-basic-800': '#222B45',
    'background-basic-color-1': '#FFFFFF',
    'text-basic-color': '#222B45',
    'text-hint-color': '#8F9BB3',
    'border-basic-color-3': '#E4E9F2',
  },
  isDark: false,
  toggleTheme: jest.fn(),
});

export default useEnhancedTheme;
