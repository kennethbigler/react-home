import { Connect4State } from "./modules/connect4";
import { GitState } from "./modules/git";
import { ThemeState } from "./modules/theme";
import { TicTacToeState } from "./modules/ticTacToe";
import { YahtzeeState } from "./modules/yahtzee";
import { AYTOState } from "./modules/ayto";

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

// --------------------     players     -------------------- //
export interface DBCard {
  name: string;
  suit: string;
  weight: number;
}
export interface DBHand {
  weight?: number;
  soft?: boolean;
  cards: DBCard[];
}
export interface DBPlayer {
  hands: DBHand[];
  id: number;
  isBot: boolean;
  money: number;
  status: string;
  name: string;
  bet: number;
}

// --------------------     poker     -------------------- //
export enum PokerGameFunctions {
  DISCARD_CARDS = "Discard Cards",
  END_TURN = "End Turn",
  NEW_GAME = "New Game",
  START_GAME = "Start Game",
}
export interface DBPoker {
  gameFunctions: PokerGameFunctions[];
  cardsToDiscard: number[];
  hideHands: boolean;
  gameOver: boolean;
}

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

// --------------------     turn     -------------------- //
export interface DBTurn {
  player: number;
  hand: number;
}

// --------------------     root     -------------------- //
export interface DBRootState {
  ayto: AYTOState;
  blackjack: DBBlackjack;
  connect4: Connect4State;
  dnd: DBDND;
  git: GitState;
  gqlToken: string;
  players: DBPlayer[];
  poker: DBPoker;
  theme: ThemeState;
  ticTacToe: TicTacToeState;
  turn: DBTurn;
  yahtzee: YahtzeeState;
  slots: DBSlotDisplay[];
}
