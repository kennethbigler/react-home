// functions
import { insertItem, updateArrayInArray, removeItemInArray } from '../immutableHelpers';
// initialState
import initialState, { newDota2Lineup } from '../initialState';

// --------------------     Actions     -------------------- //
const ADD = 'casino/dota2/ADD_LINEUP';
const REMOVE = 'casino/dota2/REMOVE_LINEUP';
const UPDATE_LINEUP = 'casino/dota2/UPDATE_LINEUP';
const RESET_LINEUP = 'casino/dota2/RESET_LINEUP';

// -------------------- Action Creators     -------------------- //
export function addLineup() {
  return { type: ADD, lineup: newDota2Lineup() };
}
export function removeLineup(set) {
  return { type: REMOVE, set };
}
export function updateLineup(order, set) {
  return { type: UPDATE_LINEUP, order, set };
}
export function resetLineup(set) {
  return { type: RESET_LINEUP, order: newDota2Lineup(), set };
}

// --------------------     Reducer     -------------------- //
export default function reducer(state = initialState.dota2, action) {
  switch (action.type) {
    case ADD:
      return insertItem(state, action.lineup);
    case REMOVE:
      return removeItemInArray(state, action.set);
    case UPDATE_LINEUP:
    case RESET_LINEUP:
      return updateArrayInArray(state, action.order, action.set);
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
