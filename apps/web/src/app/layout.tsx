import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { WalletProvider } from '../components/WalletProvider';
import { ThemeProvider } from '../components/theme/theme-provider';
import { ThemeSwitcher } from '../components/theme/ThemeSwitcher';
import { ToastProvider, Navbar } from '@todo/ui-web';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo App - Blockchain Todo Management',
  description: 'A modern todo application with blockchain integration',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning data-theme="light">
      <body className={inter.className}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('daisyui-theme') || 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
        <ThemeProvider>
          <WalletProvider>
            <div className="min-h-screen bg-base-200">
              <Navbar shadow="lg" className="px-4" variant="default">
                <div className="flex-1 gap-2">
                  <Link href="/" className="btn btn-ghost text-xl font-bold normal-case">
                    Todo App
                  </Link>
                  {/* Desktop Menu - Hidden on mobile */}
                  <ul className="menu menu-horizontal gap-6 hidden lg:flex items-center">
                    <li>
                      <Link href="/">Home</Link>
                    </li>
                    <li>
                      <Link href="/todos">Todos</Link>
                    </li>
                    <li>
                      <Link href="/wallet">Wallet</Link>
                    </li>
                    <li>
                      <ThemeSwitcher variant="select" showLabel={false} size="sm" />
                    </li>
                  </ul>
                </div>
                <div className="flex-none gap-2">
                  {/* Theme Switcher moved into desktop menu; keep only for mobile */}
                  <div className="dropdown dropdown-end lg:hidden">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                        />
                      </svg>
                      <span className="hidden sm:inline">Theme</span>
                    </div>
                    <div className="dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-2">
                      <ThemeSwitcher />
                    </div>
                  </div>
                  {/* Mobile Menu - Hamburger */}
                  <div className="dropdown dropdown-end lg:hidden">
                    <div tabIndex={0} title="Mobile Menu" role="button" className="btn btn-ghost btn-square">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </div>
                    <ul
                      tabIndex={0}
                      className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                    >
                      <li>
                        <Link href="/">Home</Link>
                      </li>
                      <li>
                        <Link href="/todos">Todos</Link>
                      </li>
                      <li>
                        <Link href="/wallet">Wallet</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </Navbar>
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
