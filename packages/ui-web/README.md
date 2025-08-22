# @todo/ui-web

A modern, accessible React component library built with **DaisyUI** and **Tailwind CSS** styling. Designed for the Todo app web interface with comprehensive TypeScript support, visual regression testing, and Storybook documentation.

## ✨ Features

- 🎨 **Built with DaisyUI**: Modern UI component framework with Tailwind CSS
- 🎯 **TypeScript First**: Full TypeScript support with comprehensive type definitions
- 🌈 **Tailwind CSS**: Utility-first styling with customizable design tokens
- 📱 **Responsive Design**: Mobile-first approach with responsive variants
- 🌙 **Dark Mode**: Built-in dark mode support with CSS variables
- ♿ **Accessibility**: WCAG compliant with proper ARIA attributes
- 🧪 **Comprehensive Testing**: Unit tests, integration tests, and visual regression testing
- 📚 **Storybook**: Interactive component documentation and development environment
- 🔄 **Visual Regression**: Automated visual testing with Chromatic integration

## 📦 Installation

```bash
# From the monorepo root
pnpm install @todo/ui-web

# Or with npm
npm install @todo/ui-web

# Or with yarn
yarn add @todo/ui-web
```

## 🚀 Quick Start

```tsx
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Badge,
  // Todo Components
  TodoForm,
  TodoItem,
  TodoList,
  // Blockchain Components
  BlockchainStats,
  TransactionStatus,
  WalletConnect,
  // Theme Components
  ThemeProvider,
  ThemeSwitcher,
} from '@todo/ui-web';
import '@todo/ui-web/styles.css'; // Import styles

function App() {
  return (
    <ThemeProvider>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Todo App</h1>
          <ThemeSwitcher variant="dropdown" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TodoForm onSubmit={data => console.log('New todo:', data)} />
            <TodoList
              todos={todos}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
              className="mt-6"
            />
          </div>

          <div className="space-y-6">
            <BlockchainStats data={blockchainStats} />
            <WalletConnect onConnect={handleWalletConnect} onDisconnect={handleWalletDisconnect} />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
```

## 🧩 Components

### Core Components

| Component    | Description                                         | Implementation   |
| ------------ | --------------------------------------------------- | ---------------- |
| **Button**   | Versatile button with variants, sizes, and states   | Native + DaisyUI |
| **Card**     | Flexible container with header, content, and footer | Native + DaisyUI |
| **Input**    | Form input with validation, icons, and labels       | Native + DaisyUI |
| **Select**   | Dropdown select with custom styling                 | Native + DaisyUI |
| **Checkbox** | Checkbox input with enhanced styling                | Native + DaisyUI |
| **Textarea** | Multi-line text input with validation               | Native + DaisyUI |
| **Label**    | Form labels with variant support                    | Native + DaisyUI |
| **Dialog**   | Modal dialogs with backdrop and animations          | Native + DaisyUI |

### Todo Components

| Component    | Description                                       | Implementation   |
| ------------ | ------------------------------------------------- | ---------------- |
| **TodoForm** | Comprehensive form for creating and editing todos | Native + DaisyUI |
| **TodoItem** | Individual todo item with blockchain integration  | Native + DaisyUI |
| **TodoList** | List with filtering, sorting, and search features | Native + DaisyUI |

### Blockchain Components

| Component             | Description                                   | Implementation   |
| --------------------- | --------------------------------------------- | ---------------- |
| **BlockchainStats**   | Statistics display for blockchain integration | Native + DaisyUI |
| **TransactionStatus** | Real-time transaction status monitoring       | Native + DaisyUI |
| **WalletConnect**     | Multi-network wallet connection component     | Native + DaisyUI |

### Theme Components

| Component         | Description                                | Implementation   |
| ----------------- | ------------------------------------------ | ---------------- |
| **ThemeProvider** | Unified theme context with DaisyUI support | Native + DaisyUI |
| **ThemeSwitcher** | Theme selection with multiple variants     | Native + DaisyUI |

### Button Component

```tsx
import { Button } from '@todo/ui-web';

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>

// States
<Button disabled>Disabled</Button>
<Button loading>Loading...</Button>
<Button loading loadingText="Please wait...">Submit</Button>

// With icons
<Button leftIcon={<ArrowLeft />}>Back</Button>
<Button rightIcon={<ArrowRight />}>Next</Button>
```

### Card Component

```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@todo/ui-web';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>;
```

### Input Component

