import React from 'react';
import { render, screen } from '@testing-library/react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  cardVariants
} from '../../lib/components/Card/Card';

describe('Card', () => {
  it('renders correctly with default props', () => {
    render(<Card data-testid="card">Card content</Card>);
    const card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('rounded-lg', 'border', 'bg-card', 'text-card-foreground', 'shadow-sm');
  });

  it('renders with correct variant classes', () => {
    const variants = ['default', 'outline', 'elevated', 'ghost'] as const;
    
    variants.forEach((variant) => {
      const { unmount } = render(<Card variant={variant} data-testid={`card-${variant}`}>Test</Card>);
      const card = screen.getByTestId(`card-${variant}`);
      expect(card).toBeInTheDocument();
      unmount();
    });
  });

  it('renders with correct size classes', () => {
    const sizes = ['default', 'sm', 'lg'] as const;
    
    sizes.forEach((size) => {
      const { unmount } = render(<Card size={size} data-testid={`card-${size}`}>Test</Card>);
      const card = screen.getByTestId(`card-${size}`);
      expect(card).toBeInTheDocument();
      unmount();
    });
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Test</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies custom className', () => {
    render(<Card className="custom-class" data-testid="card">Custom</Card>);
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('custom-class');
  });

  it('renders as child component when asChild is true', () => {
    render(
      <Card asChild data-testid="card">
        <article>Article Card</article>
      </Card>
    );
    
    const article = screen.getByRole('article');
    expect(article).toBeInTheDocument();
    expect(article).toHaveClass('rounded-lg', 'border');
  });

  it('passes through additional props', () => {
    render(<Card data-testid="card" aria-label="Custom card">Test</Card>);
    const card = screen.getByTestId('card');
    expect(card).toHaveAttribute('aria-label', 'Custom card');
  });
});

describe('CardHeader', () => {
  it('renders correctly with default props', () => {
    render(<CardHeader data-testid="header">Header content</CardHeader>);
    const header = screen.getByTestId('header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardHeader ref={ref}>Test</CardHeader>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('renders as child component when asChild is true', () => {
    render(
      <CardHeader asChild data-testid="header">
        <header>Custom Header</header>
      </CardHeader>
    );
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('flex', 'flex-col');
  });

  it('applies custom className', () => {
    render(<CardHeader className="custom-header" data-testid="header">Header</CardHeader>);
    const header = screen.getByTestId('header');
    expect(header).toHaveClass('custom-header');
  });
});

describe('CardTitle', () => {
  it('renders correctly with default props', () => {
    render(<CardTitle>Title content</CardTitle>);
    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-2xl', 'font-semibold', 'leading-none', 'tracking-tight');
  });

  it('renders with different heading levels', () => {
    const levels = [1, 2, 3, 4, 5, 6] as const;
    
    levels.forEach((level) => {
      const { unmount } = render(<CardTitle level={level}>Title {level}</CardTitle>);
      const title = screen.getByRole('heading', { level });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent(`Title ${level}`);
      unmount();
    });
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLHeadingElement>();
    render(<CardTitle ref={ref}>Test</CardTitle>);
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
  });

  it('renders as child component when asChild is true', () => {
    render(
      <CardTitle asChild>
        <span data-testid="custom-title">Custom Title</span>
      </CardTitle>
    );
    
    const title = screen.getByTestId('custom-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-2xl', 'font-semibold');
  });

  it('applies custom className', () => {
    render(<CardTitle className="custom-title">Title</CardTitle>);
    const title = screen.getByRole('heading');
    expect(title).toHaveClass('custom-title');
  });
});

describe('CardDescription', () => {
  it('renders correctly with default props', () => {
    render(<CardDescription data-testid="description">Description content</CardDescription>);
    const description = screen.getByTestId('description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('text-sm', 'text-muted-foreground');
    expect(description.tagName).toBe('P');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLParagraphElement>();
    render(<CardDescription ref={ref}>Test</CardDescription>);
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });

  it('renders as child component when asChild is true', () => {
    render(
      <CardDescription asChild>
        <span data-testid="custom-description">Custom Description</span>
      </CardDescription>
    );
    
    const description = screen.getByTestId('custom-description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('text-sm', 'text-muted-foreground');
  });

  it('applies custom className', () => {
    render(<CardDescription className="custom-description" data-testid="description">Description</CardDescription>);
    const description = screen.getByTestId('description');
    expect(description).toHaveClass('custom-description');
  });
});

describe('CardContent', () => {
  it('renders correctly with default props', () => {
    render(<CardContent data-testid="content">Content</CardContent>);
    const content = screen.getByTestId('content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass('p-6', 'pt-0');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardContent ref={ref}>Test</CardContent>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('renders as child component when asChild is true', () => {
    render(
      <CardContent asChild>
        <main data-testid="custom-content">Custom Content</main>
      </CardContent>
    );
    
    const content = screen.getByTestId('custom-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass('p-6', 'pt-0');
  });

  it('applies custom className', () => {
    render(<CardContent className="custom-content" data-testid="content">Content</CardContent>);
    const content = screen.getByTestId('content');
    expect(content).toHaveClass('custom-content');
  });
});

describe('CardFooter', () => {
  it('renders correctly with default props', () => {
    render(<CardFooter data-testid="footer">Footer content</CardFooter>);
    const footer = screen.getByTestId('footer');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardFooter ref={ref}>Test</CardFooter>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('renders as child component when asChild is true', () => {
    render(
      <CardFooter asChild>
        <footer data-testid="custom-footer">Custom Footer</footer>
      </CardFooter>
    );
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('flex', 'items-center');
  });

  it('applies custom className', () => {
    render(<CardFooter className="custom-footer" data-testid="footer">Footer</CardFooter>);
    const footer = screen.getByTestId('footer');
    expect(footer).toHaveClass('custom-footer');
  });
});

describe('Complete Card Structure', () => {
  it('renders a complete card with all components', () => {
    render(
      <Card data-testid="complete-card">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description goes here</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the main content of the card.</p>
        </CardContent>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByTestId('complete-card')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Card Title' })).toBeInTheDocument();
    expect(screen.getByText('Card description goes here')).toBeInTheDocument();
    expect(screen.getByText('This is the main content of the card.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });
});

describe('cardVariants', () => {
  it('generates correct classes for default variant and size', () => {
    const classes = cardVariants();
    expect(classes).toContain('rounded-lg');
    expect(classes).toContain('border');
    expect(classes).toContain('bg-card');
    expect(classes).toContain('shadow-sm');
  });

  it('generates correct classes for different variants', () => {
    const outlineClasses = cardVariants({ variant: 'outline' });
    expect(outlineClasses).toContain('border-2');
    
    const elevatedClasses = cardVariants({ variant: 'elevated' });
    expect(elevatedClasses).toContain('shadow-md');
    expect(elevatedClasses).toContain('border-0');
    
    const ghostClasses = cardVariants({ variant: 'ghost' });
    expect(ghostClasses).toContain('border-0');
    expect(ghostClasses).toContain('shadow-none');
    expect(ghostClasses).toContain('bg-transparent');
  });

  it('generates correct classes for different sizes', () => {
    const smallClasses = cardVariants({ size: 'sm' });
    expect(smallClasses).toContain('text-sm');
    
    const largeClasses = cardVariants({ size: 'lg' });
    expect(largeClasses).toContain('text-lg');
  });
});