import { resolve } from 'path';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'common/index': resolve(__dirname, 'src/common/index.ts'),
        'blockchain/index': resolve(__dirname, 'src/blockchain/index.ts'),
        'ui/index': resolve(__dirname, 'src/ui/index.ts'),
        'ui/web/index': resolve(__dirname, 'src/ui/web/index.ts'),
        'ui/mobile/index': resolve(__dirname, 'src/ui/mobile/index.ts'),
        'testing/index': resolve(__dirname, 'src/testing/index.ts'),
        'api/index': resolve(__dirname, 'src/api/index.ts'),
        'logging/index': resolve(__dirname, 'src/logging/index.ts'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react-native',
        '@testing-library/react',
        '@testing-library/react-native',
        'winston',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
