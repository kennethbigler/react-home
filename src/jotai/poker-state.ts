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
  turn?: TurnState;
  players?: DBPlayer[];
}

/** Number of human/bot players at the poker table (excludes non-poker slots) */
const POKER_PLAYER_COUNT = 5;
/** Total slots in the shared playerAtom used by the poker table + extra slots */
const POKER_TOTAL_PLAYER_SLOTS = 7;

const pokerState = atom(
  (get) => {
    const poker = get(pokerAtom);
    const turn = get(turnAtom);
    const players = get(playerAtom).slice(0, POKER_PLAYER_COUNT);

    return { poker, turn, players };
  },
  (get, set, { poker, turn, players }: PokerGameState) => {
    set(pokerAtom, poker);

    if (turn) {
      set(turnAtom, turn);
    }
    if (players) {
      const dataPlayers = get(playerAtom);
      set(playerAtom, [
        ...players,
        ...dataPlayers.slice(POKER_PLAYER_COUNT, POKER_TOTAL_PLAYER_SLOTS),
      ]);
    }
  },
);

export default pokerState;
