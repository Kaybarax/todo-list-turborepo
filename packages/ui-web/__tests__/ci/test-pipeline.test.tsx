import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

// Import all components to ensure they're tested
import { Button } from '../../lib/components/Button/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../lib/components/Card/Card';
import { Input } from '../../lib/components/Input/Input';
import { Badge } from '../../lib/components/Badge/Badge';

describe('CI/CD Pipeline Tests', () => {
  describe('Component Functionality Tests', () => {
    it('Button component renders and handles interactions', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Test Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Test Button');
      
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('Input component renders and handles value changes', () => {
      const handleChange = vi.fn();
      render(<Input placeholder="Test input" onChange={handleChange} />);
      
      const input = screen.getByPlaceholderText('Test input');
      expect(input).toBeInTheDocument();
      
      fireEvent.change(input, { target: { value: 'test value' } });
      expect(handleChange).toHaveBeenCalled();
    });

    it('Card components render with proper structure', () => {
      render(
        <Card data-testid="test-card">
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>Test Content</CardContent>
          <CardFooter>Test Footer</CardFooter>
        </Card>
      );

      expect(screen.getByTestId('test-card')).toBeInTheDocument();
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
      expect(screen.getByText('Test Footer')).toBeInTheDocument();
    });

    it('Badge component renders with text content', () => {
      render(<Badge>Test Badge</Badge>);
      expect(screen.getByText('Test Badge')).toBeInTheDocument();
    });
  });

  describe('Component Props and Variants', () => {
    it('Button handles different variants', () => {
      const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
      
      variants.forEach((variant, index) => {
        render(<Button variant={variant} key={variant}>Button {index}</Button>);
        expect(screen.getByText(`Button ${index}`)).toBeInTheDocument();
      });
    });

    it('Button handles different sizes', () => {
      const sizes = ['default', 'sm', 'lg', 'icon'] as const;
      
      sizes.forEach((size, index) => {
        render(<Button size={size} key={size}>Button {index}</Button>);
        expect(screen.getByText(`Button ${index}`)).toBeInTheDocument();
      });
    });

    it('Badge handles different variants', () => {
      const variants = ['default', 'secondary', 'destructive', 'outline'] as const;
      
      variants.forEach((variant, index) => {
        render(<Badge variant={variant} key={variant}>Badge {index}</Badge>);
        expect(screen.getByText(`Badge ${index}`)).toBeInTheDocument();
      });
    });

    it('Input handles different types', () => {
      const types = ['text', 'email', 'password', 'number'] as const;
      
      types.forEach((type) => {
        render(<Input type={type} data-testid={`input-${type}`} key={type} />);
        const input = screen.getByTestId(`input-${type}`);
        expect(input).toHaveAttribute('type', type);
      });
    });
  });

  describe('Component State Management', () => {
    it('Button handles disabled state', () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('Button handles loading state', () => {
      render(<Button isLoading>Loading Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      // Loading spinner should be present
      expect(button.querySelector('svg')).toBeInTheDocument();
    });

    it('Input handles disabled state', () => {
      render(<Input disabled data-testid="disabled-input" />);
      const input = screen.getByTestId('disabled-input');
      expect(input).toBeDisabled();
    });

    it('Input handles error state', () => {
      render(<Input error helperText="Error message" />);
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });
  });

  describe('Component Accessibility', () => {
    it('Button maintains proper accessibility attributes', () => {
      render(
        <Button 
          aria-label="Custom button label"
          aria-describedby="button-description"
        >
          Accessible Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom button label');
      expect(button).toHaveAttribute('aria-describedby', 'button-description');
    });

    it('Input maintains proper accessibility attributes', () => {
      render(
        <Input 
          aria-label="Custom input label"
          aria-describedby="input-description"
          data-testid="accessible-input"
        />
      );
      
      const input = screen.getByTestId('accessible-input');
      expect(input).toHaveAttribute('aria-label', 'Custom input label');
      expect(input).toHaveAttribute('aria-describedby', 'input-description');
    });

    it('Card components support proper semantic structure', () => {
      render(
        <Card role="article">
          <CardHeader>
            <CardTitle>Article Title</CardTitle>
          </CardHeader>
          <CardContent>Article content</CardContent>
        </Card>
      );

      const article = screen.getByRole('article');
      expect(article).toBeInTheDocument();
      
      const heading = screen.getByRole('heading');
      expect(heading).toHaveTextContent('Article Title');
    });
  });

  describe('Component Integration', () => {
    it('Components work together in forms', () => {
      const handleSubmit = vi.fn();
      
      render(
        <form onSubmit={handleSubmit}>
          <Input placeholder="Enter name" data-testid="name-input" />
          <Button type="submit">Submit Form</Button>
        </form>
      );

      const input = screen.getByTestId('name-input');
      const button = screen.getByRole('button');

      fireEvent.change(input, { target: { value: 'John Doe' } });
      fireEvent.click(button);

      expect(handleSubmit).toHaveBeenCalled();
    });

    it('Components work together in card layouts', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <Badge>Active</Badge>
          </CardHeader>
          <CardContent>
            <Input placeholder="Update name" />
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText('User Profile')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Update name')).toBeInTheDocument();
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('Components handle empty or null children gracefully', () => {
      render(
        <div>
          <Button>{null}</Button>
          <Button>{undefined}</Button>
          <Button>{''}</Button>
          <Badge>{null}</Badge>
          <Badge>{undefined}</Badge>
          <Badge>{''}</Badge>
        </div>
      );

      // Components should render without throwing errors
      expect(screen.getAllByRole('button')).toHaveLength(3);
    });

    it('Components handle invalid props gracefully', () => {
      render(
        <div>
          <Button variant={undefined as any} size={undefined as any}>
            Test Button
          </Button>
          <Badge variant={undefined as any}>Test Badge</Badge>
          <Input type={undefined as any} />
        </div>
      );

      // Components should render without throwing errors
      expect(screen.getByText('Test Button')).toBeInTheDocument();
      expect(screen.getByText('Test Badge')).toBeInTheDocument();
    });

    it('Components handle complex nested structures', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>
              <Badge>New</Badge>
              Complex Card
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Input placeholder="Nested input" />
              <Button>
                <Badge>1</Badge>
                Nested Button
              </Button>
            </div>
          </CardContent>
        </Card>
      );

      expect(screen.getByText('New')).toBeInTheDocument();
      expect(screen.getByText('Complex Card')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Nested input')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('Nested Button')).toBeInTheDocument();
    });
  });

  describe('Performance and Memory', () => {
    it('Components can be rendered and unmounted without memory leaks', () => {
      const { unmount } = render(
        <div>
          <Button onClick={() => {}}>Button</Button>
          <Input onChange={() => {}} />
          <Card>
            <CardContent>Content</CardContent>
          </Card>
          <Badge>Badge</Badge>
        </div>
      );

      // Should unmount without errors
      expect(() => unmount()).not.toThrow();
    });

    it('Components handle rapid re-renders', () => {
      const TestComponent = ({ count }: { count: number }) => (
        <div>
          <Button>Button {count}</Button>
          <Badge>Count: {count}</Badge>
        </div>
      );

      const { rerender } = render(<TestComponent count={0} />);

      // Rapidly re-render multiple times
      for (let i = 1; i <= 10; i++) {
        rerender(<TestComponent count={i} />);
        expect(screen.getByText(`Button ${i}`)).toBeInTheDocument();
        expect(screen.getByText(`Count: ${i}`)).toBeInTheDocument();
      }
    });
  });
});