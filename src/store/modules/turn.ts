import { Action } from "redux";
import { DBTurn } from "../types";
import initialState from "../initialState";

// --------------------     Actions     -------------------- //
export enum TA {
  INCR_PLAYER = "casino/turn/INCR",
  INCR_HAND = "casino/turn/INCR_HAND",
  RESET = "casino/turn/RESET",
}
const { INCR_PLAYER, INCR_HAND, RESET } = TA;

// --------------------     Action Creators     -------------------- //
/** increment player turn in Turn DB */
export const incrPlayerTurn = (): Action<typeof INCR_PLAYER> => ({
  type: INCR_PLAYER,
});
/** increment hand turn in Turn DB */
export const incrHandTurn = (): Action<typeof INCR_HAND> => ({
  type: INCR_HAND,
});
/** reset back to first player in Turn DB */
export const resetTurn = (): Action<typeof RESET> => ({ type: RESET });

// --------------------     Reducers     -------------------- //
export default function reducer(
  state: DBTurn = initialState.turn,
  action: Action<TA>
): DBTurn {
  switch (action.type) {
    case INCR_PLAYER:
      return { ...state, ...{ player: state.player + 1, hand: 0 } };
    case INCR_HAND:
      return { ...state, ...{ hand: state.hand + 1 } };
    case RESET:
      return { ...state, ...{ player: 0, hand: 0 } };
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
