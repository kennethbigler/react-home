import { Action } from "redux";
import { DBAYTO } from "../types";
import initialState from "../initialState";

// --------------------     Actions     -------------------- //
const UPDATE_PAIRS = "@games/ayto/UPDATE_PAIRS";
const UPDATE_SCORE = "@games/ayto/UPDATE_SCORE";
const UPDATE_NO_MATCH = "@games/ayto/UPDATE_NO_MATCH";

// --------------------     Action Creators     -------------------- //
interface UpdatePairsAction extends Action<typeof UPDATE_PAIRS> {
  ri: number;
  li: number;
  gi: number;
}
/**
 * Update Pairing for a specified round
 * @param ri - round index
 * @param li - lady index
 * @param gi - gent index
 * @returns Action<typeof UPDATE_PAIRS>
 */
export const updatePairs = (
  ri: number,
  li: number,
  gi: number
): UpdatePairsAction => ({ type: UPDATE_PAIRS, ri, li, gi });

interface UpdateScoreAction extends Action<typeof UPDATE_SCORE> {
  ri: number;
  score: number;
}
/**
 * Update score for a specified round
 * @param score - round index
 * @returns Action<typeof UPDATE_SCORE>
 */
export const updateScore = (score: number, ri: number): UpdateScoreAction => ({
  type: UPDATE_SCORE,
  ri,
  score,
});

interface UpdateNoMatchAction extends Action<typeof UPDATE_NO_MATCH> {
  li: number;
  gi: number;
}
/**
 * Update no match grid
 * @param li - lady index
 * @param gi - gent index
 * @returns Action<typeof UPDATE_NO_MATCH>
 */
export const updateNoMatch = (li: number, gi: number): UpdateNoMatchAction => ({
  type: UPDATE_NO_MATCH,
  li,
  gi,
});

// --------------------     Reducers     -------------------- //
type AYTOActions = UpdatePairsAction | UpdateScoreAction | UpdateNoMatchAction;
export default function reducer(
  state: DBAYTO = initialState.ayto,
  action: AYTOActions
): DBAYTO {
  switch (action.type) {
    case UPDATE_PAIRS: {
      const newRoundPairings = [...state.roundPairings];
      // if round doesn't exist yet, create skeleton one
      if (!newRoundPairings[action.ri]) {
        newRoundPairings[action.ri] = { pairs: [], score: 0 };
      }
      newRoundPairings[action.ri].pairs[action.li] = action.gi;
      return { ...state, roundPairings: newRoundPairings };
    }
    case UPDATE_SCORE: {
      const newRoundPairings = [...state.roundPairings];
      // if round doesn't exist yet, create skeleton one
      if (!newRoundPairings[action.ri]) {
        newRoundPairings[action.ri] = { pairs: [], score: 0 };
      }
      newRoundPairings[action.ri].score = action.score;
      return { ...state, roundPairings: newRoundPairings };
    }
    case UPDATE_NO_MATCH: {
      const newMatches = state.noMatch.map((gentArray: boolean[]) => [
        ...gentArray,
      ]);
      // if array for lady doesn't exist yet, create skeleton one
      if (!newMatches[action.li]) {
        newMatches[action.li] = [];
      }
      newMatches[action.li][action.gi] = !newMatches[action.li][action.gi];
      return { ...state, noMatch: newMatches };
    }
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
