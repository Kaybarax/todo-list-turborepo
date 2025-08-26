import { renderHook } from '@testing-library/react-hooks';
import { Platform } from 'react-native';

import { usePlatform } from '../lib/hooks/usePlatform';

// Mock React Native Platform
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    Version: '14.0',
    isPad: false,
    isTV: false,
    isTesting: false,
    select: jest.fn(),
  },
}));

const mockPlatform = Platform as jest.Mocked<typeof Platform>;

describe('usePlatform', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPlatform.OS = 'ios';
    mockPlatform.Version = '14.0';
    mockPlatform.select.mockImplementation(obj => obj.ios || obj.default);
  });

  it('returns correct platform info for iOS', () => {
    const { result } = renderHook(() => usePlatform());

    expect(result.current.isIOS).toBe(true);
    expect(result.current.isAndroid).toBe(false);
    expect(result.current.isWeb).toBe(false);
    expect(result.current.OS).toBe('ios');
    expect(result.current.Version).toBe('14.0');
  });

  it('returns correct platform info for Android', () => {
    mockPlatform.OS = 'android';
    mockPlatform.Version = 30;
    mockPlatform.select.mockImplementation(obj => obj.android || obj.default);

    const { result } = renderHook(() => usePlatform());

    expect(result.current.isIOS).toBe(false);
    expect(result.current.isAndroid).toBe(true);
    expect(result.current.isWeb).toBe(false);
    expect(result.current.OS).toBe('android');
    expect(result.current.Version).toBe(30);
  });

  it('returns correct platform info for Web', () => {
    mockPlatform.OS = 'web';
    mockPlatform.select.mockImplementation(obj => obj.web || obj.default);

    const { result } = renderHook(() => usePlatform());

    expect(result.current.isIOS).toBe(false);
    expect(result.current.isAndroid).toBe(false);
    expect(result.current.isWeb).toBe(true);
    expect(result.current.OS).toBe('web');
  });

  it('selects platform-specific values correctly', () => {
    const { result } = renderHook(() => usePlatform());

    const values = {
      ios: 'iOS Value',
      android: 'Android Value',
      web: 'Web Value',
      default: 'Default Value',
    };

    const selectedValue = result.current.select(values);
    expect(selectedValue).toBe('iOS Value');
  });

  it('falls back to default value when platform not specified', () => {
    const { result } = renderHook(() => usePlatform());

    const values = {
      android: 'Android Value',
      web: 'Web Value',
      default: 'Default Value',
    };

    mockPlatform.select.mockImplementation(obj => obj.default);
    const selectedValue = result.current.select(values);
    expect(selectedValue).toBe('Default Value');
  });

  it('handles single value input', () => {
    const { result } = renderHook(() => usePlatform());

    const singleValue = 'Universal Value';
    const selectedValue = result.current.select(singleValue);
    expect(selectedValue).toBe('Universal Value');
  });

  it('detects iPad correctly', () => {
    (mockPlatform as any).isPad = true;

    const { result } = renderHook(() => usePlatform());

    expect(result.current.isPad).toBe(true);
  });

  it('detects TV correctly', () => {
    (mockPlatform as any).isTV = true;

    const { result } = renderHook(() => usePlatform());

    expect(result.current.isTV).toBe(true);
  });

  it('detects testing environment correctly', () => {
    (mockPlatform as any).isTesting = true;

    const { result } = renderHook(() => usePlatform());

    expect(result.current.isTesting).toBe(true);
  });

  it('provides platform constants', () => {
    const { result } = renderHook(() => usePlatform());

    expect(result.current.constants).toBeDefined();
    expect(typeof result.current.constants).toBe('object');
  });

  it('handles version comparison correctly', () => {
    mockPlatform.Version = '15.0';

    const { result } = renderHook(() => usePlatform());

    expect(result.current.Version).toBe('15.0');
  });

  it('works with numeric Android versions', () => {
    mockPlatform.OS = 'android';
    mockPlatform.Version = 31;

    const { result } = renderHook(() => usePlatform());

    expect(result.current.Version).toBe(31);
    expect(result.current.isAndroid).toBe(true);
  });
});
