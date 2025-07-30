import Link from 'next/link';
import { Button } from '@todo/ui-web';

export default function HomePage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Welcome to Todo App
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          A modern todo application with blockchain integration. Manage your tasks
          and store them securely on Solana, Polkadot, or Polygon networks.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild>
            <Link href="/todos">
              Get started
            </Link>
          </Button>
          <Button variant="link" asChild>
            <Link href="/wallet">
              Connect Wallet <span aria-hidden="true">→</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Traditional Storage
            </h3>
            <p className="text-gray-600">
              Store your todos in our secure database with fast access and
              synchronization across devices.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Blockchain Storage
            </h3>
            <p className="text-gray-600">
              Store your todos on blockchain networks for decentralized,
              immutable, and censorship-resistant storage.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Multi-Network Support
            </h3>
            <p className="text-gray-600">
              Choose from Solana, Polkadot, or Polygon networks based on your
              preferences for speed, cost, and features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}