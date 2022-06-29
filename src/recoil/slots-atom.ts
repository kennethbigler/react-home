import { atom } from "recoil";
import SlotMachine from "../apis/SlotMachine";
import { DBSlotDisplay } from "../store/modules/types";

const slotsState = atom({
  key: "slotsState",
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

export default slotsState;
