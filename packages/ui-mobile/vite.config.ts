import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['lib/**/*'],
      exclude: ['lib/**/*.stories.tsx', 'lib/**/*.test.tsx'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name: 'TodoUIMobile',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'react', 
        'react-native', 
        'react-native-vector-icons',
        'react-native-vector-icons/MaterialIcons',
        'react-native-vector-icons/FontAwesome',
        'react-native-vector-icons/Ionicons',
      ],
      output: {
        globals: {
          react: 'React',
          'react-native': 'ReactNative',
          'react-native-vector-icons': 'ReactNativeVectorIcons',
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./__tests__/setup.ts'],
  },
});