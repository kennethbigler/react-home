import { atom, DefaultValue, selector } from "recoil";
import SlotMachine, { SlotDisplay } from "../apis/SlotMachine";
import playerAtom from "./player-atom";

export const slotsAtom = atom({
  key: "slotsAtom",
  default:
    (JSON.parse(
      localStorage.getItem("slots-atom") || "null"
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
    const player = players[0];
    const dealer = players[players.length - 1];

    return { reel, player, dealer };
  },
  set: ({ get, set }, state) => {
    if (!(state instanceof DefaultValue)) {
      const { reel, player, dealer } = state;
      set(slotsAtom, reel);

      const players = get(playerAtom);
      const newPlayers = [...players];
      newPlayers[0] = player;
      newPlayers[players.length - 1] = dealer;
      set(playerAtom, newPlayers);
    }
  },
});

export default slotsState;
