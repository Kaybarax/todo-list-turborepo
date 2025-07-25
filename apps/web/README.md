# Todo Web Application

A modern Next.js 14 web application with App Router, TypeScript, Tailwind CSS, and comprehensive blockchain integration for the Todo App monorepo.

## 🚀 Features

### Core Web Features
- **Next.js 14**: Latest Next.js with App Router and server components
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Responsive Design**: Mobile-first responsive design
- **Server Components**: Optimized performance with server-side rendering
- **Progressive Web App**: PWA capabilities for offline usage

### Blockchain Integration
- **WalletConnect v2**: Seamless wallet connection and authentication
- **Multi-Network Support**: Polygon, Solana, and Polkadot integration
- **Web3 Authentication**: Wallet-based user authentication
- **Transaction Management**: Real-time transaction status and history
- **Decentralized Storage**: Todo items stored on blockchain networks

### User Experience
- **Real-time Updates**: Live updates using WebSocket connections
- **Optimistic Updates**: Immediate UI feedback with rollback on errors
- **Offline Support**: Service worker for offline functionality
- **Dark/Light Mode**: Theme switching with system preference detection
- **Accessibility**: WCAG 2.1 AA compliant interface

## 📁 Project Structure

```
apps/web/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/         # Authentication routes
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── todos/          # Todo management pages
│   │   ├── wallet/         # Wallet integration pages
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── forms/         # Form components
│   │   ├── layout/        # Layout components
│   │   └── features/      # Feature-specific components
│   ├── lib/               # Utility libraries
│   │   ├── api.ts         # API client
│   │   ├── auth.ts        # Authentication utilities
│   │   ├── blockchain.ts  # Blockchain utilities
│   │   └── utils.ts       # General utilities
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.ts     # Authentication hook
│   │   ├── useTodos.ts    # Todo management hook
│   │   └── useWallet.ts   # Wallet integration hook
│   ├── store/             # State management
│   │   ├── auth.ts        # Authentication store
│   │   ├── todos.ts       # Todo store
│   │   └── wallet.ts      # Wallet store
│   ├── types/             # TypeScript type definitions
│   └── styles/            # Additional styles
├── public/                # Static assets
│   ├── icons/
│   ├── images/
│   └── manifest.json
├── __tests__/             # Test files
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── package.json
└── README.md
```

## 🛠️ Development

### Prerequisites
- Node.js 20+
- pnpm package manager
- API server running (see apps/api/README.md)

### Quick Start

#### Using Development Scripts
```bash
# Start web app with dependencies (recommended)
pnpm dev:web

# Or start frontend services
pnpm dev:frontend
```

#### Manual Setup
```bash
# Install dependencies
pnpm install

# Start API server (in another terminal)
pnpm dev:api

# Start development server
cd apps/web
pnpm dev
```

### Environment Configuration

Create `.env.local` in the `apps/web` directory:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Blockchain Configuration
NEXT_PUBLIC_POLYGON_RPC_URL=http://localhost:8545
NEXT_PUBLIC_SOLANA_RPC_URL=http://localhost:8899
NEXT_PUBLIC_POLKADOT_RPC_URL=ws://localhost:9944

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id

# Feature Flags
NEXT_PUBLIC_ENABLE_BLOCKCHAIN=true
NEXT_PUBLIC_ENABLE_PWA=true

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Available Scripts

```bash
# Development
pnpm dev                   # Start development server
pnpm dev:turbo            # Start with Turbo for faster builds

# Building
pnpm build                # Build for production
pnpm start                # Start production server
pnpm export               # Export static site

# Testing
pnpm test                 # Run unit tests
pnpm test:watch          # Run tests in watch mode
pnpm test:e2e            # Run end-to-end tests
pnpm test:coverage       # Run tests with coverage

# Code Quality
pnpm lint                # Run ESLint
pnpm lint:fix            # Fix ESLint issues
pnpm type-check          # Run TypeScript type checking

# Storybook
pnpm storybook           # Start Storybook development server
pnpm build-storybook     # Build Storybook for production
```

## 🎨 UI Components

### Design System
The application uses a custom design system built with Tailwind CSS and Radix UI primitives.

#### Core Components
```typescript
// Button component example
import { Button } from '@/components/ui/button';

<Button variant="primary" size="lg" onClick={handleClick}>
  Create Todo
</Button>
```

#### Form Components
```typescript
// Form with validation
import { TodoForm } from '@/components/forms/TodoForm';

<TodoForm
  onSubmit={handleSubmit}
  initialValues={todo}
  validationSchema={todoSchema}
/>
```

#### Layout Components
```typescript
// Dashboard layout
import { DashboardLayout } from '@/components/layout/DashboardLayout';

<DashboardLayout>
  <TodoList todos={todos} />
</DashboardLayout>
```

