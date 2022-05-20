import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum C4Turn {
  EMPTY = 0,
  RED = 1,
  BLACK = 2,
}
export interface Connect4State {
  board: number[][];
  winner?: number;
  line: [
    number | undefined,
    [number, number][] | undefined,
    [number, number][] | undefined
  ];
  turn: C4Turn;
}

const NEW_BOARD = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

export const immutableBoardCopy = (acc: number[][], row: number[]) => {
  acc.push([...row]);
  return acc;
};

export const newConnect4Game = (): Connect4State => ({
  board: NEW_BOARD.reduce(immutableBoardCopy, []),
  winner: undefined,
  line: [undefined, undefined, undefined],
  turn: C4Turn.RED,
});

const initialState = newConnect4Game();

export const connect4Slice = createSlice({
  name: "connect4",
  initialState,
  reducers: {
    newGame: () => newConnect4Game(),
    updateTurn: (state, action: PayloadAction<C4Turn>) => {
      state.turn = action.payload;
    },
    updateWinner: (state, action: PayloadAction<number>) => {
      state.winner = action.payload;
    },
    updateBoard: (state, action: PayloadAction<number[][]>) => {
      state.board = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { newGame, updateTurn, updateWinner, updateBoard } =
  connect4Slice.actions;

export default connect4Slice.reducer;
