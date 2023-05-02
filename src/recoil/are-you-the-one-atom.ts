import { atom, DefaultValue, selector } from "recoil";
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
    aytoSeasons[season].gents.map(() => false)
  ),
  roundPairings: [],
});

/** used for main game state */
export const areYouTheOneAtom = atom({
  key: "areYouTheOneAtom",
  default:
    (JSON.parse(
      localStorage.getItem("are-you-the-one-atom") || "null"
    ) as AYTOState) || newAYTOState(),
  effects: [
    ({ onSet }) => {
      onSet((state) => {
        localStorage.setItem("are-you-the-one-atom", JSON.stringify(state));
      });
    },
  ],
});

/** used internally to store season */
const aytoSeasonAtom = atom({
  key: "aytoSeason",
  default:
    (JSON.parse(
      localStorage.getItem("ayto-season-atom") || "null"
    ) as number) || DEFAULT_SEASON,
  effects: [
    ({ onSet }) => {
      onSet((state) => {
        localStorage.setItem("ayto-season-atom", JSON.stringify(state));
      });
    },
  ],
});

/** used externally to set season and side effects in main state */
export const aytoSeasonSelector = selector({
  key: "aytoSeasonSelector",
  get: ({ get }) => get(aytoSeasonAtom),
  set: ({ set }, state) => {
    if (!(state instanceof DefaultValue)) {
      set(aytoSeasonAtom, state);
      set(areYouTheOneAtom, newAYTOState(state));
    }
  },
});

/** used externally to get player info */
export const aytoPlayerSelector = selector({
  key: "aytoPlayerSelector",
  get: ({ get }) => {
    const season = get(aytoSeasonAtom);
    const newOptions = [...options];
    // if season 1, there are only 9 TBs
    if (season === 1) {
      newOptions.splice(9, 1);
    }

    return { ...aytoSeasons[season], options };
  },
});

export default areYouTheOneAtom;
