import { atom } from "jotai";
import persistentAtom from "./storage";
import type { DBCard } from "./deck-atom";

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

const newPlayer = (id: number, name = `Bot-${id}`, isBot = true): DBPlayer => ({
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

const playerAtom = persistentAtom("playerAtom", initialState);

/**
 * Immutably patch one player by array index; negative indexes count from the
 * end (-1 = dealer/house slot). Shared by the game-state facade atoms.
 */
export const patchPlayerAtom = atom(
  null,
  (get, set, index: number, patch: Partial<DBPlayer>) => {
    const players = get(playerAtom);
    const i = index < 0 ? players.length + index : index;
    const newPlayers = [...players];
    newPlayers[i] = { ...players[i], ...patch };
    set(playerAtom, newPlayers);
  },
);
patchPlayerAtom.debugLabel = "patchPlayerAtom";

export default playerAtom;
