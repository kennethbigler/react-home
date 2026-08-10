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
import { bmr, other, snv, tb, type BotCScript } from "../constants/botc";
import {
  type ActiveScript,
  type BotCRole,
  BaseScript,
  type BaseScriptIndex,
} from "../jotai/botc-atom";
import ROLE_CATALOG, { getRoleBySlug } from "../constants/botc-slug-map";

const BASE_SCRIPTS: Record<BaseScriptIndex, BotCScript> = {
  [BaseScript.TB]: tb,
  [BaseScript.SNV]: snv,
  [BaseScript.BMR]: bmr,
  [BaseScript.Other]: other,
};

/** Map display name → normalized catalog slug (one entry per role name) */
const roleNameToSlug = new Map<string, string>(
  Object.entries(ROLE_CATALOG).map(([slug, { role }]) => [role.name, slug]),
);

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

/** Resolve the active script to its role lists (base or community). */
const resolveActiveScript = (script: ActiveScript): BotCScript => {
  if (script.type === "community") {
    return script.characters.length > 0
      ? buildScriptFromCharacters(script.characters)
      : other;
  }
  return BASE_SCRIPTS[script.index];
};

/** Demon slugs on the active script (base or community), in script order */
export const getScriptDemonSlugs = (script: ActiveScript): string[] => {
  const resolved = resolveActiveScript(script);
  return resolved.demons
    .map((role) => roleNameToSlug.get(role.name))
    .filter((slug): slug is string => slug !== undefined);
};

/**
 * Slugs whose misinfo tags apply to LiePie for the active script.
 * All non-demon roles on the script plus exactly one selected demon.
 */
export const getScriptMisinfoSlugs = (
  script: ActiveScript,
  selectedDemonSlug: string,
): string[] => {
  const resolved = resolveActiveScript(script);
  const demonSlugs = getScriptDemonSlugs(script);
  const demonSet = new Set(demonSlugs);

  const nonDemonSlugs = [
    ...resolved.townsfolk,
    ...resolved.outsiders,
    ...resolved.minions,
    ...resolved.travelers,
  ]
    .map((role) => roleNameToSlug.get(role.name))
    .filter((slug): slug is string => slug !== undefined);

  const slugs = [...new Set(nonDemonSlugs)];

  const demonSlug = demonSet.has(selectedDemonSlug)
    ? selectedDemonSlug
    : demonSlugs[0];

  if (demonSlug) {
    slugs.push(demonSlug);
  }

  return slugs;
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
