import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ladies, gents } from "../../constants/ayto";

export interface RoundPairing {
  /** [lady-i: gent-i] */
  pairs: number[];
  /** score of the round */
  score: number;
}

export interface AYTOState {
  /** [lady-i: (gent-i | -1), -1, -1, ...] */
  matches: number[];
  /** [lady-i: [gent-i: bool]] */
  noMatch: boolean[][];
  /** [round-i: RoundPairing] */
  roundPairings: RoundPairing[];
}

export const newAreYouTheOne = (): AYTOState => ({
  matches: ladies.map(() => -1),
  noMatch: ladies.map(() => gents.map(() => false)),
  roundPairings: [],
});

const initialState = newAreYouTheOne();

export const aytoSlice = createSlice({
  name: "ayto",
  initialState,
  reducers: {
    /**
     * Update Pairing for a specified round
     * @param ri - round index
     * @param li - lady index
     * @param gi - gent index
     * @returns Action<typeof UPDATE_PAIRS>
     */
    updatePairs: (
      state,
      action: PayloadAction<{ ri: number; li: number; gi: number }>
    ) => {
      const newRoundPairings = [...state.roundPairings];
      // if round doesn't exist yet, create skeleton one
      if (!newRoundPairings[action.payload.ri]) {
        newRoundPairings[action.payload.ri] = { pairs: [], score: 0 };
      }
      newRoundPairings[action.payload.ri].pairs[action.payload.li] =
        action.payload.gi;
      state.roundPairings = newRoundPairings;
    },
    /**
     * Update score for a specified round
     * @param score - round index
     * @returns Action<typeof UPDATE_SCORE>
     */
    updateScore: (
      state,
      action: PayloadAction<{ score: number; ri: number }>
    ) => {
      const newRoundPairings = [...state.roundPairings];
      // if round doesn't exist yet, create skeleton one
      if (!newRoundPairings[action.payload.ri]) {
        newRoundPairings[action.payload.ri] = { pairs: [], score: 0 };
      }
      newRoundPairings[action.payload.ri].score = action.payload.score;
      state.roundPairings = newRoundPairings;
    },
    /**
     * Update no match grid
     * @param li - lady index
     * @param gi - gent index
     * @returns Action<typeof UPDATE_NO_MATCH>
     */
    updateNoMatch: (
      state,
      action: PayloadAction<{ li: number; gi: number }>
    ) => {
      const newMatches = state.noMatch.map((gentArray: boolean[]) => [
        ...gentArray,
      ]);
      // if array for lady doesn't exist yet, create skeleton one
      !newMatches[action.payload.li] && (newMatches[action.payload.li] = []);
      // assign no match
      newMatches[action.payload.li][action.payload.gi] =
        !newMatches[action.payload.li][action.payload.gi];
      // update state
      state.noMatch = newMatches;
    },
    /**
     * Update no match grid
     * @param li - lady index
     * @param gi - gent index
     * @returns Action<typeof UPDATE_MATCH>
     */
    updateMatch: (state, action: PayloadAction<{ li: number; gi: number }>) => {
      const newMatches = [...state.matches];
      const newNoMatches = state.noMatch.map((gentArray: boolean[]) => [
        ...gentArray,
      ]);
      // if array for lady doesn't exist yet, create skeleton one
      !newNoMatches[action.payload.li] &&
        (newNoMatches[action.payload.li] = []);
      // assign new match
      newMatches[action.payload.li] = action.payload.gi;
      // make all gent options no matches
      for (let i = 0; i < gents.length; i += 1) {
        newNoMatches[action.payload.li][i] = i !== action.payload.gi;
      }
      // make all ladies options no matches
      for (let i = 0; i < ladies.length; i += 1) {
        !newNoMatches[i] && (newNoMatches[i] = []);
        newNoMatches[i][action.payload.gi] = i !== action.payload.li;
      }
      // update state
      state.matches = newMatches;
      state.noMatch = newNoMatches;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updatePairs, updateScore, updateNoMatch, updateMatch } =
  aytoSlice.actions;

export default aytoSlice.reducer;