```tsx
import { Input } from '@todo/ui-web';

// Basic input
<Input placeholder="Enter text..." />

// With helper text
<Input
  placeholder="Enter your email"
  helperText="We'll never share your email"
  type="email"
/>

// With icons
<Input
  leftIcon={<SearchIcon />}
  rightIcon={<CheckIcon />}
  placeholder="Search..."
/>

// Error state
<Input
  error
  helperText="Password must be at least 8 characters"
  type="password"
  placeholder="Enter password"
/>
```

### Select Component

```tsx
import { Select } from '@todo/ui-web';

// Basic select
<Select>
  <option value="">Choose option...</option>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</Select>

// With error state
<Select error helperText="Please select an option">
  <option value="">Choose option...</option>
  <option value="1">Option 1</option>
</Select>
```

### Form Components

```tsx
import { Checkbox, Textarea, Label } from '@todo/ui-web';

// Checkbox
<Checkbox id="terms" />
<Label htmlFor="terms">I agree to the terms</Label>

// Textarea
<Textarea
  placeholder="Enter your message..."
  helperText="Maximum 500 characters"
/>

// Label variants
<Label variant="required">Required Field</Label>
<Label variant="optional">Optional Field</Label>
<Label variant="error">Error Field</Label>
```

## 📋 Todo Components

### TodoForm Component

A comprehensive form component for creating and editing todos with validation, tag management, and multiple variants.

```tsx
import { TodoForm, type TodoFormData } from '@todo/ui-web';

// Basic usage
<TodoForm
  onSubmit={(data: TodoFormData) => console.log('Todo created:', data)}
  onCancel={() => console.log('Cancelled')}
/>

// Compact variant for inline editing
<TodoForm
  variant="compact"
  onSubmit={handleSubmit}
  initialData={{
    title: 'Existing todo',
    priority: 'high',
    tags: ['work', 'urgent']
  }}
/>

// Inline variant for quick todo creation
<TodoForm
  variant="inline"
  onSubmit={handleQuickAdd}
  placeholder="Add a quick todo..."
/>

// With loading state
<TodoForm
  onSubmit={handleSubmit}
  loading={isSubmitting}
  disabled={!canEdit}
/>
```

**Props:**

- `onSubmit: (data: TodoFormData) => void` - Called when form is submitted
- `onCancel?: () => void` - Called when form is cancelled
- `initialData?: Partial<TodoFormData>` - Pre-populate form fields
- `variant?: 'default' | 'compact' | 'inline'` - Form layout variant
- `disabled?: boolean` - Disable all form inputs
- `loading?: boolean` - Show loading state

### TodoItem Component

Individual todo item component with blockchain integration, action buttons, and multiple display variants.

```tsx
import { TodoItem, type TodoData } from '@todo/ui-web';
import { TransactionStatus } from '@todo/ui-web';

// Basic usage
<TodoItem
  todo={todoData}
  onToggle={(id) => toggleTodo(id)}
  onEdit={(todo) => editTodo(todo)}
  onDelete={(id) => deleteTodo(id)}
/>

// With blockchain integration
<TodoItem
  todo={todoData}
  onToggle={handleToggle}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onBlockchainSync={(id, network) => syncToBlockchain(id, network)}
  TransactionStatusComponent={TransactionStatus}
  showBlockchainInfo={true}
/>

// Compact variant for lists
<TodoItem
  todo={todoData}
  variant="compact"
  onToggle={handleToggle}
  onEdit={handleEdit}
  onDelete={handleDelete}
  showActions={false}
/>

// Detailed variant with full information
<TodoItem
  todo={todoData}
  variant="detailed"
  onToggle={handleToggle}
  onEdit={handleEdit}
  onDelete={handleDelete}
  showBlockchainInfo={true}
  supportedNetworks={['solana', 'polygon', 'base']}
/>
```

**Props:**

- `todo: TodoData` - Todo data object
- `onToggle: (id: string) => void` - Toggle completion status
- `onEdit: (todo: TodoData) => void` - Edit todo
- `onDelete: (id: string) => void` - Delete todo
- `onBlockchainSync?: (id: string, network: BlockchainNetwork) => void` - Sync to blockchain
- `variant?: 'default' | 'compact' | 'detailed'` - Display variant
- `showActions?: boolean` - Show edit/delete buttons
- `showBlockchainInfo?: boolean` - Show blockchain status

### TodoList Component

List component with filtering, sorting, search, and statistics display.

