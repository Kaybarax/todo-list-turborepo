import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { WalletProvider } from '../components/WalletProvider';
import { ThemeProvider } from '../components/theme/theme-provider';
import { ThemeSwitcher } from '../components/theme/ThemeSwitcher';
import { ToastProvider } from '@todo/ui-web';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo App - Blockchain Todo Management',
  description: 'A modern todo application with blockchain integration',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('daisyui-theme') || 'light';
                document.documentElement.setAttribute('data-theme', theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <WalletProvider>
            <div className="min-h-screen bg-base-200">
              <header className="navbar bg-base-100 shadow-sm border-b border-base-300">
                <div className="navbar-start">
                  <Link href="/" className="btn btn-ghost text-xl font-semibold">
                    Todo App
                  </Link>
                </div>
                <div className="navbar-center">
                  <ul className="menu menu-horizontal px-1">
                    <li>
                      <Link href="/" className="btn btn-ghost btn-sm">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link href="/todos" className="btn btn-ghost btn-sm">
                        Todos
                      </Link>
                    </li>
                    <li>
                      <Link href="/wallet" className="btn btn-ghost btn-sm">
                        Wallet
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="navbar-end">
                  <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                      Theme
                    </div>
                    <div className="dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                      <ThemeSwitcher />
                    </div>
                  </div>
                </div>
              </header>
              <main className="container mx-auto px-4 py-6 max-w-7xl">{children}</main>
              <ToastProvider />
            </div>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
