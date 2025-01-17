// use test types instead of default types
/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // for lighthouse
  build: { sourcemap: true },
  plugins: [react()],
  // test configs
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["src/setupTests.ts"],
    testTimeout: 7000,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json"],
      include: ["src/**"],
      thresholds: {
        statements: 90,
        branches: 85,
        lines: 90,
        functions: 80,
      },
    },
    chaiConfig: {
      truncateThreshold: 0,
    },
  },
});
