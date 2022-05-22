import { DBCard } from "../../apis/Deck";

// --------------------     player     -------------------- //
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
export type WeighFunc = (cards: DBCard[]) => { weight: number; soft: boolean };

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
export interface TurnState {
  player: number;
  hand: number;
}
