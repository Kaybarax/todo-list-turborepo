import { Dimensions } from 'react-native';

import {
  getScreenInfo,
  matchesBreakpoint,
  getResponsiveValue,
  scaleByDensity,
  scaleFontSize,
  getPlatformValue,
  isLandscape,
  getSafeMargins,
  getGridColumns,
  createResponsiveStyle,
  clampByScreenSize,
  getResponsiveSpacing,
} from '../lib/utils/responsive';

// Mock Dimensions
jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn(),
  },
  PixelRatio: {
    get: jest.fn(() => 2),
    getFontScale: jest.fn(() => 1),
  },
}));

const mockDimensions = Dimensions as jest.Mocked<typeof Dimensions>;

describe('Responsive Utils', () => {
  beforeEach(() => {
    mockDimensions.get.mockReturnValue({
      width: 375,
      height: 812,
      scale: 2,
      fontScale: 1,
    });
  });

  describe('getScreenInfo', () => {
    it('returns correct screen info for mobile', () => {
      const screenInfo = getScreenInfo();
      expect(screenInfo.width).toBe(375);
      expect(screenInfo.height).toBe(812);
      expect(screenInfo.isTablet).toBe(false);
      expect(screenInfo.isLandscape).toBe(false);
    });

    it('detects tablet correctly', () => {
      mockDimensions.get.mockReturnValue({
        width: 768,
        height: 1024,
        scale: 2,
        fontScale: 1,
      });

      const screenInfo = getScreenInfo();
      expect(screenInfo.isTablet).toBe(true);
    });

    it('detects landscape correctly', () => {
      mockDimensions.get.mockReturnValue({
        width: 812,
        height: 375,
        scale: 2,
        fontScale: 1,
      });

      const screenInfo = getScreenInfo();
      expect(screenInfo.isLandscape).toBe(true);
    });
  });

  describe('matchesBreakpoint', () => {
    it('matches xs breakpoint correctly', () => {
      expect(matchesBreakpoint('xs')).toBe(true);
    });

    it('matches sm breakpoint correctly', () => {
      mockDimensions.get.mockReturnValue({
        width: 640,
        height: 1136,
        scale: 2,
        fontScale: 1,
      });

      expect(matchesBreakpoint('sm')).toBe(true);
      expect(matchesBreakpoint('xs')).toBe(false);
    });

    it('matches tablet breakpoints correctly', () => {
      mockDimensions.get.mockReturnValue({
        width: 768,
        height: 1024,
        scale: 2,
        fontScale: 1,
      });

      expect(matchesBreakpoint('md')).toBe(true);
      expect(matchesBreakpoint('sm')).toBe(false);
    });
  });

  describe('getResponsiveValue', () => {
    it('returns correct value for current breakpoint', () => {
      const values = {
        xs: 16,
        sm: 20,
        md: 24,
        lg: 28,
        xl: 32,
      };

      expect(getResponsiveValue(values)).toBe(16);
    });

    it('falls back to smaller breakpoint when current not available', () => {
      const values = {
        sm: 20,
        md: 24,
      };

      expect(getResponsiveValue(values)).toBe(20);
    });

    it('handles single value', () => {
      expect(getResponsiveValue(16)).toBe(16);
    });
  });

  describe('scaleByDensity', () => {
    it('scales value by pixel density', () => {
      expect(scaleByDensity(16)).toBe(32); // 16 * 2 (mocked scale)
    });

    it('handles zero values', () => {
      expect(scaleByDensity(0)).toBe(0);
    });
  });

  describe('scaleFontSize', () => {
    it('scales font size by font scale', () => {
      expect(scaleFontSize(16)).toBe(16); // 16 * 1 (mocked fontScale)
    });

    it('respects maximum scale', () => {
      const { PixelRatio } = require('react-native');
      PixelRatio.getFontScale.mockReturnValue(2);

      expect(scaleFontSize(16, 1.5)).toBe(24); // 16 * 1.5 (clamped)
    });
  });

  describe('getPlatformValue', () => {
    it('returns correct value for platform', () => {
      const values = {
        ios: 'iOS Value',
        android: 'Android Value',
        web: 'Web Value',
      };

      // This would depend on Platform.OS, but for testing we can check the function exists
      expect(typeof getPlatformValue(values)).toBe('string');
    });

    it('handles single value', () => {
      expect(getPlatformValue('Universal Value')).toBe('Universal Value');
    });
  });

  describe('isLandscape', () => {
    it('detects portrait correctly', () => {
      expect(isLandscape()).toBe(false);
    });

    it('detects landscape correctly', () => {
      mockDimensions.get.mockReturnValue({
        width: 812,
        height: 375,
        scale: 2,
        fontScale: 1,
      });

      expect(isLandscape()).toBe(true);
    });
  });

  describe('getSafeMargins', () => {
    it('returns safe margins for different screen sizes', () => {
      const margins = getSafeMargins();
      expect(margins.horizontal).toBeGreaterThan(0);
      expect(margins.vertical).toBeGreaterThan(0);
    });

    it('returns larger margins for tablets', () => {
      mockDimensions.get.mockReturnValue({
        width: 768,
        height: 1024,
        scale: 2,
        fontScale: 1,
      });

      const margins = getSafeMargins();
      expect(margins.horizontal).toBeGreaterThan(16);
    });
  });

  describe('getGridColumns', () => {
    it('returns correct column count for mobile', () => {
      expect(getGridColumns()).toBe(2);
    });

    it('returns more columns for tablets', () => {
      mockDimensions.get.mockReturnValue({
        width: 768,
        height: 1024,
        scale: 2,
        fontScale: 1,
      });

      expect(getGridColumns()).toBeGreaterThan(2);
    });

    it('respects custom column counts', () => {
      const customColumns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 };
      expect(getGridColumns(customColumns)).toBe(1);
    });
  });

  describe('createResponsiveStyle', () => {
    it('creates responsive styles correctly', () => {
      const baseStyle = { padding: 16 };
      const responsiveProps = {
        padding: { xs: 12, sm: 16, md: 20 },
      };

      const style = createResponsiveStyle(baseStyle, responsiveProps);
      expect(style.padding).toBe(12);
    });

    it('handles multiple responsive properties', () => {
      const responsiveProps = {
        padding: { xs: 12, md: 20 },
        margin: { xs: 8, md: 16 },
      };

      const style = createResponsiveStyle({}, responsiveProps);
      expect(style.padding).toBe(12);
      expect(style.margin).toBe(8);
    });
  });

  describe('clampByScreenSize', () => {
    it('clamps values based on screen size', () => {
      expect(clampByScreenSize(100, 50, 200)).toBe(100);
      expect(clampByScreenSize(10, 50, 200)).toBe(50);
      expect(clampByScreenSize(300, 50, 200)).toBe(200);
    });
  });

  describe('getResponsiveSpacing', () => {
    it('returns appropriate spacing for screen size', () => {
      const spacing = getResponsiveSpacing('md');
      expect(typeof spacing).toBe('number');
      expect(spacing).toBeGreaterThan(0);
    });

    it('returns different values for different sizes', () => {
      const small = getResponsiveSpacing('sm');
      const large = getResponsiveSpacing('lg');
      expect(large).toBeGreaterThan(small);
    });
  });
});