### Styling Guidelines

#### Tailwind CSS Classes
```css
/* Primary colors */
.bg-primary     /* Main brand color */
.bg-secondary   /* Secondary brand color */
.bg-accent      /* Accent color */

/* Status colors */
.bg-success     /* Success state */
.bg-warning     /* Warning state */
.bg-error       /* Error state */

/* Component variants */
.btn-primary    /* Primary button */
.btn-secondary  /* Secondary button */
.btn-ghost      /* Ghost button */
```

#### Dark Mode Support
```typescript
// Theme switching
import { useTheme } from '@/hooks/useTheme';

const { theme, setTheme } = useTheme();

<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
  Toggle Theme
</button>
```

## 🔐 Authentication

### JWT Authentication
```typescript
// Login with email/password
import { useAuth } from '@/hooks/useAuth';

const { login, user, isLoading } = useAuth();

const handleLogin = async (email: string, password: string) => {
  try {
    await login({ email, password });
    router.push('/dashboard');
  } catch (error) {
    setError('Invalid credentials');
  }
};
```

### Wallet Authentication
```typescript
// Connect wallet and authenticate
import { useWallet } from '@/hooks/useWallet';

const { connect, disconnect, account, isConnected } = useWallet();

const handleWalletConnect = async () => {
  try {
    await connect();
    // User is now authenticated with their wallet
  } catch (error) {
    setError('Failed to connect wallet');
  }
};
```

### Protected Routes
```typescript
// Protected page component
import { withAuth } from '@/lib/auth';

function DashboardPage() {
  return <Dashboard />;
}

export default withAuth(DashboardPage);
```

## 📝 Todo Management

### Todo List Component
```typescript
// Todo list with real-time updates
import { useTodos } from '@/hooks/useTodos';

function TodoList() {
  const { todos, createTodo, updateTodo, deleteTodo, isLoading } = useTodos();

  return (
    <div className="space-y-4">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
        />
      ))}
    </div>
  );
}
```

### Todo Creation
```typescript
// Create todo with blockchain integration
const handleCreateTodo = async (data: CreateTodoData) => {
  try {
    const todo = await createTodo({
      ...data,
      blockchainNetwork: selectedNetwork,
    });
    
    // Optionally sync to blockchain
    if (data.syncToBlockchain) {
      await syncTodoToBlockchain(todo.id, selectedNetwork);
    }
  } catch (error) {
    toast.error('Failed to create todo');
  }
};
```

### Real-time Updates
```typescript
// WebSocket integration for real-time updates
import { useWebSocket } from '@/hooks/useWebSocket';

function TodoDashboard() {
  const { todos, setTodos } = useTodos();
  
  useWebSocket('/todos', {
    onMessage: (event) => {
      const { type, data } = JSON.parse(event.data);
      
      switch (type) {
        case 'TODO_CREATED':
          setTodos(prev => [...prev, data]);
          break;
        case 'TODO_UPDATED':
          setTodos(prev => prev.map(todo => 
            todo.id === data.id ? data : todo
          ));
          break;
        case 'TODO_DELETED':
          setTodos(prev => prev.filter(todo => todo.id !== data.id));
          break;
      }
    },
  });

  return <TodoList todos={todos} />;
}
```

## ⛓️ Blockchain Integration

### Wallet Connection
```typescript
// WalletConnect integration
import { WalletConnectProvider } from '@/components/providers/WalletConnectProvider';

function App() {
  return (
    <WalletConnectProvider projectId={process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID}>
      <YourApp />
    </WalletConnectProvider>
  );
}
```

### Multi-Network Support
```typescript
// Network switching
import { useBlockchain } from '@/hooks/useBlockchain';

function NetworkSelector() {
  const { currentNetwork, switchNetwork, supportedNetworks } = useBlockchain();

  return (
    <select 
      value={currentNetwork} 
      onChange={(e) => switchNetwork(e.target.value)}
    >
      {supportedNetworks.map(network => (
        <option key={network.id} value={network.id}>
          {network.name}
        </option>
      ))}
    </select>
  );
}
```

### Transaction Management
```typescript
// Transaction status tracking
import { useTransactions } from '@/hooks/useTransactions';

function TransactionStatus({ todoId }: { todoId: string }) {
  const { getTransactionStatus } = useTransactions();
  const [status, setStatus] = useState<TransactionStatus>('pending');

  useEffect(() => {
    const checkStatus = async () => {
      const txStatus = await getTransactionStatus(todoId);
      setStatus(txStatus);
    };

    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [todoId]);

  return (
    <div className={`status-${status}`}>
      Transaction Status: {status}
    </div>
  );
}
```

## 🧪 Testing

