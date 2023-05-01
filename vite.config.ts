import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { open: true },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/setupTests.ts'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'src/setupTests.ts'
      ],
      statements: 90,
      branches: 85,
      lines: 90,
      functions: 90
    },
  },
})
