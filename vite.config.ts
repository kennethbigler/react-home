import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Plugin } from "vite";
// eslint-disable-next-line import/no-unresolved
import { defineConfig } from "vitest/config";
// eslint-disable-next-line import/no-unresolved
import react from "@vitejs/plugin-react";

/** Async chart chunks — keep off modulepreload for non-chart routes. */
const CHART_CHUNK_PATTERN =
  /charts-core|charts-maps|charts-sankey|coreHighcharts|sankeyHighcharts|mapsHighcharts/;

/** Make main stylesheet non-render-blocking (Lighthouse: eliminate render-blocking resources). */
function deferStylesheetPlugin(): Plugin {
  return {
    name: "defer-stylesheet",
    apply: "build",
    closeBundle() {
      const outDir = "dist";
      const htmlPath = join(outDir, "index.html");
      let html = readFileSync(htmlPath, "utf-8");
      // Match Vite-injected stylesheet: <link rel="stylesheet" ... href="/assets/...css" ...>
      const linkRegex =
        /<link\s+rel="stylesheet"[^>]+href="(\/assets\/[^"]+\.css)"[^>]*\/?>/g;
      html = html.replace(linkRegex, (_match: string, href: string) => {
        return `<link rel="stylesheet" href="${href}" crossorigin media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="${href}" crossorigin></noscript>`;
      });
      writeFileSync(htmlPath, html);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  // for lighthouse
  build: {
    sourcemap: process.env.SOURCEMAPS !== "false",
    target: "es2020",
    // Prevent chart chunks from being preloaded on routes that do not use them.
    modulePreload: {
      resolveDependencies: (_filename, deps) =>
        deps.filter((dep) => !CHART_CHUNK_PATTERN.test(dep)),
    },
    // charts-core is large but loaded only when visiting F1/Cars/Travel/Comp/Spades/BotC
    chunkSizeWarningLimit: 600000,
    // Rolldown codeSplitting.groups (test regex) avoids manualChunks coupling React
    // into Highcharts chunks, which forced ~900 KiB of charts onto every page load.
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "react-vendor",
              test: /node_modules\/(react-dom|react-router|react)\//,
            },
            {
              name: "mui-vendor",
              test: /node_modules\/(@mui|@emotion)\//,
            },
            {
              name: "charts-maps",
              test: /node_modules\/highcharts\/.*highmaps/,
              includeDependenciesRecursively: false,
            },
            {
              name: "charts-sankey",
              test:
                /node_modules\/highcharts\/(highcharts-more|modules\/sankey)/,
              includeDependenciesRecursively: false,
            },
            {
              name: "charts-core",
              test: /node_modules\/highcharts\//,
              includeDependenciesRecursively: false,
            },
          ],
        },
      },
    },
  },
  plugins: [react(), deferStylesheetPlugin()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["src/setupTests.ts"],
    exclude: [
      "**/.claude/**",
      "**/.cursor/**",
      "**/.github/**",
      "**/node_modules/**",
    ],
    testTimeout: 45000, // Increased to 45s for CI with Highcharts-heavy components
    server: {
      deps: {
        inline: [/highcharts/],
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json"],
      include: ["src/**"],
      exclude: [
        "src/images/**",
        "src/.DS_Store",
        "src/index.css",
        "src/vite-env.d.ts",
        "src/@types/**",
        "**/types.ts",
        "**/index.ts",
      ],
      thresholds: {
        statements: 85,
        branches: 80,
        functions: 85,
        lines: 85,
      },
    },
    chaiConfig: {
      truncateThreshold: 0,
    },
  },
});
