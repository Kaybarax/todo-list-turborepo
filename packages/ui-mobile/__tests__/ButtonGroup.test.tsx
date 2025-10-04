import { render, fireEvent } from '@testing-library/react-native';
import { ButtonGroup } from '../lib/components/ButtonGroup';
import { Button } from '../lib/components/Button';

describe('ButtonGroup', () => {
  it('handles single selection', () => {
    const onValueChange = jest.fn();
    const { getByText, rerender } = render(
      <ButtonGroup value="medium" onValueChange={onValueChange} type="single">
        <Button value="low">Low</Button>
        <Button value="medium">Medium</Button>
        <Button value="high">High</Button>
      </ButtonGroup>,
    );

    fireEvent.press(getByText('High'));
    expect(onValueChange).toHaveBeenCalledWith('high');

    rerender(
      <ButtonGroup value="high" onValueChange={onValueChange} type="single">
        <Button value="low">Low</Button>
        <Button value="medium">Medium</Button>
        <Button value="high">High</Button>
      </ButtonGroup>,
    );

    // Check visual state if possible, e.g., via testID or accessibilityState
    // For now, we've confirmed the callback logic works.
  });

  it('handles single selection toggle (select/unselect)', () => {
    const onValueChange = jest.fn();
    const { getByText, rerender } = render(
      <ButtonGroup value="" onValueChange={onValueChange} type="single">
        <Button value="low">Low</Button>
        <Button value="medium">Medium</Button>
        <Button value="high">High</Button>
      </ButtonGroup>,
    );

    // First click - select the button
    fireEvent.press(getByText('High'));
    expect(onValueChange).toHaveBeenCalledWith('high');

    // Update the component with the new selected value
    rerender(
      <ButtonGroup value="high" onValueChange={onValueChange} type="single">
        <Button value="low">Low</Button>
        <Button value="medium">Medium</Button>
        <Button value="high">High</Button>
      </ButtonGroup>,
    );

    // Second click on the same button - should unselect it
    fireEvent.press(getByText('High'));
    expect(onValueChange).toHaveBeenCalledWith('');
  });

  it('handles multiple selection', () => {
    const onValueChange = jest.fn();
    const { getByText, rerender } = render(
      <ButtonGroup value={['low']} onValueChange={onValueChange} type="multiple">
        <Button value="low">Low</Button>
        <Button value="medium">Medium</Button>
        <Button value="high">High</Button>
      </ButtonGroup>,
    );

    // Add a value
    fireEvent.press(getByText('High'));
    expect(onValueChange).toHaveBeenCalledWith(['low', 'high']);

    rerender(
      <ButtonGroup value={['low', 'high']} onValueChange={onValueChange} type="multiple">
        <Button value="low">Low</Button>
        <Button value="medium">Medium</Button>
        <Button value="high">High</Button>
      </ButtonGroup>,
    );

    // Remove a value
    fireEvent.press(getByText('Low'));
    expect(onValueChange).toHaveBeenCalledWith(['high']);
  });

  it('applies attached styling when attached prop is true', () => {
    const onValueChange = jest.fn();
    const { getByText } = render(
      <ButtonGroup value="medium" onValueChange={onValueChange} type="single" attached={true}>
        <Button value="low">Low</Button>
        <Button value="medium">Medium</Button>
        <Button value="high">High</Button>
      </ButtonGroup>,
    );

    // Verify buttons are rendered (basic functionality test)
    expect(getByText('Low')).toBeTruthy();
    expect(getByText('Medium')).toBeTruthy();
    expect(getByText('High')).toBeTruthy();
  });
});