```tsx
import { TodoList, type TodoData, type FilterType, type SortType } from '@todo/ui-web';

// Basic usage
<TodoList
  todos={todos}
  onToggle={handleToggle}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>

// With blockchain integration and custom empty state
<TodoList
  todos={todos}
  onToggle={handleToggle}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onBlockchainSync={handleBlockchainSync}
  TransactionStatusComponent={TransactionStatus}
  emptyState={<CustomEmptyState />}
/>

// Grid layout with filters disabled
<TodoList
  todos={todos}
  variant="grid"
  onToggle={handleToggle}
  onEdit={handleEdit}
  onDelete={handleDelete}
  showFilters={false}
  showStats={true}
/>

// Compact variant with initial filters
<TodoList
  todos={todos}
  variant="compact"
  onToggle={handleToggle}
  onEdit={handleEdit}
  onDelete={handleDelete}
  initialFilter="active"
  initialSort="priority"
  initialSearchTerm="work"
/>
```

**Props:**

- `todos: TodoData[]` - Array of todo items
- `onToggle: (id: string) => void` - Toggle completion status
- `onEdit: (todo: TodoData) => void` - Edit todo
- `onDelete: (id: string) => void` - Delete todo
- `variant?: 'default' | 'compact' | 'grid'` - Layout variant
- `showStats?: boolean` - Show statistics summary
- `showFilters?: boolean` - Show filter controls
- `loading?: boolean` - Show loading state
- `emptyState?: React.ReactNode` - Custom empty state component

## ⛓️ Blockchain Components

### BlockchainStats Component

Statistics display component for blockchain integration with network breakdown and sync status.

```tsx
import { BlockchainStats, type BlockchainStatsData } from '@todo/ui-web';

const statsData: BlockchainStatsData = {
  total: 25,
  onChain: 15,
  offChain: 10,
  networkBreakdown: {
    'solana': 8,
    'polygon': 4,
    'base': 3
  },
  pendingTransactions: 2,
  syncPercentage: 85
};

// Basic usage
<BlockchainStats data={statsData} />

// Compact variant without network breakdown
<BlockchainStats
  data={statsData}
  variant="compact"
  showNetworkBreakdown={false}
  showSyncPercentage={true}
/>

// Detailed variant with custom network colors
<BlockchainStats
  data={statsData}
  variant="detailed"
  getNetworkColor={(network) => getCustomNetworkColor(network)}
/>
```

**Props:**

- `data: BlockchainStatsData` - Statistics data object
- `variant?: 'default' | 'compact' | 'detailed'` - Display variant
- `showNetworkBreakdown?: boolean` - Show network distribution
- `showSyncPercentage?: boolean` - Show sync percentage
- `getNetworkColor?: (network: string) => string` - Custom network colors

### TransactionStatus Component

Real-time transaction status monitoring with automatic polling and status updates.

```tsx
import { TransactionStatus, type TransactionStatusType } from '@todo/ui-web';

// Basic usage
<TransactionStatus
  transactionHash="0x1234567890abcdef..."
  network="polygon"
  onStatusChange={(status) => console.log('Status:', status)}
/>

// Compact variant without hash display
<TransactionStatus
  transactionHash="0x1234567890abcdef..."
  network="solana"
  variant="compact"
  showHash={false}
  autoRefresh={true}
/>

// Detailed variant with custom polling
<TransactionStatus
  transactionHash="0x1234567890abcdef..."
  network="base"
  variant="detailed"
  showHash={true}
  autoRefresh={true}
  pollingInterval={5000}
  maxPollingTime={600000}
  createBlockchainService={createCustomBlockchainService}
/>
```

**Props:**

- `transactionHash: string` - Transaction hash to monitor
- `network: string` - Blockchain network
- `variant?: 'default' | 'compact' | 'detailed'` - Display variant
- `showHash?: boolean` - Show transaction hash
- `autoRefresh?: boolean` - Enable automatic status polling
- `onStatusChange?: (status: TransactionStatusType) => void` - Status change callback

### WalletConnect Component

Multi-network wallet connection component with balance display and network switching.

```tsx
import { WalletConnect, type WalletAccount } from '@todo/ui-web';

// Basic usage
<WalletConnect
  onConnect={(account) => setConnectedAccount(account)}
  onDisconnect={() => setConnectedAccount(null)}
  onNetworkSwitch={(network) => switchNetwork(network)}
/>

// Button-only variant
<WalletConnect
  variant="button-only"
  onConnect={handleConnect}
  isConnected={!!account}
  account={account}
/>

// Compact variant with custom networks
<WalletConnect
  variant="compact"
  supportedNetworks={['solana', 'polygon', 'base']}
  defaultNetwork="solana"
  showBalance={true}
  showNetworkSelector={true}
  onConnect={handleConnect}
  onDisconnect={handleDisconnect}
/>

// Connected state with error handling
<WalletConnect
  isConnected={true}
  account={connectedAccount}
  error={connectionError}
  onDisconnect={handleDisconnect}
  onNetworkSwitch={handleNetworkSwitch}
/>
```

