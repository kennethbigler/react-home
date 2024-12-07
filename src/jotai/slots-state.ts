import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import SlotMachine, {
  SlotDisplay,
} from "../components/games/slots/slotMachine";
import playerAtom from "./player-atom";

export const slotsAtom = atomWithStorage("slotsAtom", SlotMachine.pullHandle());

export const slotsRead = atom((get) => {
  const players = get(playerAtom);
  const { bet, name } = players[0];
  return { bet, name };
});

interface SlotsState {
  reel: SlotDisplay[];
  money: number;
  houseMoney: number;
}

const slotsState = atom(
  (get) => {
    const reel = get(slotsAtom);
    const players = get(playerAtom);
    const { money } = players[0];
    const { money: houseMoney } = players[players.length - 1];

    return { reel, money, houseMoney };
  },
  (get, set, { reel, money, houseMoney }: SlotsState) => {
    // set reel state
    set(slotsAtom, reel);

    // get player state
    const players = get(playerAtom);
    const DEALER_IDX = players.length - 1;

    // set player state
    const newPlayers = [...players];
    newPlayers[0] = { ...players[0], money };
    newPlayers[DEALER_IDX] = { ...players[DEALER_IDX], money: houseMoney };
    set(playerAtom, newPlayers);
  },
);

export default slotsState;
