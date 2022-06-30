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

// --------------------     turn     -------------------- //
export interface TurnState {
  player: number;
  hand: number;
}
