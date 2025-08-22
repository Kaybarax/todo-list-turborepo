import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="hero min-h-96 bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-base-content mb-4">Welcome to Todo App</h1>
          <p className="text-lg text-base-content/70 mb-8">A modern todo application with blockchain integration</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/todos" className="btn btn-primary">
              View Todos
            </Link>
            <Link href="/wallet" className="btn btn-secondary">
              Connect Wallet
            </Link>
          </div>
          <div className="grid gap-4 mt-8">
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body">
                <h3 className="card-title text-base-content">Blockchain Storage</h3>
                <p className="text-base-content/70">
                  Store your todos on blockchain networks for decentralized, immutable, and censorship-resistant
                  storage.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body">
                <h3 className="card-title text-base-content">Multi-Network Support</h3>
                <p className="text-base-content/70">
                  Choose from Solana, Polkadot, Polygon, Moonbeam, or Base networks based on your preferences for speed,
                  cost, and features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
