import { atom } from "recoil";
import SlotMachine, { DBSlotDisplay } from "../apis/SlotMachine";

const slotsAtom = atom({
  key: "slotsAtom",
  default:
    (JSON.parse(
      localStorage.getItem("slots-atom") || "false"
    ) as DBSlotDisplay[]) || SlotMachine.pullHandle(),
  effects: [
    ({ onSet }) => {
      onSet((newReel) => {
        localStorage.setItem("slots-atom", JSON.stringify(newReel));
      });
    },
  ],
});

export default slotsAtom;
