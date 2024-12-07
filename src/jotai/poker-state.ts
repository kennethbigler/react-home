import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import turnAtom, { TurnState } from "./turn-atom";
import playerAtom, { DBPlayer } from "./player-atom";

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

export const pokerAtom = atomWithStorage("pokerAtom", newPokerGameState());

interface PokerGameState {
  poker: PokerState;
  turn: TurnState;
  players: DBPlayer[];
}

const pokerState = atom(
  (get) => {
    const poker = get(pokerAtom);
    const turn = get(turnAtom);
    const players = get(playerAtom).slice(0, 5);

    return { poker, turn, players };
  },
  (get, set, { poker, turn, players }: PokerGameState) => {
    const dataPlayers = get(playerAtom);
    set(pokerAtom, poker);
    set(turnAtom, turn);
    set(playerAtom, [...players, dataPlayers[5], dataPlayers[6]]);
  },
);

export default pokerState;
