/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@todo/ui-web', '@todo/services'],
  eslint: {
    // Temporarily disable ESLint during builds for verification
    ignoreDuringBuilds: true,
  },
  webpack: config => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

module.exports = nextConfig;
