import { playerDist } from "@/constants/botc";
import type { ActiveScript } from "@/jotai/botc-atom";
import {
  MISINFO,
  getMisinfoForSlug,
  getRoleBySlug,
  type MisinfoTag,
} from "@/constants/botc-slug-map";
import {
  getScriptDemonSlugs,
  getScriptMisinfoSlugs,
} from "@/utils/botc-script-utils";

/** Pre-parsed playerDist: [townsfolk, outsiders, minions, demons] per player count */
const PLAYER_DIST_PARSED: [number, number, number, number][] = playerDist.map(
  (s) => {
    if (!s) return [0, 0, 0, 0];
    const [tf, out, min, dem] = s.split(",").map(Number);
    return [tf, out, min, dem];
  },
);

export interface LieSeriesPoint {
  name: string;
  y: number;
  roles?: string[];
}

interface MisinfoCounts {
  drunk: number;
  poison: number;
  madness: number;
}

interface MisinfoRoleLists {
  evil: string[];
  drunk: string[];
  poison: string[];
  madness: string[];
}

/**
 * Split the unknown pool into 🤥 vs ✅.
 * A pool of 1 is treated as truthful (✅) rather than lying (🤥).
 */
export const resolveLieAndTrueCounts = (
  pool: number,
): { numLie: number; numTrue: number } => {
  if (pool === 1) {
    return { numLie: 0, numTrue: 1 };
  }

  const numLie = Math.max(0, Math.ceil(0.2 * pool));
  const numTrue = Math.max(0, pool - numLie);
  return { numLie, numTrue };
};

/** Oxford-comma list for LiePie tooltips, e.g. "Sailor, Philosopher, and Drunk". */
export const formatRoleList = (roles: string[]): string | undefined => {
  if (roles.length === 0) {
    return undefined;
  }
  if (roles.length === 1) {
    return roles[0];
  }
  if (roles.length === 2) {
    return `${roles[0]} and ${roles[1]}`;
  }
  return `${roles.slice(0, -1).join(", ")}, and ${roles[roles.length - 1]}`;
};

const roleNameForSlug = (slug: string): string => getRoleBySlug(slug).role.name;

const pushRole = (list: string[], slug: string, times = 1): void => {
  const name = roleNameForSlug(slug);
  for (let i = 0; i < times; i += 1) {
    list.push(name);
  }
};

const VORTOX_SLUG = "vortox";
const LEGION_SLUG = "legion";
const VIGORMORTIS_SLUG = "vigormortis";

const vigormortisPoisonCount = (numPlayers: number): number => {
  const [, , minions] = PLAYER_DIST_PARSED[numPlayers];
  return Math.ceil(minions / 2);
};

/** Good/evil slot swap: townsfolk + outsiders − minions − demons */
const legionEvilMisinfo = (numPlayers: number): number => {
  const [townsfolk, outsiders, minions, demons] =
    PLAYER_DIST_PARSED[numPlayers];
  return Math.max(0, townsfolk + outsiders - minions - demons);
};

const addMisinfoTag = (
  tag: MisinfoTag,
  slug: string,
  counts: MisinfoCounts & { numEvil: number },
  roles: MisinfoRoleLists,
): void => {
  switch (tag) {
    case MISINFO.Evil:
      counts.numEvil += 1;
      pushRole(roles.evil, slug);
      break;
    case MISINFO.Drunk:
      counts.drunk += 1;
      pushRole(roles.drunk, slug);
      break;
    case MISINFO.Poison:
      counts.poison += 1;
      pushRole(roles.poison, slug);
      break;
    case MISINFO.Madness:
      counts.madness += 1;
      pushRole(roles.madness, slug);
      break;
    default:
      break;
  }
};

const sumMisinfoFromSlugs = (
  slugs: string[],
  numPlayers: number,
): { numEvil: number } & MisinfoCounts & { roles: MisinfoRoleLists } => {
  const counts = {
    numEvil: 0,
    drunk: 0,
    poison: 0,
    madness: 0,
  };
  const roles: MisinfoRoleLists = {
    evil: [],
    drunk: [],
    poison: [],
    madness: [],
  };
  const [townsfolk] = PLAYER_DIST_PARSED[numPlayers];

  for (const slug of slugs) {
    if (slug === VORTOX_SLUG) {
      counts.poison += townsfolk;
      pushRole(roles.poison, slug);
      continue;
    }

    if (slug === LEGION_SLUG) {
      const legionEvil = legionEvilMisinfo(numPlayers);
      counts.numEvil += legionEvil;
      pushRole(roles.evil, slug, legionEvil);
      continue;
    }

    if (slug === VIGORMORTIS_SLUG) {
      const vigorPoison = vigormortisPoisonCount(numPlayers);
      counts.poison += vigorPoison;
      pushRole(roles.poison, slug, vigorPoison);
      continue;
    }

    const tags = getMisinfoForSlug(slug);
    if (!tags) continue;

    for (const tag of tags) {
      addMisinfoTag(tag, slug, counts, roles);
    }
  }

  return { ...counts, roles };
};

