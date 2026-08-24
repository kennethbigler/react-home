#!/usr/bin/env node
/**
 * Hydration-aware accessibility scan that waits for SPA route content before
 * running axe.
 *
 * github/accessibility-scanner@v3.4.1 navigates and scans immediately, which can
 * pass against the static "Loading…" shell. This script waits for route content
 * inside #main-content before analyzing each URL.
 *
 * Usage:
 *   node scripts/a11y-live-scan.mjs
 *   node scripts/a11y-live-scan.mjs --base-url http://localhost:5173
 *   npm run a11y:live-scan
 *   npm run a11y:local-scan
 */

import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const DEFAULT_BASE_URL = "https://www.kennethbigler.com";

const ROUTE_PATHS = [
  "/",
  "/work",
  "/resume",
  "/presentations",
  "/f1",
  "/cars",
  "/finances",
  "/travel",
  "/games",
  "/games/botc",
  "/games/murder",
  "/games/werewolf",
  "/games/bridge",
  "/games/imperial-assault",
  "/games/spades",
  "/games/types",
  "/games/blackjack",
  "/games/deal",
  "/games/poker",
  "/games/slots",
  "/games/yahtzee",
  "/games/connect4",
  "/games/tictactoe",
];

/** Every route renders a page heading after Suspense resolves. */
const WAIT_SELECTOR = "#main-content h1";
const HYDRATION_TIMEOUT_MS = 30_000;

function parseBaseUrl(argv) {
  const baseUrlIndex = argv.indexOf("--base-url");

  if (baseUrlIndex === -1) {
    return DEFAULT_BASE_URL;
  }

  const baseUrl = argv[baseUrlIndex + 1];

  if (!baseUrl) {
    throw new Error("Missing value for --base-url");
  }

  return baseUrl.replace(/\/+$/, "");
}

function buildUrls(baseUrl) {
  return ROUTE_PATHS.map((path) =>
    path === "/" ? `${baseUrl}/` : `${baseUrl}${path}`,
  );
}

async function scanUrl(page, url) {
  await page.goto(url, { waitUntil: "load" });
  await page
    .locator(WAIT_SELECTOR)
    .first()
    .waitFor({ state: "visible", timeout: HYDRATION_TIMEOUT_MS });

  return new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
}

async function main() {
  const baseUrl = parseBaseUrl(process.argv.slice(2));
  const urls = buildUrls(baseUrl);

  process.stdout.write(`Scanning ${urls.length} URLs at ${baseUrl}\n`);

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const failures = [];

  for (const url of urls) {
    process.stdout.write(`Scanning ${url}… `);

    try {
      const results = await scanUrl(page, url);
      const violations = results.violations ?? [];

      if (violations.length === 0) {
        process.stdout.write("ok\n");
        continue;
      }

      process.stdout.write(`${violations.length} violation(s)\n`);
      failures.push({ url, violations });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      process.stdout.write("failed\n");
      failures.push({ url, error: message });
    }
  }

  await context.close();
  await browser.close();

  if (failures.length === 0) {
    process.stdout.write(`\nAll ${urls.length} URLs passed.\n`);
    return;
  }

  process.stderr.write(`\nAccessibility scan failed for ${failures.length} URL(s):\n`);

  for (const failure of failures) {
    process.stderr.write(`\n${failure.url}\n`);

    if (failure.error) {
      process.stderr.write(`  Error: ${failure.error}\n`);
      continue;
    }

    for (const violation of failure.violations) {
      process.stderr.write(
        `  - ${violation.id}: ${violation.help} (${violation.impact})\n`,
      );
      for (const node of violation.nodes) {
        process.stderr.write(`      ${node.target.join(" > ")}\n`);
      }
    }
  }

  process.exit(1);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exit(1);
});
