// use test types instead of default types
/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // for lighthouse
  build: { 
    sourcemap: true,
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material'],
          'charts': ['highcharts', '@highcharts/react'],
        },
      },
    },
  },
  plugins: [react()],
  // test configs
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["src/setupTests.ts"],
    testTimeout: 45000, // Increased to 45s for CI with Highcharts-heavy components
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json"],
      include: ["src/**"],
      exclude: ["src/images/**", "src/.DS_Store", "src/index.css", "src/vite-env.d.ts", "src/@types/**", "**/types.ts", "**/index.ts"],
      thresholds: {
        statements: 85,
        branches: 81,
        functions: 85,
        lines: 85,
      },
    },
    chaiConfig: {
      truncateThreshold: 0,
    },
  },
});
