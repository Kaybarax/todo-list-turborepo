# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2024-01-15

### Added

#### Todo Components

- **TodoForm**: Comprehensive form component with variants (default, compact, inline)
  - Form validation and error handling
  - Tag management with add/remove functionality
  - Priority selection (low, medium, high)
  - Due date picker
  - Loading and disabled states
- **TodoItem**: Individual todo display component with variants (default, compact, card)
  - Toggle completion functionality
  - Edit and delete actions
  - Priority indicators with color coding
  - Blockchain integration support
  - Transaction status display
- **TodoList**: List container component with variants (default, compact, grid)
  - Filtering by status and priority
  - Sorting by date, priority, and title
  - Search functionality
  - Statistics display
  - Empty state handling

#### Blockchain Components

- **BlockchainStats**: Statistics display for blockchain networks
  - Multi-network support (Solana, Polkadot, Polygon, Moonbeam, Base)
  - Network color coding and branding
  - Responsive layout variants
- **TransactionStatus**: Real-time transaction status tracking
  - Automatic polling with configurable intervals
  - Status states (pending, confirmed, failed)
  - Network-specific transaction displays
  - Error handling and retry logic
- **WalletConnect**: Wallet connection interface
  - Multi-network wallet support
  - Connection state management
  - Balance display and network switching
  - Multiple display variants

#### Theme Components

- **ThemeSwitcher**: Theme selection component
  - Multiple variants (select, dropdown, buttons)
  - Theme grouping by light/dark categories
  - DaisyUI theme integration
  - Custom theme support
- **ThemeToggle**: Simple light/dark theme toggle
- **ThemeProvider**: Context provider for theme management

### Enhanced

- **Documentation**: Comprehensive README with usage examples and migration guide
- **Storybook**: Complete stories for all components with accessibility information
- **TypeScript**: Strict type definitions for all component props and interfaces
- **Testing**: Unit tests and visual regression testing setup
- **Build**: Optimized build configuration with tree-shaking support

### Technical Improvements

- **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation and screen reader support
- **Performance**: Optimized bundle size with code splitting
- **Developer Experience**: Enhanced TypeScript support and comprehensive documentation
- **Design System**: Consistent design tokens and component variants

## [0.1.0] - 2024-01-01

### Initial Release

- Initial package setup
- Basic component structure
- Build and development tooling
- Storybook configuration
- Testing infrastructure
