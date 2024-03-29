import { atom } from "recoil";
import { DBCard } from "../apis/Deck";

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

/** card helper */
export const defaultWeigh: WeighFunc = () => ({ weight: 0, soft: false });

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

const playerAtom = atom({
  key: "playerAtom",
  default:
    (JSON.parse(localStorage.getItem("player-atom") || "null") as DBPlayer[]) ||
    initialState,
  effects: [
    ({ onSet }) => {
      onSet((state) => {
        localStorage.setItem("player-atom", JSON.stringify(state));
      });
    },
  ],
});

export default playerAtom;
