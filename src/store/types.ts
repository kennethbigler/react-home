import { Color } from '@material-ui/core';

// --------------------     connect4     -------------------- //
export enum C4Turn {
  EMPTY = 0,
  RED = 1,
  BLACK = 2,
}
export interface DBConnect4 {
  board: number[][];
  winner?: number;
  line: [number | undefined, [number, number][] | undefined, [number, number][] | undefined];
  turn: C4Turn;
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

// --------------------     dota2     -------------------- //
export enum ATR {
  STR = 'Strength',
  AGI = 'Agility',
  INT = 'Intelligence',
}
export default ATR;
export interface DBDota2Hero {
  name: string;
  selected: boolean | string;
  attribute: ATR;
}
export interface DBDota2Turn {
  number: number;
  selection?: string;
}
export interface DBDota2Phase {
  name: string;
  radiant: DBDota2Turn;
  dire: DBDota2Turn;
}

// --------------------     git     -------------------- //
export interface DBGit {
  storyID: string;
  branchMessage: string;
  branchPrefix: string;
  casePreference: string;
  commitPrefix: boolean;
}

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

// --------------------     slots     -------------------- //
export enum DBSlotOptions {
  EMPTY = ' ',
  CHERRY = 'C',
  BAR = '—',
  DOUBLE_BAR = '=',
  TRIPLE_BAR = 'Ξ',
  SEVEN = '7',
  JACKPOT = 'J',
}
export type DBSlotDisplay = [DBSlotOptions, DBSlotOptions, DBSlotOptions];

// --------------------     theme     -------------------- //
export interface DBUITheme {
  type: 'light' | 'dark';
  primary: Color;
  secondary: Color;
}

// --------------------     ticTacToe     -------------------- //
export interface DBHistoryEntry {
  board: string[] | undefined[];
  location?: number;
}
export interface DBTicTacToe {
  history: DBHistoryEntry[];
  turn: string;
  step: number;
}

// --------------------     turn     -------------------- //
export interface DBTurn {
  player: number;
  hand: number;
}

// --------------------     yahtzee     -------------------- //
export type Dice = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export interface DBYahtzee {
  roll: Dice;
  values: Dice[];
  saved: Dice[];
  turn: number;
  showScoreButtons: boolean;
  hasScored: boolean;
  topScores: number[];
  bottomScores: number[];
  scores: number[];
}

// --------------------     z-root     -------------------- //
export interface DBRootState {
  connect4: DBConnect4;
  dnd: DBDND;
  dota2: DBDota2Phase[][];
  git: DBGit;
  gqlToken: string;
  players: DBPlayer[];
  theme: DBUITheme;
  ticTacToe: DBTicTacToe;
  turn: DBTurn;
  yahtzee: DBYahtzee;
  slots: DBSlotDisplay[];
}
