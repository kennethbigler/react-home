import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const dice = [0, 1, 2, 3, 4, 5, 6] as const;
export type Dice = typeof dice[number];
export interface YahtzeeState {
  roll: Dice;
  values: Dice[];
  saved: Dice[];
  turn: number;
  showScoreButtons: boolean;
  topScores: number[];
  bottomScores: number[];
  scores: number[];
}

export const newYahtzee = (): Omit<YahtzeeState, "scores"> => ({
  roll: 0,
  values: [0, 0, 0, 0, 0],
  saved: [],
  turn: 0,
  showScoreButtons: false,
  topScores: [-1, -1, -1, -1, -1, -1],
  bottomScores: [-1, -1, -1, -1, -1, -1, -1],
});

const initialState: YahtzeeState = { ...newYahtzee(), scores: [] };

export const yahtzeeSlice = createSlice({
  name: "yahtzee",
  initialState,
  reducers: {
    addScore: (state, action: PayloadAction<number>) => {
      state.scores.push(action.payload);
    },
    newGame: (state) => ({ ...newYahtzee(), scores: state.scores }),
    diceClick: (
      state,
      action: PayloadAction<{ values: Dice[]; saved: Dice[] }>
    ) => {
      state.values = action.payload.values;
      state.saved = action.payload.saved;
    },
    updateTop: (state, action: PayloadAction<number[]>) => {
      state.showScoreButtons = false;
      state.topScores = action.payload;
      state.roll = 0;
      state.values = [0, 0, 0, 0, 0];
      state.saved = [];
    },
    updateBottom: (state, action: PayloadAction<number[]>) => {
      state.showScoreButtons = false;
      state.bottomScores = action.payload;
      state.roll = 0;
      state.values = [0, 0, 0, 0, 0];
      state.saved = [];
    },
    updateRoll: (
      state,
      action: PayloadAction<{ values: Dice[]; saved: Dice[]; roll: Dice }>
    ) => {
      state.values = action.payload.values;
      state.saved = action.payload.saved;
      state.roll = action.payload.roll;
      state.showScoreButtons = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addScore,
  newGame,
  diceClick,
  updateTop,
  updateBottom,
  updateRoll,
} = yahtzeeSlice.actions;

export default yahtzeeSlice.reducer;
