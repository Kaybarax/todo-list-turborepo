/** @type {import('next').NextConfig} */
const nextConfig = {

  transpilePackages: ['@todo/ui-web', '@todo/services'],
  webpack: (config) => {
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
    domains: ['localhost'],
  },
};

module.exports = nextConfig;