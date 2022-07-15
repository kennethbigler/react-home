import { atom, DefaultValue, selector } from "recoil";
import turnAtom from "./turn-atom";
import playerAtom from "./player-atom";

export enum PokerGameFunctions {
  DISCARD_CARDS = "Discard Cards",
  END_TURN = "End Turn",
  NEW_GAME = "New Game",
  START_GAME = "Start Game",
}
export interface PokerState {
  gameFunctions: PokerGameFunctions[];
  cardsToDiscard: number[];
  hideHands: boolean;
  gameOver: boolean;
}

/** function to generate the state of a new game */
export const newPokerGameState = (): PokerState => ({
  gameFunctions: [PokerGameFunctions.START_GAME],
  cardsToDiscard: [],
  hideHands: true,
  gameOver: false,
});

export const pokerAtom = atom({
  key: "pokerAtom",
  default:
    (JSON.parse(localStorage.getItem("poker-atom") || "null") as PokerState) ||
    newPokerGameState(),
  effects: [
    ({ onSet }) => {
      onSet((state) => {
        localStorage.setItem("poker-atom", JSON.stringify(state));
      });
    },
  ],
});

const pokerState = selector({
  key: "pokerState",
  get: ({ get }) => {
    const poker = get(pokerAtom);
    const turn = get(turnAtom);
    const players = get(playerAtom).slice(0, 5);

    return { poker, turn, players };
  },
  set: ({ get, set }, state) => {
    if (!(state instanceof DefaultValue)) {
      const { poker, turn, players } = state;
      const dataPlayers = get(playerAtom);
      set(pokerAtom, poker);
      set(turnAtom, turn);
      set(playerAtom, [...players, dataPlayers[4], dataPlayers[5]]);
    }
  },
});

export default pokerState;
