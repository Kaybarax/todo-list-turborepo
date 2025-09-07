import {
  generateAccessibilityLabel,
  generateAccessibilityHint,
  calculateContrastRatio,
  validateContrastRatio,
  validateTouchTargetSize,
  getAccessibilityRole,
  createAccessibilityState,
  createAccessibilityValue,
  formatNumberForScreenReader,
  createAccessibilityProps,
} from '../lib/utils/accessibility';

// Ensure PixelRatio exists for any utilities indirectly invoking it
jest.mock('react-native', () => ({
  PixelRatio: {
    get: jest.fn(() => 2),
    getFontScale: jest.fn(() => 1),
    roundToNearestPixel: jest.fn(v => v),
  },
}));

describe('Accessibility Utils', () => {
  describe('generateAccessibilityLabel', () => {
    it('generates label from text content', () => {
      expect(generateAccessibilityLabel('Submit')).toBe('Submit');
      expect(generateAccessibilityLabel('Save Changes')).toBe('Save Changes');
    });

    it('generates label with context', () => {
      expect(generateAccessibilityLabel('Delete', 'item')).toBe('Delete item');
      expect(generateAccessibilityLabel('Edit', 'profile')).toBe('Edit profile');
    });

    it('handles empty input', () => {
      expect(generateAccessibilityLabel('')).toBe('');
      expect(generateAccessibilityLabel('', 'context')).toBe('context');
    });
  });

  describe('generateAccessibilityHint', () => {
    it('generates hint for actions', () => {
      expect(generateAccessibilityHint('submit', 'form')).toBe('Double tap to submit form');
      expect(generateAccessibilityHint('open', 'menu')).toBe('Double tap to open menu');
    });

    it('handles different actions', () => {
      expect(generateAccessibilityHint('close')).toBe('Double tap to close');
      expect(generateAccessibilityHint('navigate')).toBe('Double tap to navigate');
    });
  });

  describe('calculateContrastRatio', () => {
    it('calculates contrast ratio correctly', () => {
      // White on black should have high contrast
      expect(calculateContrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 0);

      // Same colors should have ratio of 1
      expect(calculateContrastRatio('#ffffff', '#ffffff')).toBe(1);
      expect(calculateContrastRatio('#000000', '#000000')).toBe(1);
    });

    it('handles different color formats', () => {
      expect(calculateContrastRatio('white', 'black')).toBeCloseTo(21, 0);
      expect(calculateContrastRatio('rgb(255,255,255)', 'rgb(0,0,0)')).toBeCloseTo(21, 0);
    });
  });

  describe('validateContrastRatio', () => {
    it('validates WCAG AA compliance', () => {
      expect(validateContrastRatio('#ffffff', '#000000', 'AA').isValid).toBe(true);
      expect(validateContrastRatio('#ffffff', '#cccccc', 'AA').isValid).toBe(false);
    });

    it('validates WCAG AAA compliance', () => {
      expect(validateContrastRatio('#ffffff', '#000000', 'AAA').isValid).toBe(true);
      expect(validateContrastRatio('#ffffff', '#666666', 'AAA').isValid).toBe(false);
    });

    it('validates large text requirements', () => {
      expect(validateContrastRatio('#ffffff', '#777777', 'AA', true).isValid).toBe(true);
      expect(validateContrastRatio('#ffffff', '#999999', 'AA', true).isValid).toBe(false);
    });
  });

  describe('validateTouchTargetSize', () => {
    it('validates minimum touch target size', () => {
      expect(validateTouchTargetSize(44, 44).isValid).toBe(true);
      expect(validateTouchTargetSize(48, 48).isValid).toBe(true);
      expect(validateTouchTargetSize(30, 30).isValid).toBe(false);
    });

    it('handles rectangular targets (requires both dimensions to meet minimum)', () => {
      expect(validateTouchTargetSize(60, 40).isValid).toBe(false);
      expect(validateTouchTargetSize(40, 60).isValid).toBe(false);
      expect(validateTouchTargetSize(20, 60).isValid).toBe(false);
    });
  });

  describe('getAccessibilityRole', () => {
    it('returns correct roles for components', () => {
      expect(getAccessibilityRole('button')).toBe('button');
      expect(getAccessibilityRole('link')).toBe('link');
      expect(getAccessibilityRole('text')).toBe('text');
      expect(getAccessibilityRole('image')).toBe('image');
    });

    it('handles interactive elements', () => {
      expect(getAccessibilityRole('button', true)).toBe('button');
      expect(getAccessibilityRole('text', true)).toBe('button');
    });
  });

  describe('createAccessibilityState', () => {
    it('creates state for disabled elements', () => {
      expect(createAccessibilityState({ disabled: true })).toEqual({ disabled: true });
    });

    it('creates state for selected elements', () => {
      expect(createAccessibilityState({ selected: true })).toEqual({ selected: true });
    });

    it('creates state for checked elements', () => {
      expect(createAccessibilityState({ checked: true })).toEqual({ checked: true });
    });

    it('combines multiple states', () => {
      expect(createAccessibilityState({ disabled: true, selected: true })).toEqual({
        disabled: true,
        selected: true,
      });
    });
  });

  describe('createAccessibilityValue', () => {
    it('creates value for numeric inputs', () => {
      expect(createAccessibilityValue(50, 0, 100)).toEqual({
        min: 0,
        max: 100,
        now: 50,
      });
    });

    it('creates value with text', () => {
      expect(createAccessibilityValue('Medium', 0, 100, 'Volume level')).toEqual({
        min: 0,
        max: 100,
        now: 'Medium',
        text: 'Volume level',
      });
    });
  });

  describe('formatNumberForScreenReader', () => {
    it('formats numbers correctly', () => {
      expect(formatNumberForScreenReader(1)).toBe('1');
      expect(formatNumberForScreenReader(42)).toBe('42');
    });

    it('formats large numbers', () => {
      expect(formatNumberForScreenReader(1000)).toBe('1,000');
      expect(formatNumberForScreenReader(1500)).toBe('1,500');
      expect(formatNumberForScreenReader(1000000)).toBe('1,000,000');
    });

    it('handles decimals', () => {
      expect(formatNumberForScreenReader(3.14)).toBe('3.14');
      expect(formatNumberForScreenReader(2.5)).toBe('2.5');
    });
  });

  describe('createAccessibilityProps', () => {
    it('creates complete accessibility props', () => {
      const props = createAccessibilityProps({
        label: 'Submit button',
        hint: 'Submits the form',
        role: 'button',
        state: { disabled: false },
      });

      expect(props).toEqual({
        accessibilityLabel: 'Submit button',
        accessibilityHint: 'Submits the form',
        accessibilityRole: 'button',
        accessibilityState: { disabled: false },
      });
    });

    it('handles optional props', () => {
      const props = createAccessibilityProps({
        label: 'Simple text',
      });

      expect(props.accessibilityLabel).toBe('Simple text');
      expect(props.accessibilityRole).toBeUndefined();
    });

    it('includes accessibility value when provided', () => {
      const props = createAccessibilityProps({
        label: 'Slider',
        value: { min: 0, max: 100, now: 50 },
      });

      expect(props.accessibilityValue).toEqual({ min: 0, max: 100, now: 50 });
    });
  });
});
