import * as testingUtils from '../index';

describe('Testing Utilities Index', () => {
  describe('Mobile testing utilities exports', () => {
    it('should export mobile render functions', () => {
      expect(typeof testingUtils.mobileRender).toBe('function');
      expect(typeof testingUtils.mobileRenderDark).toBe('function');
      expect(typeof testingUtils.customRender).toBe('function');
      expect(typeof testingUtils.customRenderDark).toBe('function');
    });

    it('should export Eva Design testing utilities', () => {
      expect(typeof testingUtils.createMockTheme).toBe('function');
      expect(typeof testingUtils.testAccessibility).toBe('function');
      expect(typeof testingUtils.testThemeSwitch).toBe('function');
      expect(typeof testingUtils.measureRenderTime).toBe('function');
    });
  });

  describe('API testing utilities exports', () => {
    it('should export data transformation utilities', () => {
      expect(typeof testingUtils.apiTodoToTodo).toBe('function');
    });

    it('should export mock data creation utilities', () => {
      expect(typeof testingUtils.createMockTodo).toBe('function');
      expect(typeof testingUtils.createMockApiTodo).toBe('function');
      expect(typeof testingUtils.createMockTodos).toBe('function');
      expect(typeof testingUtils.createMockApiTodos).toBe('function');
    });

    it('should export specialized mock creators', () => {
      expect(typeof testingUtils.createMockTodoWithStatus).toBe('function');
      expect(typeof testingUtils.createMockTodoWithPriority).toBe('function');
      expect(typeof testingUtils.createMockTodoWithDueDate).toBe('function');
      expect(typeof testingUtils.createMockTodoWithBlockchain).toBe('function');
    });
  });

  describe('Namespace exports', () => {
    it('should export mobile namespace', () => {
      expect(testingUtils.mobile).toBeDefined();
      expect(typeof testingUtils.mobile.render).toBe('function');
      expect(typeof testingUtils.mobile.createMockTheme).toBe('function');
    });

    it('should export api namespace', () => {
      expect(testingUtils.api).toBeDefined();
      expect(typeof testingUtils.api.createMockTodo).toBe('function');
      expect(typeof testingUtils.api.apiTodoToTodo).toBe('function');
    });
  });

  describe('Import patterns', () => {
    it('should support named imports', () => {
      const { createMockTodo, mobileRender } = testingUtils;
      expect(typeof createMockTodo).toBe('function');
      expect(typeof mobileRender).toBe('function');
    });

    it('should support namespace imports', () => {
      const { mobile, api } = testingUtils;
      expect(mobile).toBeDefined();
      expect(api).toBeDefined();
      expect(typeof mobile.render).toBe('function');
      expect(typeof api.createMockTodo).toBe('function');
    });
  });

  describe('Functional testing', () => {
    it('should create mock todo through index export', () => {
      const todo = testingUtils.createMockTodo({ title: 'Index Test Todo' });
      expect(todo.title).toBe('Index Test Todo');
      expect(todo.id).toBe('1');
    });

    it('should create mock theme through index export', () => {
      const theme = testingUtils.createMockTheme({ 'color-primary-default': '#FF0000' });
      expect(theme['color-primary-default']).toBe('#FF0000');
    });

    it('should transform API todo through index export', () => {
      const apiTodo = { id: 'api-123', title: 'API Todo' };
      const todo = testingUtils.apiTodoToTodo(apiTodo);
      expect(todo.id).toBe('api-123');
      expect(todo.title).toBe('API Todo');
    });
  });
});
