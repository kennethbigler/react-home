import { Connect4State } from "./modules/connect4";
import { GitState } from "./modules/git";
import { ThemeState } from "./modules/theme";
import { TicTacToeState } from "./modules/ticTacToe";
import { YahtzeeState } from "./modules/yahtzee";
import { AYTOState } from "./modules/ayto";
import { PokerState } from "./modules/poker";
import { TurnState } from "./modules/turn";
import { DBPlayer, DBSlotDisplay } from "./modules/types";
import { DNDState } from "./modules/dnd";

// --------------------     blackjack     -------------------- //
export enum GameFunctions {
  NEW_GAME = "New Game",
  FINISH_BETTING = "Finish Betting",
  STAY = "Stay",
  HIT = "Hit",
  DOUBLE = "Double",
  SPLIT = "Split",
}

export interface DBBlackjack {
  gameFunctions: string[];
  hasFunctions: boolean;
  hideHands: boolean;
}

// --------------------     root     -------------------- //
export interface DBRootState {
  ayto: AYTOState;
  blackjack: DBBlackjack;
  connect4: Connect4State;
  dnd: DNDState;
  git: GitState;
  gqlToken: string;
  players: DBPlayer[];
  poker: PokerState;
  theme: ThemeState;
  ticTacToe: TicTacToeState;
  turn: TurnState;
  yahtzee: YahtzeeState;
  slots: DBSlotDisplay[];
}
