/**
 * Testing utilities for the @todo/utils package
 *
 * This module provides testing utilities organized by platform and testing type:
 * - Mobile: Eva Design testing utilities for React Native components
 * - API: Mock data creation and transformation utilities for API testing
 * - Web: Web-specific testing utilities (to be added in future)
 */

// Mobile testing utilities
export {
  // Re-exports from @testing-library/react-native
  render as mobileRender,
  renderDark as mobileRenderDark,
  customRender,
  customRenderDark,

  // Eva Design testing utilities
  createMockTheme,
  testAccessibility,
  testThemeSwitch,
  measureRenderTime,

  // Types
  type EvaTheme,
  type AccessibilityHelpers,
  type ThemeTestResult,
  type PerformanceTestResult,
  type RenderOptions,
  type RenderResult,
} from './mobile';

// API testing utilities
export {
  // Data transformation utilities
  apiTodoToTodo,

  // Mock data creation utilities
  createMockTodo,
  createMockApiTodo,
  createMockTodos,
  createMockApiTodos,

  // Specialized mock creators
  createMockTodoWithStatus,
  createMockTodoWithPriority,
  createMockTodoWithDueDate,
  createMockTodoWithBlockchain,

  // Types
  type TodoData,
} from './api';

// Namespace exports for organized imports
export * as mobile from './mobile';
export * as api from './api';

// Future web testing utilities will be exported here
// export * as web from './web';
