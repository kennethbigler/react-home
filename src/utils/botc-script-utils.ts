/**
 * Utilities for working with BotC community scripts sourced from botcscripts.com.
 *
 * The scripts JSON is loaded lazily (dynamic import) so it stays out of the
 * initial bundle. It is stored in a compact encoded format:
 *   - `slugs`: sorted string[] dictionary (index = integer id)
 *   - `scripts[].c`: character ids (integers) instead of slug strings
 *   - Short key names: p=pk, t=title, a=author, c=characters
 * Decoding happens once in loadAllScriptOptions and is cached.
 */
import { BotCScript } from "../constants/botc";
import { BotCRole, BaseScript, BaseScriptIndex } from "../jotai/botc-atom";
import { getRoleBySlug } from "../constants/botc-slug-map";

/** Compact encoded entry as stored in botc-scripts.json */
interface EncodedScript {
  p: number;
  t: string;
  a: string;
  c: number[];
}

/** A script option shown in the autocomplete selector */
export interface BaseScriptOption {
  type: "base";
  label: string;
  index: BaseScriptIndex;
}

export interface CommunityScriptOption {
  type: "community";
  label: string;
  pk: number;
  author: string;
  characters: string[];
}

export type ScriptOption = BaseScriptOption | CommunityScriptOption;

/** The 4 base script options */
export const BASE_SCRIPT_OPTIONS: BaseScriptOption[] = [
  {
    type: "base",
    label: "Trouble Brewing",
    index: BaseScript.TB,
  },
  {
    type: "base",
    label: "Sects and Violets",
    index: BaseScript.SNV,
  },
  {
    type: "base",
    label: "Bad Moon Rising",
    index: BaseScript.BMR,
  },
  { type: "base", label: "Other (All Roles)", index: BaseScript.Other },
];

/** Cached result so we only parse the JSON once per session */
let cachedOptions: ScriptOption[] | null = null;

/** Reset the cache — intended for use in tests only */
export const resetScriptOptionsCache = () => {
  cachedOptions = null;
};

/**
 * Lazily load all script options (base + community) for the autocomplete.
 * The community scripts JSON is fetched as a separate bundle chunk on first call
 * and cached in memory thereafter.
 */
export const loadAllScriptOptions = async (): Promise<ScriptOption[]> => {
  if (cachedOptions) return cachedOptions;

  const { default: data } = await import("../data/botc-scripts.json");
  const { slugs, scripts } = data as {
    slugs: string[];
    scripts: EncodedScript[];
  };

  const communityOptions: CommunityScriptOption[] = scripts.map((s) => ({
    type: "community",
    label: s.t,
    pk: s.p,
    author: s.a,
    characters: s.c.map((id) => slugs[id]),
  }));

  cachedOptions = [...BASE_SCRIPT_OPTIONS, ...communityOptions];
  return cachedOptions;
};

/**
 * Convert a flat list of botcscripts.com character slugs into a categorised BotCScript.
 *
 * - Known official roles are placed in their correct category.
 * - Unknown/homebrew roles are shown as placeholders in the Townsfolk section so
 *   players can see they exist, even if we can't categorise them.
 * - Duplicate role names within a category are deduplicated.
 */
export const buildScriptFromCharacters = (characters: string[]): BotCScript => {
  const script: BotCScript = {
    townsfolk: [],
    outsiders: [],
    minions: [],
    demons: [],
    travelers: [],
  };

  const seenNames = new Set<string>();

  for (const slug of characters) {
    const entry = getRoleBySlug(slug);
    const { role, roleType } = entry;

    // Deduplicate: same display name within the same category won't appear twice
    const dedupeKey = `${roleType}:${role.name}`;
    if (seenNames.has(dedupeKey)) continue;
    seenNames.add(dedupeKey);

    (script[roleType] as BotCRole[]).push(role);
  }

  return script;
};

/** O(1) lookup map from BaseScriptIndex → display label */
const BASE_SCRIPT_LABELS: Record<BaseScriptIndex, string> = Object.fromEntries(
  BASE_SCRIPT_OPTIONS.map((o) => [o.index, o.label]),
) as Record<BaseScriptIndex, string>;

/** Get the display label for a base script index */
export const getBaseScriptLabel = (index: BaseScriptIndex): string =>
  BASE_SCRIPT_LABELS[index] ?? "Unknown Script";
