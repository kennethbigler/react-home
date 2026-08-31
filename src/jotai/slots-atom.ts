import { atom } from "jotai";
import persistentAtom from "./storage";
import slotMachine, {
  type SlotDisplay,
} from "../components/games/slots/slotMachine";
import playerAtom, { patchPlayerAtom } from "./player-atom";

const slotsAtom = persistentAtom("slotsAtom", slotMachine.pullHandle());

export const slotsRead = atom((get) => {
  const players = get(playerAtom);
  const { bet, name } = players[0];
  return { bet, name };
});
slotsRead.debugLabel = "slotsRead";

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
  (_get, set, { reel, money, houseMoney }: SlotsState) => {
    set(slotsAtom, reel);
    set(patchPlayerAtom, 0, { money });
    set(patchPlayerAtom, -1, { money: houseMoney });
  },
);
slotsState.debugLabel = "slotsState";

export default slotsState;
