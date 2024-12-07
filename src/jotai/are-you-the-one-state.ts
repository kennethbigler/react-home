import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { aytoSeasons, options } from "../constants/ayto";

export interface RoundPairing {
  /** [lady-i: gent-i] */
  pairs: number[];
  /** score of the round */
  score: number;
}

export interface AYTOState {
  /** [lady-i: (gent-i | -1), -1, -1, ...] */
  matches: number[];
  /** [lady-i: [gent-i: bool]] */
  noMatch: boolean[][];
  /** [round-i: RoundPairing] */
  roundPairings: RoundPairing[];
}

const DEFAULT_SEASON = 7;

const newAYTOState = (season = DEFAULT_SEASON): AYTOState => ({
  matches: aytoSeasons[season].ladies.map(() => -1),
  noMatch: aytoSeasons[season].ladies.map(() =>
    aytoSeasons[season].gents.map(() => false),
  ),
  roundPairings: [],
});

/** used internally to store season */
const aytoSeasonAtom = atomWithStorage("aytoSeasonAtom", DEFAULT_SEASON);

/** used for main game state */
export const areYouTheOneAtom = atomWithStorage(
  "areYouTheOneAtom",
  newAYTOState(),
);

/** used externally to set season and side effects in main state */
export const aytoSeasonState = atom(
  (get) => get(aytoSeasonAtom),
  (_get, set, newSeason: number) => {
    set(aytoSeasonAtom, newSeason);
    set(areYouTheOneAtom, newAYTOState(newSeason));
  },
);

/** used externally to get player info */
export const aytoPlayerRead = atom((get) => {
  const season = get(aytoSeasonAtom);
  const newOptions = [...options];
  // if season 1, there are only 9 TBs
  if (season === 1) {
    newOptions.splice(9, 1);
  }

  return { ...aytoSeasons[season], options };
});

export default areYouTheOneAtom;
