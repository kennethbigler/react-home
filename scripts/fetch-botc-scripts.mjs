#!/usr/bin/env node
/**
 * Fetches ALL BotC community scripts from botcscripts.com (paginated API) and
 * saves them to src/data/botc-scripts.json for use in the script selector.
 *
 * Based on the same approach used by botc-tools (github.com/tchajed/botc-tools).
 *
 * Usage: node scripts/fetch-botc-scripts.mjs
 *   or:  npm run fetch-botc-scripts
 */

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, "../src/data/botc-scripts.json");
const API_BASE = "https://botcscripts.com/api/scripts/";

/**
 * Parse a botcscripts.com ScriptInstanceResp into a raw script object.
 * Each script's content array contains rows like:
 *   { "id": "washerwoman" }        ← a character
 *   { "id": "_meta", "name": ..., "author": ... } ← metadata (skip)
 */
function parseScript(raw) {
  const characters = (raw.content ?? [])
    .map((c) => c.id.toLowerCase())
    .filter((id) => id !== "_meta");

  // score is intentionally omitted — we don't use it and excluding it keeps the file smaller
  return {
    pk: raw.pk,
    title: raw.name ?? "",
    author: raw.author ?? "",
    characters,
  };
}

/**
 * Encode scripts into a compact format:
 * - Build a sorted slug dictionary (slugs array, index = integer id)
 * - Replace each script's characters string[] with an integer id[]
 * - Shorten key names: pk→p, title→t, author→a, characters→c
 *
 * This cuts the file size by ~65% — the characters arrays dominate the payload
 * and average slug length is ~8 chars vs ~2 chars for a 2-digit integer.
 */
function encodeCompact(scripts) {
  const slugSet = new Set(scripts.flatMap((s) => s.characters));
  const slugs = [...slugSet].sort();
  const slugToId = Object.fromEntries(slugs.map((slug, i) => [slug, i]));

  const encoded = scripts.map(({ pk, title, author, characters }) => ({
    p: pk,
    t: title,
    a: author,
    c: characters.map((slug) => slugToId[slug]),
  }));

  return { slugs, scripts: encoded };
}

async function fetchPage(page) {
  const url = `${API_BASE}?format=json&page=${page}`;
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status} fetching page ${page}: ${url}`);
  }
  return resp.json();
}

async function fetchAllScripts() {
  const allScripts = [];

  console.log("Fetching page 1...");
  const firstPage = await fetchPage(1);
  const { count, results } = firstPage;
  allScripts.push(...results.map(parseScript));

  if (!firstPage.next) {
    return allScripts;
  }

  const pageSize = results.length;
  const totalPages = Math.ceil(count / pageSize);
  console.log(`${count} scripts across ${totalPages} pages — fetching...`);

  // Fetch remaining pages in small concurrent batches to be polite to the server
  const BATCH_SIZE = 4;
  for (let batch = 2; batch <= totalPages; batch += BATCH_SIZE) {
    const batchPages = [];
    for (let p = batch; p < batch + BATCH_SIZE && p <= totalPages; p++) {
      batchPages.push(p);
    }
    const batchResults = await Promise.all(batchPages.map(fetchPage));
    for (const page of batchResults) {
      allScripts.push(...page.results.map(parseScript));
    }
    console.log(`  fetched up to page ${Math.min(batch + BATCH_SIZE - 1, totalPages)} / ${totalPages}`);
  }

  // Sort descending by pk to match botc-tools convention
  allScripts.sort((a, b) => b.pk - a.pk);
  return allScripts;
}

console.log(`Fetching all BotC scripts from botcscripts.com...`);

try {
  const scripts = await fetchAllScripts();
  const output = encodeCompact(scripts);
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 0), "utf-8");
  console.log(`✓ Saved ${scripts.length} scripts to src/data/botc-scripts.json (${output.slugs.length} unique slugs)`);
  // Confirm SWPM is present
  const swpm = scripts.find((s) => s.pk === 6506);
  if (swpm) {
    console.log(`✓ Found "The Spy Who Pinged Me" (pk ${swpm.pk}) by ${swpm.author}`);
  } else {
    console.log(`ℹ "The Spy Who Pinged Me" (pk 6506) not found — it may have a different pk on botcscripts.com`);
  }
} catch (err) {
  console.error("✗ Failed to fetch scripts:", err.message);
  process.exit(1);
}
