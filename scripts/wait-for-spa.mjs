#!/usr/bin/env node
/**
 * Wait until each preview URL has a visible h1 (React has hydrated).
 * HTTP 200 on index.html is not enough for this SPA.
 *
 * Usage:
 *   PREVIEW_ORIGIN=http://127.0.0.1:4173 node scripts/wait-for-spa.mjs
 *   node scripts/wait-for-spa.mjs --print-urls
 */
import { pathToFileURL } from "node:url";

export const DEFAULT_PREVIEW_ORIGIN = "http://127.0.0.1:4173";

export const PREVIEW_PATHS = [
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

const H1_TIMEOUT_MS = 30_000;

export const previewUrls = (
  origin = process.env.PREVIEW_ORIGIN || DEFAULT_PREVIEW_ORIGIN,
  paths = PREVIEW_PATHS,
) => paths.map((path) => new URL(path, origin).href);

export const waitForSpa = async (
  urls,
  { timeout = H1_TIMEOUT_MS, launchBrowser } = {},
) => {
  let launch = launchBrowser;
  if (!launch) {
    const { chromium } = await new Function(
      "return import('playwright')",
    )();
    launch = chromium.launch.bind(chromium);
  }
  const browser = await launch();
  const page = await browser.newPage();
  try {
    for (const url of urls) {
      await page.goto(url, { waitUntil: "domcontentloaded" });
      await page.locator("h1").first().waitFor({
        state: "visible",
        timeout,
      });
      console.log(`Ready: ${url}`);
    }
  } finally {
    await browser.close();
  }
};

export const main = async (argv = process.argv.slice(2)) => {
  const urls = previewUrls();
  if (argv.includes("--print-urls")) {
    process.stdout.write(`${urls.join("\n")}\n`);
    return;
  }
  await waitForSpa(urls);
};

const isDirectRun =
  Boolean(process.argv[1]) &&
  pathToFileURL(process.argv[1]).href === import.meta.url;

if (isDirectRun) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
