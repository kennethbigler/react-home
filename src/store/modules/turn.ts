import { createSlice } from "@reduxjs/toolkit";
import { setNewGame, stayHand } from "./blackjack";
import { TurnState } from "./types";

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
      .addCase(setNewGame, (state) => {
        turnSlice.caseReducers.resetTurn(state);
      })
      .addCase(stayHand, (state, action) => {
        action.payload
          ? turnSlice.caseReducers.incrHandTurn(state)
          : turnSlice.caseReducers.incrPlayerTurn(state);
      });
  },
});

// Action creators are generated for each case reducer function
export const { incrPlayerTurn, incrHandTurn, resetTurn } = turnSlice.actions;

export default turnSlice.reducer;
