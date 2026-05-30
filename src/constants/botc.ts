/**
 * BotC script definitions.
 *
 * Role data lives exclusively in botc-slug-map.ts. This file composes that
 * data into the named scripts (TB, S&V, BMR, Other) using slug lookups,
 * so there is no duplication between the two files.
 *
 * latest characters found here: https://wiki.bloodontheclocktower.com/Changelog
 */
import { BotCRole } from "../jotai/botc-atom";
import ROLE_CATALOG, { getRoleBySlug } from "./botc-slug-map";

export interface BotCScript {
  townsfolk: BotCRole[];
  outsiders: BotCRole[];
  minions: BotCRole[];
  demons: BotCRole[];
  travelers: BotCRole[];
}

/** Convenience: look up a role by slug for script composition */
const r = (slug: string): BotCRole => getRoleBySlug(slug).role;

// ── Official Scripts ──────────────────────────────────────────────────────────

export const tb: BotCScript = {
  townsfolk: [
    r("washerwoman"),
    r("monk"),
    r("librarian"),
    r("ravenkeeper"),
    r("investigator"),
    r("virgin"),
    r("chef"),
    r("slayer"),
    r("empath"),
    r("soldier"),
    r("fortuneteller"),
    r("mayor"),
    r("undertaker"),
  ],
  outsiders: [r("butler"), r("recluse"), r("drunk"), r("saint")],
  minions: [r("poisoner"), r("baron"), r("spy"), r("scarletwoman")],
  demons: [r("imp")],
  travelers: [
    r("thief"),
    r("bureaucrat"),
    r("gunslinger"),
    r("scapegoat"),
    r("beggar"),
  ],
};

export const snv: BotCScript = {
  townsfolk: [
    r("clockmaker"),
    r("savant"),
    r("dreamer"),
    r("seamstress"),
    r("snakecharmer"),
    r("philosopher"),
    r("mathematician"),
    r("artist"),
    r("flowergirl"),
    r("juggler"),
    r("towncrier"),
    r("sage"),
    r("oracle"),
  ],
  outsiders: [r("mutant"), r("sweetheart"), r("barber"), r("klutz")],
  minions: [r("witch"), r("pithag"), r("cerenovus"), r("eviltwin")],
  demons: [r("fanggu"), r("nodashii"), r("vigormortis"), r("vortox")],
  travelers: [
    r("barista"),
    r("harlot"),
    r("butcher"),
    r("deviant"),
    r("bonecollector"),
    r("gangster"),
  ],
};

export const bmr: BotCScript = {
  townsfolk: [
    r("grandmother"),
    r("gossip"),
    r("sailor"),
    r("courtier"),
    r("chambermaid"),
    r("professor"),
    r("exorcist"),
    r("minstrel"),
    r("innkeeper"),
    r("tealady"),
    r("gambler"),
    r("pacifist"),
    r("fool"),
  ],
  outsiders: [r("goon"), r("tinker"), r("lunatic"), r("moonchild")],
  minions: [
    r("godfather"),
    r("assassin"),
    r("devilsadvocate"),
    r("mastermind"),
  ],
  demons: [r("zombuul"), r("shabaloth"), r("pukka"), r("po")],
  travelers: [
    r("apprentice"),
    r("matron"),
    r("judge"),
    r("voudon"),
    r("bishop"),
  ],
};

/**
 * "Other" — all known official roles, derived directly from the role catalog.
 * This is the fallback script shown when no specific script is selected.
 * Roles are grouped alphabetically within each category (catalog insertion order).
 */
export const other: BotCScript = (() => {
  const script: BotCScript = {
    townsfolk: [],
    outsiders: [],
    minions: [],
    demons: [],
    travelers: [],
  };
  Object.values(ROLE_CATALOG).forEach(({ role, roleType }) => {
    (script[roleType] as BotCRole[]).push(role);
  });
  return script;
})();

// ── Player Distribution ───────────────────────────────────────────────────────

/** "TOWNSFOLK, OUTSIDERS, MINIONS, DEMONS" counts for each player count 5–15 */
export const playerDist = [
  "",
  "",
  "",
  "",
  "",
  "3, 0, 1, 1",
  "3, 1, 1, 1",
  "5, 0, 1, 1",
  "5, 1, 1, 1",
  "5, 2, 1, 1",
  "7, 0, 2, 1",
  "7, 1, 2, 1",
  "7, 2, 2, 1",
  "9, 0, 3, 1",
  "9, 1, 3, 1",
  "9, 2, 3, 1",
];
