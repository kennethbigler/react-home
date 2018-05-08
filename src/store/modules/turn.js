// functions
import assign from 'lodash/assign';

// initialState
import initialState from '../initialState';

// Actions
const INCR_PLAYER = 'casino/turn/INCR';
const INCR_HAND = 'casino/turn/INCR_HAND';
const RESET = 'casino/turn/RESET';

// Action Creators
export function incrPlayerTurn() {
  return {type: INCR_PLAYER};
}
export function incrHandTurn() {
  return {type: INCR_HAND};
}
export function resetTurn() {
  return {type: RESET};
}

// Reducer
export default function reducer(state = initialState.turn, action) {
  switch (action.type) {
    case INCR_PLAYER:
      return assign({}, state, {player: state.player + 1, hand: 0});
    case INCR_HAND:
      return assign({}, state, {hand: state.hand + 1});
    case RESET:
      return assign({}, state, {player: 0, hand: 0});
    default:
      return state;
  }
}
