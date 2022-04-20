import { Action } from "redux";
import { DBAYTO } from "../types";
import initialState from "../initialState";

// --------------------     Actions     -------------------- //
const UPDATE_PAIRS = "@games/ayto/UPDATE_PAIRS";
const UPDATE_SCORE = "@games/ayto/UPDATE_SCORE";

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
 * @returns Action<typeof UPDATE_PAIRS>
 */
export const updateScore = (score: number, ri: number): UpdateScoreAction => ({
  type: UPDATE_SCORE,
  ri,
  score,
});

// --------------------     Reducers     -------------------- //
type AYTOActions = UpdatePairsAction | UpdateScoreAction;
export default function reducer(
  state: DBAYTO = initialState.ayto,
  action: AYTOActions
): DBAYTO {
  switch (action.type) {
    case UPDATE_PAIRS: {
      const newRoundPairings = [...state.roundPairings];
      if (!newRoundPairings[action.ri]) {
        newRoundPairings[action.ri] = { pairs: [], score: 0 };
      }
      newRoundPairings[action.ri].pairs[action.li] = action.gi;
      return { ...state, roundPairings: newRoundPairings };
    }
    case UPDATE_SCORE: {
      const newRoundPairings = [...state.roundPairings];
      if (!newRoundPairings[action.ri]) {
        newRoundPairings[action.ri] = { pairs: [], score: 0 };
      }
      newRoundPairings[action.ri].score = action.score;
      return { ...state, roundPairings: newRoundPairings };
    }
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
