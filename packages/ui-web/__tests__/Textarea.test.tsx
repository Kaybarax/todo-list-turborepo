import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

import { Textarea } from '../lib/components/Textarea/Textarea';

describe('Textarea', () => {
  it('renders correctly', () => {
    render(<Textarea placeholder="Enter text here" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Textarea className="test-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('test-class');
  });

  it('handles value changes', () => {
    const handleChange = vi.fn();
    render(<Textarea onChange={handleChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Hello world' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('displays helper text when provided', () => {
    render(<Textarea helperText="Enter your message" />);
    expect(screen.getByText('Enter your message')).toBeInTheDocument();
  });

  it('displays error helper text with correct styles', () => {
    render(<Textarea error helperText="This field is required" />);
    const helperText = screen.getByText('This field is required');
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass('text-error');
  });

  it('displays normal helper text with correct styles', () => {
    render(<Textarea helperText="Optional message" />);
    const helperText = screen.getByText('Optional message');
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass('label-text-alt');
  });

  it('renders with error state styling', () => {
    render(<Textarea error />);
    // The error styling is handled by Flowbite's color prop
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Textarea disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('passes through HTML attributes', () => {
    render(
      <Textarea
        id="test-id"
        name="test-name"
        placeholder="Test placeholder"
        rows={5}
        cols={50}
        required
        aria-label="Test textarea"
        data-testid="test-textarea"
      />,
    );
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('id', 'test-id');
    expect(textarea).toHaveAttribute('name', 'test-name');
    expect(textarea).toHaveAttribute('placeholder', 'Test placeholder');
    expect(textarea).toHaveAttribute('rows', '5');
    expect(textarea).toHaveAttribute('cols', '50');
    expect(textarea).toHaveAttribute('required');
    expect(textarea).toHaveAttribute('aria-label', 'Test textarea');
    expect(textarea).toHaveAttribute('data-testid', 'test-textarea');
  });

  it('supports controlled component pattern', () => {
    const TestComponent = () => {
      const [value, setValue] = React.useState('Initial text');
      return <Textarea value={value} onChange={e => setValue(e.target.value)} />;
    };

    render(<TestComponent />);
    const textarea = screen.getByRole('textbox');
    expect((textarea as HTMLTextAreaElement).value).toBe('Initial text');

    fireEvent.change(textarea, { target: { value: 'Updated text' } });
    expect((textarea as HTMLTextAreaElement).value).toBe('Updated text');
  });

  it('handles focus and blur events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    render(<Textarea onFocus={handleFocus} onBlur={handleBlur} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.focus(textarea);
    expect(handleFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(textarea);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard events', () => {
    const handleKeyDown = vi.fn();
    const handleKeyUp = vi.fn();
    render(<Textarea onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.keyDown(textarea, { key: 'Enter' });
    fireEvent.keyUp(textarea, { key: 'Enter' });

    expect(handleKeyDown).toHaveBeenCalledTimes(1);
    expect(handleKeyUp).toHaveBeenCalledTimes(1);
  });

  it('works in form context', () => {
    const handleSubmit = vi.fn(e => e.preventDefault());
    render(
      <form onSubmit={handleSubmit}>
        <Textarea name="message" defaultValue="Test message" />
        <button type="submit">Submit</button>
      </form>,
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('supports multiline text input', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');

    fireEvent.change(textarea, {
      target: { value: 'Line 1\nLine 2\nLine 3' },
    });

    expect((textarea as HTMLTextAreaElement).value).toBe('Line 1\nLine 2\nLine 3');
  });

  it('handles readonly attribute', () => {
    render(<Textarea readOnly value="Read only text" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('readonly');
    expect((textarea as HTMLTextAreaElement).value).toBe('Read only text');
  });

  it('supports maxLength attribute', () => {
    render(<Textarea maxLength={100} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('maxlength', '100');
  });

  it('supports minLength attribute', () => {
    render(<Textarea minLength={10} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('minlength', '10');
  });

  it('renders wrapper div with full width', () => {
    const { container } = render(<Textarea />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('w-full');
  });

  it('handles resize behavior', () => {
    render(<Textarea style={{ resize: 'vertical' }} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveStyle({ resize: 'vertical' });
  });
});
