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
        'common/env': resolve(__dirname, 'src/common/env.ts'),
        'common/type-guards': resolve(__dirname, 'src/common/type-guards.ts'),
        'blockchain/index': resolve(__dirname, 'src/blockchain/index.ts'),
        'blockchain/errors': resolve(__dirname, 'src/blockchain/errors.ts'),
        'blockchain/monitoring': resolve(__dirname, 'src/blockchain/monitoring.ts'),
        'ui/index': resolve(__dirname, 'src/ui/index.ts'),
        'ui/web/index': resolve(__dirname, 'src/ui/web/index.ts'),
        'ui/web/tokens': resolve(__dirname, 'src/ui/web/tokens.ts'),
        'ui/web/a11y': resolve(__dirname, 'src/ui/web/a11y.ts'),
        'ui/mobile/index': resolve(__dirname, 'src/ui/mobile/index.ts'),
        'testing/index': resolve(__dirname, 'src/testing/index.ts'),
        'testing/api': resolve(__dirname, 'src/testing/api.ts'),
        'testing/mobile': resolve(__dirname, 'src/testing/mobile.ts'),
        'api/index': resolve(__dirname, 'src/api/index.ts'),
        'logging/index': resolve(__dirname, 'src/logging/index.ts'),
        'logging/winston': resolve(__dirname, 'src/logging/winston.ts'),
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
