import { createSlice } from "@reduxjs/toolkit";
import { newPokerGame, endPokerTurn } from "./poker";

export interface TurnState {
  player: number;
  hand: number;
}

const initialState: TurnState = { player: 0, hand: 0 };

export const turnSlice = createSlice({
  name: "turn",
  initialState,
  reducers: {
    /** increment player turn in Turn DB */
    incrPlayerTurn: (state) => {
      state.player += 1;
      state.hand = 0;
    },
    /** increment hand turn in Turn DB */
    incrHandTurn: (state) => {
      state.hand += 1;
    },
    /** reset back to first player in Turn DB */
    resetTurn: (state) => {
      state.player = 0;
      state.hand = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(endPokerTurn, (state) => {
        turnSlice.caseReducers.incrPlayerTurn(state);
      })
      .addCase(newPokerGame, (state) => {
        turnSlice.caseReducers.resetTurn(state);
      });
  },
});

// Action creators are generated for each case reducer function
export const { incrPlayerTurn, incrHandTurn, resetTurn } = turnSlice.actions;

export default turnSlice.reducer;
