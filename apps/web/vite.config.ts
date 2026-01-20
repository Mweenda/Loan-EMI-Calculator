import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
  },
  resolve: {
    alias: {
      '@lemic/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
});