**Props:**

- `onConnect?: (account: WalletAccount) => void` - Connection callback
- `onDisconnect?: () => void` - Disconnection callback
- `onNetworkSwitch?: (network: BlockchainNetwork) => void` - Network switch callback
- `variant?: 'default' | 'compact' | 'button-only'` - Display variant
- `supportedNetworks?: BlockchainNetwork[]` - Supported blockchain networks
- `showBalance?: boolean` - Show wallet balance
- `showNetworkSelector?: boolean` - Show network selector
- `isConnected?: boolean` - Connection state
- `account?: WalletAccount | null` - Connected account data

## 🎨 Theme Components

### ThemeProvider Component

Unified theme context provider with DaisyUI theme support and system theme detection.

```tsx
import { ThemeProvider } from '@todo/ui-web';

// Basic usage with DaisyUI themes
<ThemeProvider
  themes={['light', 'dark', 'cupcake', 'synthwave']}
  defaultMode="system"
  defaultThemeName="light"
>
  <App />
</ThemeProvider>

// With custom themes and storage
<ThemeProvider
  themes={customThemes}
  defaultMode="dark"
  storage={localStorage}
  rootElement={document.documentElement}
  enableDaisyUI={true}
>
  <App />
</ThemeProvider>
```

### ThemeSwitcher Component

Theme selection component with multiple variants and theme grouping.

```tsx
import { ThemeSwitcher } from '@todo/ui-web';

// Dropdown variant
<ThemeSwitcher
  variant="dropdown"
  showLabel={true}
  size="md"
/>

// Button group variant
<ThemeSwitcher
  variant="buttons"
  groupThemes={true}
  customThemes={customThemeList}
/>

// Select variant with custom styling
<ThemeSwitcher
  variant="select"
  className="w-full"
  size="lg"
/>

// Toggle variant for light/dark switching
<ThemeSwitcher
  variant="toggle"
  showLabel={false}
  size="sm"
/>
```

**Props:**

- `variant?: 'dropdown' | 'toggle' | 'buttons' | 'select'` - Switcher variant
- `showLabel?: boolean` - Show theme labels
- `size?: 'sm' | 'md' | 'lg'` - Component size
- `groupThemes?: boolean` - Group themes by type
- `customThemes?: ThemeConfig[]` - Custom theme configurations

## 🎨 Theming and Customization

### DaisyUI Theming

The library uses DaisyUI themes for consistent styling. Customize by configuring DaisyUI themes:

```js
// tailwind.config.js
module.exports = {
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter',
      'dim',
      'nord',
      'sunset',
    ],
  },
};
```

### Tailwind CSS Integration

The library is built with Tailwind CSS and DaisyUI. Extend your Tailwind config:

```js
// tailwind.config.js
module.exports = {
  content: [
    './node_modules/@todo/ui-web/dist/**/*.{js,ts,jsx,tsx}',
    // ... your content paths
  ],
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark'], // or your preferred themes
    darkTheme: 'dark',
    base: true,
    styled: true,
    utils: true,
  },
};
```

## 🧪 Development

### Building

```bash
# Build the library
pnpm build

# Build in watch mode
pnpm dev

# From monorepo root
pnpm build --filter=@todo/ui-web
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch

# Run visual regression tests
pnpm test:visual

# Run specific test suites
pnpm vitest run __tests__/components/Button.test.tsx
```

### Storybook Development

```bash
# Start Storybook development server
pnpm storybook

# Build Storybook for production
pnpm build-storybook

# From monorepo root
pnpm storybook --filter=@todo/ui-web
```

### Visual Regression Testing

```bash
# Run Chromatic visual tests
pnpm chromatic

# Run Chromatic in CI mode
pnpm chromatic:ci

# Full visual test pipeline
pnpm visual-test
```

## 📚 Storybook

Interactive component documentation is available in Storybook. Each component includes:

- **All variants and states** documented with interactive controls
- **Accessibility testing** with built-in a11y addon
- **Responsive testing** across different viewport sizes
- **Dark mode testing** with theme switching
- **Code examples** with copy-to-clipboard functionality

### Running Showcase Application

```bash
# Start the showcase application
pnpm showcase:dev

# Build the showcase for production
pnpm showcase:build
```

## 🔍 Visual Regression Testing

The library includes comprehensive visual regression testing:

