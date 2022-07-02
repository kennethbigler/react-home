import { atom } from "recoil";

export interface TurnState {
  player: number;
  hand: number;
}

const initialState: TurnState = { player: 0, hand: 0 };

const turnAtom = atom({
  key: "turnAtom",
  default:
    (JSON.parse(localStorage.getItem("turn-atom") || "null") as TurnState) ||
    initialState,
  effects: [
    ({ onSet }) => {
      onSet((state) => {
        localStorage.setItem("turn-atom", JSON.stringify(state));
      });
    },
  ],
});

export default turnAtom;
