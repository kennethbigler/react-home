import { Color } from '@material-ui/core';

// --------------------     dota2     -------------------- //
export enum ATR {
  STR = 'Strength',
  AGI = 'Agility',
  INT = 'Intelligence',
}
export default ATR;
export interface DBDota2Hero {
  name: string;
  selected: boolean;
  attribute: ATR;
}
export interface DBDota2Turn {
  number: number;
  selection?: DBDota2Hero;
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

// --------------------     theme     -------------------- //
export interface DBUITheme {
  type: 'light' | 'dark';
  primary: Color;
  secondary: Color;
}

// --------------------     turn     -------------------- //
export interface DBTurn {
  player: number;
  hand: number;
}

// --------------------     turn     -------------------- //
export interface DBRootState {
  dota2: DBDota2Phase[][];
  git: DBGit;
  gqlToken: string;
  players: DBPlayer[];
  theme: DBUITheme;
  turn: DBTurn;
  yahtzee: number[];
}
