// use test types instead of default types
/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // for lighthouse
  build: {
    sourcemap: true,
    target: "es2020",
    // Charts chunk is large but loaded only when visiting F1/Cars/Travel/Comp/Spades/BotC
    chunkSizeWarningLimit: 600000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Highcharts core only; keep @highcharts/react in main bundle so it shares the same
            // React instance (avoids "Cannot read properties of undefined (reading 'forwardRef')" in CI).
            if (id.includes("/highcharts/") && !id.includes("/@highcharts/react")) {
              return "charts";
            }
            if (
              id.includes("/react/") ||
              id.includes("/react-dom/") ||
              id.includes("/react-router")
            ) {
              return "react-vendor";
            }
          }
        }
      }
    }
  },
  plugins: [react()],
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
