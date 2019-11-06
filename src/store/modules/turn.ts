import { Action } from 'redux';
import { DBTurn } from '../types';
import initialState from '../initialState';

// --------------------     Actions     -------------------- //
const INCR_PLAYER = 'casino/turn/INCR';
const INCR_HAND = 'casino/turn/INCR_HAND';
const RESET = 'casino/turn/RESET';

// --------------------     Action Creators     -------------------- //
export const incrPlayerTurn = (): Action => ({ type: INCR_PLAYER });
export const incrHandTurn = (): Action => ({ type: INCR_HAND });
export const resetTurn = (): Action => ({ type: RESET });

// --------------------     Reducers     -------------------- //
export default function reducer(state: DBTurn = initialState.turn, action: Action): DBTurn {
  switch (action.type) {
    case INCR_PLAYER:
      return { ...state, ...{ player: state.player + 1, hand: 0 }};
    case INCR_HAND:
      return { ...state, ...{ hand: state.hand + 1 }};
    case RESET:
      return { ...state, ...{ player: 0, hand: 0 }};
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
