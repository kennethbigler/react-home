import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: { sourcemap: true },
  plugins: [react()],
  server: { open: true },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/setupTests.ts'],
    coverage: {
      reporter: ['text', 'html', 'json'],
      include: ['src/**'],
      statements: 90,
      branches: 85,
      lines: 90,
      functions: 90
    },
  },
});
