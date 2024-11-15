import { atom } from "recoil";

export interface StockState {
  [key: string]: number;
}

const initialState: StockState = {};

const stockAtom = atom({
  key: "stockAtom",
  default:
    (JSON.parse(localStorage.getItem("stock-atom") || "null") as StockState) ||
    initialState,
  effects: [
    ({ onSet }) => {
      onSet((state) => {
        localStorage.setItem("stock-atom", JSON.stringify(state));
      });
    },
  ],
});

export default stockAtom;
