import { playerDist } from "../../../constants/botc";
import type { ActiveScript } from "../../../jotai/botc-atom";
import { MISINFO, getMisinfoForSlug } from "../../../constants/botc-slug-map";
import {
  getScriptDemonSlugs,
  getScriptMisinfoSlugs,
} from "../../../utils/botc-script-utils";

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
}

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

const sumMisinfoFromSlugs = (
  slugs: string[],
  numPlayers: number,
): { numEvil: number; numDrunk: number } => {
  let numEvil = 0;
  let numDrunk = 0;
  const [townsfolk] = PLAYER_DIST_PARSED[numPlayers];

  for (const slug of slugs) {
    if (slug === VORTOX_SLUG) {
      numDrunk += townsfolk;
      continue;
    }

    if (slug === LEGION_SLUG) {
      numEvil += legionEvilMisinfo(numPlayers);
      continue;
    }

    if (slug === VIGORMORTIS_SLUG) {
      numDrunk += vigormortisPoisonCount(numPlayers);
      continue;
    }

    const tags = getMisinfoForSlug(slug);
    if (!tags) continue;

    for (const tag of tags) {
      if (tag === MISINFO.Evil) {
        numEvil += 1;
      } else {
        numDrunk += 1;
      }
    }
  }

  return { numEvil, numDrunk };
};

/** Max combined evil + drunk bodies: all in-play slots plus travelers */
const maxEvilDrunkBodies = (numPlayers: number, numTravelers: number): number =>
  numPlayers + numTravelers;

/** Trim drunk first, then evil, so totals stay within the body cap */
const capEvilAndDrunk = (
  numEvil: number,
  numDrunk: number,
  maxTotal: number,
): { numEvil: number; numDrunk: number } => {
  if (numEvil + numDrunk <= maxTotal) {
    return { numEvil, numDrunk };
  }

  let evil = numEvil;
  let drunk = numDrunk;
  const excess = evil + drunk - maxTotal;
  const drunkCut = Math.min(drunk, excess);
  drunk -= drunkCut;
  evil -= excess - drunkCut;

  return { numEvil: Math.max(0, evil), numDrunk: Math.max(0, drunk) };
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

  let numDrunk: number = numTravelers >= 4 ? 1 : 0;

  const demonSlug = selectedDemonSlug ?? getScriptDemonSlugs(script)[0] ?? "";
  const misinfo = sumMisinfoFromSlugs(
    getScriptMisinfoSlugs(script, demonSlug),
    numPlayers,
  );
  numEvil += misinfo.numEvil;
  numDrunk += misinfo.numDrunk;

  ({ numEvil, numDrunk } = capEvilAndDrunk(
    numEvil,
    numDrunk,
    maxEvilDrunkBodies(numPlayers, numTravelers),
  ));

  const numLie: number = Math.max(
    0,
    Math.ceil(0.2 * (numPlayers + numTravelers - numEvil - numDrunk)),
  );
  const numTrue: number = Math.max(
    0,
    numPlayers + numTravelers - numEvil - numDrunk - numLie,
  );

  return [
    { name: "😈", y: numEvil },
    { name: "🍺🧪😡", y: numDrunk },
    { name: "🤥", y: numLie },
    { name: "✅", y: numTrue },
  ];
};
