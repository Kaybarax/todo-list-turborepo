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
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <Link href="/" className="text-xl font-semibold text-gray-900">
                    Todo App
                  </Link>
                  <nav className="flex space-x-4">
                    <Link
                      href="/"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Home
                    </Link>
                    <Link
                      href="/todos"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Todos
                    </Link>
                    <Link
                      href="/wallet"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Wallet
                    </Link>
                  </nav>
                </div>
              </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
};

export default RootLayout;
