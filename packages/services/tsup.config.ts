import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: false, // Disable DTS generation to avoid memory issues
  splitting: false, // Disable splitting to reduce complexity
  sourcemap: false, // Disable sourcemaps to reduce memory usage
  clean: true,
  treeshake: true,
  minify: false,
  target: 'es2022',
  tsconfig: 'tsconfig.build.json',
  external: [
    // Mark blockchain dependencies as external to avoid bundling
    'ethers',
    '@solana/web3.js',
    '@polkadot/api',
    '@polkadot/util',
    '@polkadot/util-crypto',
    '@coral-xyz/anchor',
    // Other heavy dependencies
    'axios',
    'date-fns'
  ],
  esbuildOptions(options) {
    // Increase memory limit for esbuild
    options.define = {
      ...options.define,
      'process.env.NODE_ENV': '"production"'
    }
  }
})