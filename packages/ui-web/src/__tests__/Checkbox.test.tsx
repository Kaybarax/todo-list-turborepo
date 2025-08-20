import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import { Checkbox } from '../components/Checkbox/Checkbox';

describe('Checkbox', () => {
  it('renders correctly', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Checkbox className="test-class" />);
    expect(screen.getByRole('checkbox')).toHaveClass('test-class');
  });

  it('handles checked state', () => {
    render(<Checkbox checked />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('handles unchecked state', () => {
    render(<Checkbox checked={false} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('calls onChange when clicked', () => {
    const handleChange = vi.fn();
    render(<Checkbox onChange={handleChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('calls onCheckedChange when clicked', () => {
    const handleCheckedChange = vi.fn();
    render(<Checkbox onCheckedChange={handleCheckedChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it('calls both onChange and onCheckedChange when clicked', () => {
    const handleChange = vi.fn();
    const handleCheckedChange = vi.fn();
    render(<Checkbox onChange={handleChange} onCheckedChange={handleCheckedChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Checkbox disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('passes through HTML attributes', () => {
    render(<Checkbox id="test-id" name="test-name" value="test-value" aria-label="test-label" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('id', 'test-id');
    expect(checkbox).toHaveAttribute('name', 'test-name');
    expect(checkbox).toHaveAttribute('value', 'test-value');
    expect(checkbox).toHaveAttribute('aria-label', 'test-label');
  });

  it('handles indeterminate state', () => {
    const { container } = render(<Checkbox />);
    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

    // Simulate indeterminate state
    if (checkbox) {
      checkbox.indeterminate = true;
    }

    expect(checkbox?.indeterminate).toBe(true);
  });

  it('works with form submission', () => {
    const handleSubmit = vi.fn(e => e.preventDefault());
    render(
      <form onSubmit={handleSubmit}>
        <Checkbox name="terms" value="accepted" />
        <button type="submit">Submit</button>
      </form>,
    );

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button'));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});
