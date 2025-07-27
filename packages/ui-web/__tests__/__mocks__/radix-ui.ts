// Mock Radix UI components for testing
export const mockRadixComponent = (name: string) => {
  return ({ children, ...props }: any) => (
    <div data-testid={`radix-${name.toLowerCase()}`} {...props}>
      {children}
    </div>
  );
};

// Common Radix UI mocks
export const Slot = mockRadixComponent('Slot');
export const Root = mockRadixComponent('Root');
export const Trigger = mockRadixComponent('Trigger');
export const Content = mockRadixComponent('Content');