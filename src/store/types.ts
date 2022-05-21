import { Connect4State } from "./modules/connect4";
import { GitState } from "./modules/git";
import { ThemeState } from "./modules/theme";
import { TicTacToeState } from "./modules/ticTacToe";
import { YahtzeeState } from "./modules/yahtzee";
import { AYTOState } from "./modules/ayto";
import { PokerState } from "./modules/poker";
import { TurnState } from "./modules/turn";
import { DBPlayer } from "./modules/types";

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

// --------------------     dnd     -------------------- //
export interface Briefcase {
  on: boolean;
  loc: number;
  val: number;
}
export interface DBDND {
  board: Briefcase[];
  turn: number;
  playerChoice?: Briefcase;
  casesToOpen: number;
  sum: number;
  numCases: number;
  offer: number;
  dndOpen: boolean;
  isOver: boolean;
}
export const briefcasesToOpen = 6;

// --------------------     slots     -------------------- //
export enum DBSlotOptions {
  EMPTY = " ",
  CHERRY = "C",
  BAR = "—",
  DOUBLE_BAR = "=",
  TRIPLE_BAR = "Ξ",
  SEVEN = "7",
  JACKPOT = "J",
}
export type DBSlotDisplay = [DBSlotOptions, DBSlotOptions, DBSlotOptions];

// --------------------     root     -------------------- //
export interface DBRootState {
  ayto: AYTOState;
  blackjack: DBBlackjack;
  connect4: Connect4State;
  dnd: DBDND;
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
