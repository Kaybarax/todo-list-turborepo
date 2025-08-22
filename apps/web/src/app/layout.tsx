import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { WalletProvider } from '@/components/WalletProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo App - Blockchain Todo Management',
  description: 'A modern todo application with blockchain integration',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        <WalletProvider>
          <div className="min-h-screen bg-base-200">
            <header className="navbar bg-base-100 shadow-sm border-b border-base-300">
              <div className="navbar-start">
                <Link href="/" className="btn btn-ghost text-xl font-semibold">
                  Todo App
                </Link>
              </div>
              <div className="navbar-end">
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
            </header>
            <main className="container mx-auto px-4 py-6 max-w-7xl">{children}</main>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
};

export default RootLayout;
