import { atom } from "jotai";
import persistentAtom from "./storage";
import playerAtom, { type DBPlayer } from "./player-atom";
import turnAtom, { type TurnState } from "./turn-atom";

export enum GameFunctions {
  NEW_GAME = "New Game",
  FINISH_BETTING = "Finish Betting",
  STAY = "Stay",
  HIT = "Hit",
  DOUBLE = "Double",
  SPLIT = "Split",
}

export interface BlackjackState {
  gameFunctions: GameFunctions[];
  hideHands: boolean;
}

export const newBlackjackGame = (): BlackjackState => ({
  gameFunctions: [GameFunctions.FINISH_BETTING],
  hideHands: true,
});

const blackjackAtom = persistentAtom("blackjackAtom", newBlackjackGame());

interface BlackjackGameState {
  bj: BlackjackState;
  players?: DBPlayer[];
  turn?: TurnState;
}

const blackjackState = atom(
  (get) => {
    const bj = get(blackjackAtom);
    const players = get(playerAtom);
    const turn = get(turnAtom);

    return { bj, players, turn };
  },
  (_get, set, { bj, turn, players }: BlackjackGameState) => {
    set(blackjackAtom, bj);

    if (turn) {
      set(turnAtom, turn);
    }
    if (players) {
      set(playerAtom, players);
    }
  },
);
blackjackState.debugLabel = "blackjackState";

export default blackjackState;
