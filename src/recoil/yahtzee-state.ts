import { atom, DefaultValue, selector } from "recoil";
import playerAtom from "./player-atom";

export const dice = [0, 1, 2, 3, 4, 5, 6] as const;
export type Dice = (typeof dice)[number];
export interface YahtzeeState {
  roll: Dice;
  values: Dice[];
  saved: Dice[];
  turn: number;
  showScoreButtons: boolean;
  topScores: number[];
  bottomScores: number[];
  scores: number[];
}

export const newYahtzee = (): Omit<YahtzeeState, "scores"> => ({
  roll: 0,
  values: [0, 0, 0, 0, 0],
  saved: [],
  turn: 0,
  showScoreButtons: false,
  topScores: [-1, -1, -1, -1, -1, -1],
  bottomScores: [-1, -1, -1, -1, -1, -1, -1],
});

export const yahtzeeAtom = atom({
  key: "yahtzeeAtom",
  default: (JSON.parse(
    localStorage.getItem("yahtzee-atom") || "null",
  ) as YahtzeeState) || { ...newYahtzee(), scores: [] },
  effects: [
    ({ onSet }) => {
      onSet((newState) => {
        localStorage.setItem("yahtzee-atom", JSON.stringify(newState));
      });
    },
  ],
});

export const yahtzeeReadOnlyState = selector({
  key: "yahtzeeReadOnlyState",
  get: ({ get }) => {
    const { topScores, bottomScores } = get(yahtzeeAtom);
    const { name } = get(playerAtom)[0];

    let count = 0;

    const topSum = topScores.reduce((sum, score) => {
      if (score >= 0) {
        count += 1;
        sum += score;
      }
      return sum;
    }, 0);

    const bottomSum = bottomScores.reduce((sum, score) => {
      if (score >= 0) {
        count += 1;
        sum += score;
      }
      return sum;
    }, 0);

    let finalTopSum = topSum;
    if (topSum >= 63) {
      finalTopSum += 35;
    }

    const finish = count >= 13;

    return {
      topSum,
      bottomSum,
      finalTopSum,
      finish,
      name,
    };
  },
});

const yahtzeeState = selector({
  key: "yahtzeeState",
  get: ({ get }) => {
    const yahtzee = get(yahtzeeAtom);
    const { money } = get(playerAtom)[0];

    return { ...yahtzee, money };
  },
  set: ({ get, set }, state) => {
    if (!(state instanceof DefaultValue)) {
      const { money, ...yahtzee } = state;
      set(yahtzeeAtom, yahtzee);

      const players = get(playerAtom);
      const newPlayers = [...players];
      newPlayers[0] = { ...players[0], money };
      set(playerAtom, newPlayers);
    }
  },
});

export default yahtzeeState;
