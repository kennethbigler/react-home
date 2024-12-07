import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
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
  bestScore: number;
  lastScore: number;
}

export const newYahtzee = (): Omit<
  YahtzeeState,
  "bestScore" | "lastScore"
> => ({
  roll: 0,
  values: [0, 0, 0, 0, 0],
  saved: [],
  turn: 0,
  showScoreButtons: false,
  topScores: [-1, -1, -1, -1, -1, -1],
  bottomScores: [-1, -1, -1, -1, -1, -1, -1],
});

export const yahtzeeAtom = atomWithStorage<YahtzeeState>("yahtzeeAtom", {
  ...newYahtzee(),
  bestScore: 0,
  lastScore: 0,
});

export const yahtzeeRead = atom((get) => {
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
});

interface YahtzeeGameState extends YahtzeeState {
  money: number;
}

const yahtzeeState = atom(
  (get) => {
    const yahtzee = get(yahtzeeAtom);
    const { money } = get(playerAtom)[0];

    return { ...yahtzee, money };
  },
  (get, set, { money, ...yahtzee }: YahtzeeGameState) => {
    set(yahtzeeAtom, yahtzee);

    const players = get(playerAtom);
    const newPlayers = [...players];
    newPlayers[0] = { ...players[0], money };
    set(playerAtom, newPlayers);
  },
);

export default yahtzeeState;