- **Chromatic Integration**: Automated visual testing on every PR
- **Screenshot Comparison**: Pixel-perfect component rendering validation
- **Cross-browser Testing**: Consistent rendering across browsers
- **Responsive Testing**: Visual validation across viewport sizes

See [Visual Testing Guide](./__tests__/visual/VISUAL_TESTING.md) for detailed information.

## 🏗️ Architecture

### Directory Structure

```text
packages/ui-web/
├── src/                        # Source code
│   ├── components/            # Component implementations
│   │   ├── Button/
│   │   │   ├── Button.tsx     # Component implementation
│   │   │   ├── Button.stories.tsx # Storybook stories
│   │   │   └── index.ts       # Exports
│   │   ├── todo/              # Todo components
│   │   │   ├── TodoForm/
│   │   │   ├── TodoItem/
│   │   │   ├── TodoList/
│   │   │   └── index.ts
│   │   ├── blockchain/        # Blockchain components
│   │   │   ├── BlockchainStats/
│   │   │   ├── TransactionStatus/
│   │   │   ├── WalletConnect/
│   │   │   └── index.ts
│   │   ├── theme/            # Theme components
│   │   │   ├── ThemeProvider/
│   │   │   ├── ThemeSwitcher/
│   │   │   └── index.ts
│   │   └── ...               # Other core components
│   ├── utils/                 # Utility functions
│   ├── styles.css            # Global styles
│   └── index.ts              # Main exports
├── __tests__/                 # Test files
│   ├── components/           # Component tests
│   ├── integration/          # Integration tests
│   ├── visual/              # Visual regression tests
│   └── __mocks__/           # Test mocks
├── .storybook/              # Storybook configuration
├── showcase/                # Showcase application
└── dist/                   # Built output
```

### Component Architecture

Components are built using:

1. **DaisyUI Components**: Pre-styled, accessible UI components
2. **Native HTML Elements**: Standard form elements with enhanced styling
3. **Class Variance Authority (CVA)**: Type-safe variant generation
4. **Tailwind Merge**: Intelligent class merging for customization
5. **TypeScript**: Full type safety with proper prop interfaces

### Example Component Structure

```tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils';

const buttonVariants = cva(
  'btn transition-all duration-200 transform active:scale-95 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'btn-primary shadow-lg hover:shadow-xl',
        destructive: 'btn-error shadow-lg hover:shadow-xl',
        outline: 'btn-outline shadow-md hover:shadow-lg',
        secondary: 'btn-secondary shadow-md hover:shadow-lg',
        ghost: 'btn-ghost hover:shadow-md',
        link: 'btn-link underline-offset-4',
      },
      size: {
        default: 'btn-md min-w-[120px]',
        sm: 'btn-sm min-w-[100px]',
        lg: 'btn-lg min-w-[140px]',
        icon: 'btn-square btn-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, loadingText, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && <span className="loading loading-spinner loading-sm mr-2"></span>}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {loading && loadingText ? loadingText : children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
```

## 🤝 Contributing

### Adding New Components

1. **Create component directory**: `lib/components/ComponentName/`
2. **Implement component**: `ComponentName.tsx` with proper TypeScript types
3. **Create stories**: `ComponentName.stories.tsx` with comprehensive examples
4. **Write tests**: Add to `__tests__/components/ComponentName.test.tsx`
5. **Add exports**: Update `src/index.ts` and component `index.ts`
6. **Update documentation**: Add to this README and Storybook docs

### Component Guidelines

- **Use DaisyUI classes** for consistent styling and theming
- **Implement proper TypeScript types** with VariantProps
- **Follow naming conventions** (PascalCase for components)
- **Include comprehensive tests** (unit, integration, visual)
- **Document all props** in Storybook stories
- **Support dark mode** with DaisyUI themes
- **Ensure accessibility** with proper ARIA attributes and semantic HTML

### Testing Guidelines

- **Unit tests**: Test component logic and props
- **Integration tests**: Test component interactions
- **Visual tests**: Test component appearance and responsive behavior
- **Accessibility tests**: Test keyboard navigation and screen readers

## 📄 License

This package is part of the Todo monorepo and follows the same license terms.

## 🔗 Related Packages

- [`@todo/ui-mobile`](../ui-mobile/README.md) - React Native component library
- [`@todo/config-eslint`](../config-eslint/README.md) - Shared ESLint configuration
- [`@todo/config-ts`](../config-ts/README.md) - Shared TypeScript configuration

## 📞 Support

For questions, issues, or contributions, please refer to the main repository documentation or create an issue in the monorepo.
