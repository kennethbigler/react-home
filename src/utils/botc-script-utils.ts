/**
 * Utilities for working with BotC community scripts sourced from botcscripts.com.
 *
 * The scripts JSON is loaded lazily (dynamic import) so it stays out of the
 * initial bundle. At 3+ MB it is large enough that deferring it noticeably
 * improves first-load performance.
 */
import { BotCScript } from "../constants/botc";
import { BotCRole, BuiltinScriptIndex } from "../jotai/botc-atom";
import { getRoleBySlug } from "../constants/botc-slug-map";

/** A community script entry as stored in botc-scripts.json */
export interface CommunityScript {
  pk: number;
  title: string;
  author: string;
  characters: string[];
}

/** A script option shown in the autocomplete selector */
export interface BuiltinScriptOption {
  type: "builtin";
  label: string;
  index: BuiltinScriptIndex;
}

export interface CommunityScriptOption {
  type: "community";
  label: string;
  pk: number;
  author: string;
  characters: string[];
}

export type ScriptOption = BuiltinScriptOption | CommunityScriptOption;

/** The 4 built-in script options (indices 0–3) */
export const BUILTIN_SCRIPT_OPTIONS: BuiltinScriptOption[] = [
  { type: "builtin", label: "Trouble Brewing", index: 0 },
  { type: "builtin", label: "Sects and Violets", index: 1 },
  { type: "builtin", label: "Bad Moon Rising", index: 2 },
  { type: "builtin", label: "Other (All Roles)", index: 3 },
];

/** Cached result so we only parse the JSON once per session */
let cachedOptions: ScriptOption[] | null = null;

/**
 * Lazily load all script options (builtin + community) for the autocomplete.
 * The community scripts JSON is fetched as a separate bundle chunk on first call
 * and cached in memory thereafter.
 */
export const loadAllScriptOptions = async (): Promise<ScriptOption[]> => {
  if (cachedOptions) return cachedOptions;

  const { default: data } = await import("../data/botc-scripts.json");
  const { scripts } = data as { scripts: CommunityScript[] };

  const communityOptions: CommunityScriptOption[] = scripts.map((s) => ({
    type: "community",
    label: s.title,
    pk: s.pk,
    author: s.author,
    characters: s.characters,
  }));

  cachedOptions = [...BUILTIN_SCRIPT_OPTIONS, ...communityOptions];
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

/** Get the display label for a built-in script index */
export const getBuiltinScriptLabel = (index: BuiltinScriptIndex): string =>
  BUILTIN_SCRIPT_OPTIONS.find((o) => o.index === index)?.label ??
  "Unknown Script";
