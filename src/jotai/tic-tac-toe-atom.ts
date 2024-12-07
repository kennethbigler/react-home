import { atomWithStorage } from "jotai/utils";

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

const tikTacToeAtom = atomWithStorage("tikTacToeAtom", newTicTacToe());

export default tikTacToeAtom;
