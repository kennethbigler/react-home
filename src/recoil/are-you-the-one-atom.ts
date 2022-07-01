import { atom } from "recoil";
import { ladies, gents } from "../constants/ayto";

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

export const newAreYouTheOne = (): AYTOState => ({
  matches: ladies.map(() => -1),
  noMatch: ladies.map(() => gents.map(() => false)),
  roundPairings: [],
});

const areYouTheOneAtom = atom({
  key: "areYouTheOneAtom",
  default:
    (JSON.parse(
      localStorage.getItem("are-you-the-one-atom") || "null"
    ) as AYTOState) || newAreYouTheOne(),
  effects: [
    ({ onSet }) => {
      onSet((state) => {
        localStorage.setItem("are-you-the-one-atom", JSON.stringify(state));
      });
    },
  ],
});

export default areYouTheOneAtom;
