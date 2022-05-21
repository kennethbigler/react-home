import { DBCard } from "../../apis/Deck";

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
