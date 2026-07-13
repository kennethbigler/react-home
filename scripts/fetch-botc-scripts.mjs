#!/usr/bin/env node
/**
 * Fetches ALL BotC community scripts from botcscripts.com (paginated API) and
 * saves them to src/data/botc-scripts.json for use in the script selector.
 *
 * When botcscripts.com is unreachable (e.g. blocked by a corporate proxy), falls
 * back to the botc-tools public mirror, then to the existing cached file.
 *
 * Based on the same approach used by botc-tools (github.com/tchajed/botc-tools).
 *
 * Usage: node scripts/fetch-botc-scripts.mjs
 *   or:  npm run fetch-botc-scripts
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, "../src/data/botc-scripts.json");
const API_BASE = "https://botcscripts.com/api/scripts/";
const MIRROR_URL = "https://botc-tools.xyz/scripts.json";
const USER_AGENT = "react-home/5.0.0 (https://github.com/kennethbigler/react-home; +https://kennethbigler.com)";

const DEFAULT_HEADERS = {
  Accept: "application/json",
  "User-Agent": USER_AGENT,
};

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

/** Parse a botc-tools.xyz script entry (already has slug arrays). */
function parseMirrorScript(raw) {
  return {
    pk: raw.pk,
    title: raw.title ?? "",
    author: raw.author ?? "",
    characters: (raw.characters ?? []).map((slug) => slug.toLowerCase()),
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

function isBlockedResponse(status, body) {
  return status === 403 && /zscaler|access denied|forbidden/i.test(body);
}

async function fetchJson(url, init = {}) {
  const resp = await fetch(url, {
    ...init,
    headers: { ...DEFAULT_HEADERS, ...init.headers },
  });
  const body = await resp.text();
  if (!resp.ok) {
    const blocked = isBlockedResponse(resp.status, body);
    const detail = blocked
      ? "network proxy blocked botcscripts.com (Zscaler or similar)"
      : `HTTP ${resp.status}`;
    throw new Error(`${detail}: ${url}`);
  }

  try {
    return JSON.parse(body);
  } catch {
    throw new Error(`invalid JSON from ${url}`);
  }
}

async function fetchPage(page) {
  const url = `${API_BASE}?format=json&page=${page}`;
  return fetchJson(url);
}

async function fetchFromApi() {
  const allScripts = [];

  console.log("Fetching page 1 from botcscripts.com...");
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

async function fetchFromMirror() {
  console.log("Falling back to botc-tools.xyz mirror...");
  const data = await fetchJson(MIRROR_URL);
  if (!Array.isArray(data.scripts)) {
    throw new Error(`unexpected mirror format from ${MIRROR_URL}`);
  }

  const scripts = data.scripts.map(parseMirrorScript);
  scripts.sort((a, b) => b.pk - a.pk);
  if (data.lastUpdate) {
    console.log(`  mirror last updated ${data.lastUpdate}`);
  }
  return scripts;
}

function loadCachedScripts() {
  if (!existsSync(OUTPUT_PATH)) {
    return null;
  }

  const cached = JSON.parse(readFileSync(OUTPUT_PATH, "utf-8"));
  if (!Array.isArray(cached.scripts) || cached.scripts.length === 0) {
    return null;
  }

  return cached;
}

function keepCachedScripts(cached, reason) {
  console.log(`✓ Keeping existing cached scripts (${cached.scripts.length} scripts, ${cached.slugs.length} slugs)`);
  console.log(`  ${reason}`);
  console.log("  Deploy will continue with the last successfully fetched data.");
}

function saveScripts(scripts, source) {
  const output = encodeCompact(scripts);
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 0), "utf-8");
  console.log(`✓ Saved ${scripts.length} scripts from ${source} to src/data/botc-scripts.json (${output.slugs.length} unique slugs)`);

  const swpm = scripts.find((s) => s.pk === 6506);
  if (swpm) {
    console.log(`✓ Found "The Spy Who Pinged Me" (pk ${swpm.pk}) by ${swpm.author}`);
  } else {
    console.log(`ℹ "The Spy Who Pinged Me" (pk 6506) not found — it may have a different pk on botcscripts.com`);
  }
}

console.log("Fetching all BotC community scripts...");

try {
  const scripts = await fetchFromApi();
  saveScripts(scripts, "botcscripts.com");
} catch (apiErr) {
  console.warn(`⚠ botcscripts.com unavailable: ${apiErr.message}`);
  const cached = loadCachedScripts();

  try {
    const scripts = await fetchFromMirror();
    if (cached && cached.scripts.length > scripts.length) {
      keepCachedScripts(
        cached,
        `Cached copy is newer than the mirror (${cached.scripts.length} vs ${scripts.length} scripts).`,
      );
      process.exit(0);
    }

    saveScripts(scripts, "botc-tools.xyz");
  } catch (mirrorErr) {
    console.warn(`⚠ mirror unavailable: ${mirrorErr.message}`);

    if (cached) {
      keepCachedScripts(cached, "Using cached copy because live sources are unavailable.");
      process.exit(0);
    }

    console.error("✗ Failed to fetch scripts and no cached copy exists.");
    process.exit(1);
  }
}
