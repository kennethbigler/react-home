import { atom } from "recoil";
import SlotMachine, { SlotDisplay } from "../apis/SlotMachine";

const slotsAtom = atom({
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

export default slotsAtom;
