import { atom } from "recoil";

export interface HistoryEntry {
  board: string[] | null[];
  location?: number;
}
export interface TicTacToeState {
  history: HistoryEntry[];
  turn: string;
  step: number;
}

export const X = "X";
export const O = "O";
export const EMPTY = null;
export const newTicTacToe = (): TicTacToeState => ({
  history: [{ board: Array(9).fill(EMPTY) }],
  turn: X,
  step: 0,
});

const tikTacToeAtom = atom({
  key: "tikTacToeAtom",
  default:
    (JSON.parse(
      localStorage.getItem("tik-tac-toe-atom") || "null"
    ) as TicTacToeState) || newTicTacToe(),
  effects: [
    ({ onSet }) => {
      onSet((state) => {
        localStorage.setItem("tik-tac-toe-atom", JSON.stringify(state));
      });
    },
  ],
});

export default tikTacToeAtom;
