import { describe, it, expect, beforeEach, vi } from 'vitest';
import { breakpoints, mqUp, mqDown, matches, isUp, isDown } from '../responsive';

// Mock window.matchMedia
const mockMatchMedia = vi.fn();
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

describe('responsive utilities', () => {
  beforeEach(() => {
    mockMatchMedia.mockClear();
  });

  describe('breakpoints', () => {
    it('should have correct breakpoint values', () => {
      expect(breakpoints.sm).toBe(640);
      expect(breakpoints.md).toBe(768);
      expect(breakpoints.lg).toBe(1024);
      expect(breakpoints.xl).toBe(1280);
      expect(breakpoints['2xl']).toBe(1536);
    });
  });

  describe('mqUp', () => {
    it('should generate correct min-width media queries', () => {
      expect(mqUp('sm')).toBe('(min-width: 640px)');
      expect(mqUp('md')).toBe('(min-width: 768px)');
      expect(mqUp('lg')).toBe('(min-width: 1024px)');
      expect(mqUp('xl')).toBe('(min-width: 1280px)');
      expect(mqUp('2xl')).toBe('(min-width: 1536px)');
    });
  });

  describe('mqDown', () => {
    it('should generate correct max-width media queries', () => {
      expect(mqDown('sm')).toBe('(max-width: 639.98px)');
      expect(mqDown('md')).toBe('(max-width: 767.98px)');
      expect(mqDown('lg')).toBe('(max-width: 1023.98px)');
      expect(mqDown('xl')).toBe('(max-width: 1279.98px)');
      expect(mqDown('2xl')).toBe('(max-width: 1535.98px)');
    });
  });

  describe('matches', () => {
    it('should return false when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      expect(matches('(min-width: 768px)')).toBe(false);

      global.window = originalWindow;
    });

    it('should return false when matchMedia is not available', () => {
      const originalMatchMedia = window.matchMedia;
      // @ts-ignore
      delete window.matchMedia;

      expect(matches('(min-width: 768px)')).toBe(false);

      window.matchMedia = originalMatchMedia;
    });

    it('should return matchMedia result when available', () => {
      const mockMediaQueryList = { matches: true };
      mockMatchMedia.mockReturnValue(mockMediaQueryList);

      expect(matches('(min-width: 768px)')).toBe(true);
      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 768px)');

      mockMediaQueryList.matches = false;
      expect(matches('(min-width: 768px)')).toBe(false);
    });
  });

  describe('isUp', () => {
    it('should check if viewport is above breakpoint', () => {
      const mockMediaQueryList = { matches: true };
      mockMatchMedia.mockReturnValue(mockMediaQueryList);

      expect(isUp('md')).toBe(true);
      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 768px)');

      mockMediaQueryList.matches = false;
      expect(isUp('md')).toBe(false);
    });

    it('should handle different breakpoints', () => {
      mockMatchMedia.mockReturnValue({ matches: true });

      isUp('sm');
      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 640px)');

      isUp('lg');
      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 1024px)');

      isUp('2xl');
      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 1536px)');
    });
  });

  describe('isDown', () => {
    it('should check if viewport is below breakpoint', () => {
      const mockMediaQueryList = { matches: true };
      mockMatchMedia.mockReturnValue(mockMediaQueryList);

      expect(isDown('md')).toBe(true);
      expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 767.98px)');

      mockMediaQueryList.matches = false;
      expect(isDown('md')).toBe(false);
    });

    it('should handle different breakpoints', () => {
      mockMatchMedia.mockReturnValue({ matches: true });

      isDown('sm');
      expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 639.98px)');

      isDown('lg');
      expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 1023.98px)');

      isDown('2xl');
      expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 1535.98px)');
    });
  });
});