/** Max combined evil + misinfo bodies: all in-play slots plus travelers */
const maxEvilMisinfoBodies = (
  numPlayers: number,
  numTravelers: number,
): number => numPlayers + numTravelers;

/** Trim misinfo (drunk, poison, madness) before evil so totals stay within the body cap */
const capEvilAndMisinfo = (
  numEvil: number,
  misinfo: MisinfoCounts,
  maxTotal: number,
): { numEvil: number } & MisinfoCounts => {
  let { drunk, poison, madness } = misinfo;
  let evil = numEvil;
  const misinfoTotal = drunk + poison + madness;

  if (evil + misinfoTotal <= maxTotal) {
    return { numEvil: evil, drunk, poison, madness };
  }

  let excess = evil + misinfoTotal - maxTotal;

  const drunkCut = Math.min(drunk, excess);
  drunk -= drunkCut;
  excess -= drunkCut;

  const poisonCut = Math.min(poison, excess);
  poison -= poisonCut;
  excess -= poisonCut;

  const madnessCut = Math.min(madness, excess);
  madness -= madnessCut;
  excess -= madnessCut;

  evil -= excess;

  return {
    numEvil: Math.max(0, evil),
    drunk: Math.max(0, drunk),
    poison: Math.max(0, poison),
    madness: Math.max(0, madness),
  };
};

/** Split column-major script order into left/right columns for 2-col layout */
export const splitScriptColumns = <T>(items: T[]): [T[], T[]] => {
  const mid = Math.ceil(items.length / 2);
  return [items.slice(0, mid), items.slice(mid)];
};

export const getGridSize = (pc: number, i: number) => {
  if (i < 3 || (pc % 2 === 0 && i >= pc - 3)) {
    return 4;
  } else if (pc % 2 === 1 && i >= pc - 2) {
    return 6;
  }
  return 5;
};

export const getLieSeries = (
  numPlayers: number,
  numTravelers: number,
  script: ActiveScript,
  selectedDemonSlug?: string,
): LieSeriesPoint[] => {
  const [, , minions, demons] = PLAYER_DIST_PARSED[numPlayers];
  let numEvil: number = minions + demons;

  if (numTravelers >= 3) {
    numEvil += 2; // Evil Travelers
  } else if (numTravelers > 0) {
    numEvil += 1; // Evil Traveler
  }

  let misinfo: MisinfoCounts = {
    drunk: numTravelers >= 4 ? 1 : 0,
    poison: 0,
    madness: 0,
  };
  const roleLists: MisinfoRoleLists = {
    evil: [],
    drunk: numTravelers >= 4 ? ["Drunk traveler"] : [],
    poison: [],
    madness: [],
  };

  if (numTravelers >= 3) {
    roleLists.evil.push("Evil travelers");
  } else if (numTravelers > 0) {
    roleLists.evil.push("Evil traveler");
  }

  if (minions + demons > 0) {
    roleLists.evil.push("Minions & demon");
  }

  const demonSlug = selectedDemonSlug ?? getScriptDemonSlugs(script)[0] ?? "";
  const scriptMisinfo = sumMisinfoFromSlugs(
    getScriptMisinfoSlugs(script, demonSlug),
    numPlayers,
  );
  numEvil += scriptMisinfo.numEvil;
  misinfo.drunk += scriptMisinfo.drunk;
  misinfo.poison += scriptMisinfo.poison;
  misinfo.madness += scriptMisinfo.madness;
  roleLists.evil.push(...scriptMisinfo.roles.evil);
  roleLists.drunk.push(...scriptMisinfo.roles.drunk);
  roleLists.poison.push(...scriptMisinfo.roles.poison);
  roleLists.madness.push(...scriptMisinfo.roles.madness);

  const { numEvil: cappedEvil, ...cappedMisinfo } = capEvilAndMisinfo(
    numEvil,
    misinfo,
    maxEvilMisinfoBodies(numPlayers, numTravelers),
  );
  numEvil = cappedEvil;
  misinfo = cappedMisinfo;

  const numMisinfo = misinfo.drunk + misinfo.poison + misinfo.madness;
  const unknownPool = Math.max(
    0,
    numPlayers + numTravelers - numEvil - numMisinfo,
  );
  const { numLie, numTrue } = resolveLieAndTrueCounts(unknownPool);

  return [
    { name: "😈", y: numEvil, roles: roleLists.evil },
    { name: MISINFO.Poison, y: misinfo.poison, roles: roleLists.poison },
    { name: MISINFO.Madness, y: misinfo.madness, roles: roleLists.madness },
    { name: MISINFO.Drunk, y: misinfo.drunk, roles: roleLists.drunk },
    { name: "🤥", y: numLie },
    { name: "✅", y: numTrue },
  ];
};
