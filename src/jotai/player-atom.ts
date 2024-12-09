import { atomWithStorage } from "jotai/utils";
import { DBCard } from "./deck-state";

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

export const newPlayer = (
  id: number,
  name = `Bot-${id}`,
  isBot = true,
): DBPlayer => ({
  id,
  name,
  isBot,
  status: "",
  money: 100,
  bet: 5,
  hands: [],
});

const initialState: DBPlayer[] = [
  newPlayer(1, "Ken", false),
  newPlayer(2),
  newPlayer(3),
  newPlayer(4),
  newPlayer(5),
  newPlayer(6),
  newPlayer(0, "Dealer", true),
];

const playerAtom = atomWithStorage("playerAtom", initialState);

export default playerAtom;
