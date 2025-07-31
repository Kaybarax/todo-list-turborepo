import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock external dependencies
vi.mock('class-variance-authority', () => import('./__mocks__/class-variance-authority'));
vi.mock('clsx', () => import('./__mocks__/clsx'));
vi.mock('tailwind-merge', () => import('./__mocks__/tailwind-merge'));

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};