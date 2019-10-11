// functions
import assign from 'lodash/assign';
// initialState
import initialState from '../initialState';

// --------------------     DB Type     -------------------- //
export interface DBTurn {
  player: number;
  hand: number;
}

interface Action {
  type: string;
}

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
      return assign({}, state, { player: state.player + 1, hand: 0 });
    case INCR_HAND:
      return assign({}, state, { hand: state.hand + 1 });
    case RESET:
      return assign({}, state, { player: 0, hand: 0 });
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
