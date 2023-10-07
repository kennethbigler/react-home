import { atom, DefaultValue, selector } from "recoil";
import playerAtom from "./player-atom";
import turnAtom from "./turn-atom";

export enum GameFunctions {
  NEW_GAME = "New Game",
  FINISH_BETTING = "Finish Betting",
  STAY = "Stay",
  HIT = "Hit",
  DOUBLE = "Double",
  SPLIT = "Split",
}

export interface BlackjackState {
  gameFunctions: string[];
  hideHands: boolean;
}

export const newBlackjackGame = (): BlackjackState => ({
  gameFunctions: [GameFunctions.FINISH_BETTING],
  hideHands: true,
});

export const blackjackAtom = atom({
  key: "blackjackAtom",
  default:
    (JSON.parse(
      localStorage.getItem("blackjack-atom") || "null",
    ) as BlackjackState) || newBlackjackGame(),
  effects: [
    ({ onSet }) => {
      onSet((state) => {
        localStorage.setItem("blackjack-atom", JSON.stringify(state));
      });
    },
  ],
});

const blackjackState = selector({
  key: "blackjackState",
  get: ({ get }) => {
    const bj = get(blackjackAtom);
    const players = get(playerAtom);
    const turn = get(turnAtom);

    return { bj, players, turn };
  },
  set: ({ set }, state) => {
    if (!(state instanceof DefaultValue)) {
      const { bj, turn, players } = state;
      set(blackjackAtom, bj);
      set(turnAtom, turn);
      set(playerAtom, players);
    }
  },
});

export default blackjackState;
