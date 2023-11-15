import { atom, DefaultValue, selector } from "recoil";
import SlotMachine, { SlotDisplay } from "../apis/SlotMachine";
import playerAtom from "./player-atom";

export const slotsAtom = atom({
  key: "slotsAtom",
  default:
    (JSON.parse(
      localStorage.getItem("slots-atom") || "null",
    ) as SlotDisplay[]) || SlotMachine.pullHandle(),
  effects: [
    ({ onSet }) => {
      onSet((newReel) => {
        localStorage.setItem("slots-atom", JSON.stringify(newReel));
      });
    },
  ],
});

const slotsState = selector({
  key: "slotsState",
  get: ({ get }) => {
    const reel = get(slotsAtom);
    const players = get(playerAtom);
    const { money, bet, name } = players[0];
    const { money: houseMoney } = players[players.length - 1];

    return { reel, money, bet, name, houseMoney };
  },
  set: ({ get, set }, state) => {
    if (!(state instanceof DefaultValue)) {
      // set reel state
      const { reel, money, houseMoney } = state;
      set(slotsAtom, reel);

      // get player state
      const players = get(playerAtom);
      const DEALER_IDX = players.length - 1;

      // set player state
      const newPlayers = [...players];
      newPlayers[0] = { ...players[0], money };
      newPlayers[DEALER_IDX] = { ...players[DEALER_IDX], money: houseMoney };
      set(playerAtom, newPlayers);
    }
  },
});

export default slotsState;
