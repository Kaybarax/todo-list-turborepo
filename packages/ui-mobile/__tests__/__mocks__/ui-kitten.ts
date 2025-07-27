// Mock UI Kitten components for testing
export const mockUIKittenComponent = (name: string) => {
  return ({ children, ...props }: any) => (
    <div data-testid={`ui-kitten-${name.toLowerCase()}`} {...props}>
      {children}
    </div>
  );
};

// Common UI Kitten mocks
export const Button = mockUIKittenComponent('Button');
export const Card = mockUIKittenComponent('Card');
export const Input = mockUIKittenComponent('Input');
export const Text = mockUIKittenComponent('Text');
export const Layout = mockUIKittenComponent('Layout');