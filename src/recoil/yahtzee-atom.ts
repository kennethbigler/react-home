import { atom } from "recoil";

export const dice = [0, 1, 2, 3, 4, 5, 6] as const;
export type Dice = typeof dice[number];
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

const yahtzeeAtom = atom({
  key: "yahtzeeAtom",
  default: (JSON.parse(
    localStorage.getItem("yahtzee-atom") || "null"
  ) as YahtzeeState) || { ...newYahtzee(), scores: [] },
  effects: [
    ({ onSet }) => {
      onSet((newState) => {
        localStorage.setItem("yahtzee-atom", JSON.stringify(newState));
      });
    },
  ],
});

export default yahtzeeAtom;
