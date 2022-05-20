import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface HistoryEntry {
  board: string[] | undefined[];
  location?: number;
}
export interface TicTacToeState {
  history: HistoryEntry[];
  turn: string;
  step: number;
}

export const X = "X";
export const O = "O";
export const EMPTY = undefined;
export const newTicTacToe = (): TicTacToeState => ({
  history: [{ board: Array(9).fill(EMPTY) }],
  turn: X,
  step: 0,
});

const initialState = newTicTacToe();

export const ticTacToeSlice = createSlice({
  name: "ticTacToe",
  initialState,
  reducers: {
    playTurn: (state, action: PayloadAction<TicTacToeState>) => action.payload,
    newGame: () => newTicTacToe(),
  },
});

// Action creators are generated for each case reducer function
export const { playTurn, newGame } = ticTacToeSlice.actions;

export default ticTacToeSlice.reducer;
