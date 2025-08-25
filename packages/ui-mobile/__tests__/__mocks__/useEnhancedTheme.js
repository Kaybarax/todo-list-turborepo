// Mock for useEnhancedTheme hook
export const useEnhancedTheme = () => ({
  theme: {
    colors: {
      primary: '#3366FF',
      secondary: '#8F9BB3',
      success: '#00E096',
      info: '#0095FF',
      warning: '#FFAA00',
      danger: '#FF3D71',
      text: '#222B45',
      background: '#FFFFFF',
    },
  },
  evaTheme: {
    'color-primary-500': '#3366FF',
    'color-basic-800': '#222B45',
  },
});

export default useEnhancedTheme;