### Test Structure
```
__tests__/
├── components/            # Component tests
│   ├── TodoList.test.tsx
│   ├── TodoForm.test.tsx
│   └── WalletConnect.test.tsx
├── hooks/                 # Hook tests
│   ├── useAuth.test.ts
│   ├── useTodos.test.ts
│   └── useWallet.test.ts
├── pages/                 # Page tests
│   ├── dashboard.test.tsx
│   └── login.test.tsx
├── utils/                 # Utility tests
│   ├── api.test.ts
│   └── blockchain.test.ts
└── e2e/                   # End-to-end tests
    ├── auth.spec.ts
    ├── todos.spec.ts
    └── wallet.spec.ts
```

### Unit Testing
```typescript
// Component testing with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoItem } from '@/components/TodoItem';

describe('TodoItem', () => {
  const mockTodo = {
    id: '1',
    title: 'Test Todo',
    completed: false,
    priority: 'medium',
  };

  it('renders todo item correctly', () => {
    render(<TodoItem todo={mockTodo} onUpdate={jest.fn()} onDelete={jest.fn()} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('calls onUpdate when checkbox is clicked', () => {
    const onUpdate = jest.fn();
    render(<TodoItem todo={mockTodo} onUpdate={onUpdate} onDelete={jest.fn()} />);
    
    fireEvent.click(screen.getByRole('checkbox'));
    
    expect(onUpdate).toHaveBeenCalledWith({
      ...mockTodo,
      completed: true,
    });
  });
});
```

### E2E Testing
```typescript
// Playwright E2E tests
import { test, expect } from '@playwright/test';

test.describe('Todo Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid=email]', 'test@example.com');
    await page.fill('[data-testid=password]', 'password');
    await page.click('[data-testid=login-button]');
    await page.waitForURL('/dashboard');
  });

  test('should create a new todo', async ({ page }) => {
    await page.click('[data-testid=create-todo-button]');
    await page.fill('[data-testid=todo-title]', 'New Test Todo');
    await page.fill('[data-testid=todo-description]', 'Test description');
    await page.click('[data-testid=submit-button]');

    await expect(page.locator('[data-testid=todo-item]')).toContainText('New Test Todo');
  });

  test('should connect wallet', async ({ page }) => {
    await page.click('[data-testid=connect-wallet-button]');
    await page.click('[data-testid=metamask-option]');
    
    // Mock wallet connection
    await page.evaluate(() => {
      window.ethereum = {
        request: () => Promise.resolve(['0x123...']),
        on: () => {},
      };
    });

    await expect(page.locator('[data-testid=wallet-address]')).toBeVisible();
  });
});
```

## 🚀 Deployment

### Build Configuration
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'api.todo-app.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
```

### Docker Deployment
```dockerfile
# Multi-stage build
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

### Static Export
```bash
# Build static export
pnpm build
pnpm export

# Deploy to CDN
aws s3 sync out/ s3://your-bucket-name --delete
```

## 📊 Performance Optimization

### Core Web Vitals
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Optimization Techniques
```typescript
// Image optimization
import Image from 'next/image';

<Image
  src="/hero-image.jpg"
  alt="Hero"
  width={800}
  height={600}
  priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// Dynamic imports for code splitting
import dynamic from 'next/dynamic';

const WalletModal = dynamic(() => import('@/components/WalletModal'), {
  loading: () => <Spinner />,
  ssr: false,
});

// Memoization for expensive calculations
import { useMemo } from 'react';

const ExpensiveComponent = ({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => expensiveCalculation(item));
  }, [data]);

  return <div>{processedData}</div>;
};
```

### Bundle Analysis
```bash
# Analyze bundle size
pnpm build
pnpm analyze

# View bundle analyzer report
open .next/analyze/client.html
```

## 🔧 Configuration

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 🚨 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules
pnpm install

# Check TypeScript errors
pnpm type-check
```

#### Runtime Errors
```bash
# Check browser console for errors
# Enable React DevTools for debugging

# Check API connectivity
curl http://localhost:3001/health
```

#### Wallet Connection Issues
```bash
# Check WalletConnect configuration
echo $NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

# Verify network configuration
# Check browser wallet extension
```

### Debug Mode
```bash
# Start in debug mode
NODE_OPTIONS='--inspect' pnpm dev

# Enable verbose logging
DEBUG=* pnpm dev
```

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WalletConnect Documentation](https://docs.walletconnect.com/)
- [Playwright Testing](https://playwright.dev/)

## 🤝 Contributing

1. Follow React and Next.js best practices
2. Write comprehensive tests for new components
3. Ensure accessibility compliance (WCAG 2.1 AA)
4. Use TypeScript for all new code
5. Follow the established component patterns
6. Update Storybook stories for new components

## 📄 License

This project is part of the Todo App monorepo. See the main project LICENSE file for details.