import React from 'react';
import { render, screen } from '@testing-library/react';
import { Input } from '../../src/components/Input/Input';

describe('Input', () => {
  it('renders correctly with default props', () => {
    render(<Input data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toBeDefined();
    expect(input.className).toContain('input');
  });

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input.getAttribute('placeholder')).toBe('Enter text');
  });

  it('renders with different types', () => {
    const types = ['text', 'email', 'password', 'number'] as const;

    types.forEach(type => {
      const { unmount } = render(<Input type={type} data-testid={`input-${type}`} />);
      const input = screen.getByTestId(`input-${type}`);
      expect(input.getAttribute('type')).toBe(type);
      unmount();
    });
  });

  it('handles value changes', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} data-testid="input" />);
    const input = screen.getByTestId('input') as HTMLInputElement;

    input.value = 'test value';
    input.dispatchEvent(new Event('change', { bubbles: true }));

    expect(handleChange).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input.getAttribute('disabled')).toBe('');
  });

  it('applies custom className', () => {
    render(<Input className="custom-input" data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input.className).toContain('custom-input');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('passes through additional props', () => {
    render(<Input data-testid="input" aria-label="Custom input" maxLength={10} />);
    const input = screen.getByTestId('input');
    expect(input.getAttribute('aria-label')).toBe('Custom input');
    expect(input.getAttribute('maxLength')).toBe('10');
  });

  it('handles required attribute', () => {
    render(<Input required data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input.getAttribute('required')).toBe('');
  });

  it('handles readonly attribute', () => {
    render(<Input readOnly data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input.getAttribute('readonly')).toBe('');
  });
});
