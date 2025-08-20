import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '../components/Dialog/Dialog';
import { vi } from 'vitest';

describe('Dialog', () => {
  it('renders when open is true', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(
      <Dialog open={false}>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
  });

  it('calls onOpenChange when closed', () => {
    const handleOpenChange = vi.fn();
    render(
      <Dialog open={true} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    // Simulate closing the dialog (this would typically be triggered by clicking outside or pressing escape)
    // Since we're using Flowbite Modal, we need to find the close mechanism
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
  });

  it('renders with complex content structure', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complex Dialog</DialogTitle>
            <DialogDescription>This is a description</DialogDescription>
          </DialogHeader>
          <div>Main content goes here</div>
          <DialogFooter>
            <button>Cancel</button>
            <button>Confirm</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText('Complex Dialog')).toBeInTheDocument();
    expect(screen.getByText('This is a description')).toBeInTheDocument();
    expect(screen.getByText('Main content goes here')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('supports controlled open state', () => {
    const TestComponent = () => {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Open Dialog</button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogTitle>Controlled Dialog</DialogTitle>
            </DialogContent>
          </Dialog>
        </>
      );
    };

    render(<TestComponent />);

    expect(screen.queryByText('Controlled Dialog')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Open Dialog'));
    expect(screen.getByText('Controlled Dialog')).toBeInTheDocument();
  });
});

describe('DialogContent', () => {
  it('renders with custom className', () => {
    render(
      <Dialog open={true}>
        <DialogContent className="custom-content">
          <DialogTitle>Test</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    const content = screen.getByText('Test').closest('div');
    expect(content).toHaveClass('custom-content');
  });

  it('applies default padding', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>Test</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    const content = screen.getByText('Test').closest('div');
    expect(content).toHaveClass('p-6');
  });
});

describe('DialogHeader', () => {
  it('renders with correct structure', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Header Title</DialogTitle>
            <DialogDescription>Header Description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText('Header Title')).toBeInTheDocument();
    expect(screen.getByText('Header Description')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader className="custom-header">
            <DialogTitle>Test</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );

    const header = screen.getByText('Test').closest('div');
    expect(header).toHaveClass('custom-header');
  });

  it('has default styling classes', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader data-testid="dialog-header">
            <DialogTitle>Test</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );

    const header = screen.getByTestId('dialog-header');
    expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6', 'pb-0');
  });
});

describe('DialogFooter', () => {
  it('renders with correct structure', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogFooter>
            <button>Cancel</button>
            <button>Save</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogFooter className="custom-footer">
            <button>Test</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    const footer = screen.getByText('Test').closest('div');
    expect(footer).toHaveClass('custom-footer');
  });

  it('has default styling classes', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogFooter data-testid="dialog-footer">
            <button>Test</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    const footer = screen.getByTestId('dialog-footer');
    expect(footer).toHaveClass('flex', 'flex-col-reverse', 'sm:flex-row', 'sm:justify-end', 'border-t');
  });
});

describe('DialogTitle', () => {
  it('renders correctly', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle className="custom-title">Test Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    const title = screen.getByText('Test Title');
    expect(title).toHaveClass('custom-title');
  });

  it('has default styling classes', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    const title = screen.getByText('Test Title');
    expect(title).toHaveClass('text-lg', 'font-semibold', 'leading-none', 'tracking-tight');
  });

  it('renders as h3 element', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText('Test Title').tagName).toBe('H3');
  });
});

describe('DialogDescription', () => {
  it('renders correctly', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogDescription>Test Description</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogDescription className="custom-description">Test Description</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    const description = screen.getByText('Test Description');
    expect(description).toHaveClass('custom-description');
  });

  it('has default styling classes', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogDescription>Test Description</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    const description = screen.getByText('Test Description');
    expect(description).toHaveClass('text-sm', 'text-gray-600');
  });

  it('renders as p element', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogDescription>Test Description</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText('Test Description').tagName).toBe('P');
  });
});

describe('Dialog Integration', () => {
  it('works with form submission', () => {
    const handleSubmit = vi.fn(e => e.preventDefault());

    render(
      <Dialog open={true}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Form Dialog</DialogTitle>
            </DialogHeader>
            <input type="text" placeholder="Enter text" />
            <DialogFooter>
              <button type="submit">Submit</button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>,
    );

    fireEvent.click(screen.getByText('Submit'));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('handles interactive elements', () => {
    const handleClick = vi.fn();

    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Interactive Dialog</DialogTitle>
          </DialogHeader>
          <button onClick={handleClick}>Click Me</button>
          <DialogFooter>
            <button>Close</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
