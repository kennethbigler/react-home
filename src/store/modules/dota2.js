// functions
import { insertItem, updateArrayInArray } from '../immutableHelpers';
// initialState
import initialState, { newDota2Lineup } from '../initialState';

// --------------------     Actions     -------------------- //
const ADD = 'casino/dota2/ADD_LINEUP';
const UPDATE_LINEUP = 'casino/dota2/UPDATE_LINEUP';
const RESET_LINEUP = 'casino/dota2/RESET_LINEUP';

// -------------------- Action Creators     -------------------- //
/**
 * function to add a lineup to the state
 * @return {Object}
 */
export function addLineup() {
  return { type: ADD, lineup: newDota2Lineup() };
}

/**
 * function to update a lineup in the state
 * @return {Object}
 */
export function updateLineup(order, set) {
  return { type: UPDATE_LINEUP, order, set };
}

/**
 * function to reset a lineup in the state
 * @return {Object}
 */
export function resetLineup(set) {
  console.log(newDota2Lineup());
  return { type: RESET_LINEUP, order: newDota2Lineup(), set };
}

// --------------------     Reducer     -------------------- //
export default function reducer(state = initialState.dota2, action) {
  switch (action.type) {
    case ADD:
      return insertItem(state, { lineup: action.lineup });
    case UPDATE_LINEUP:
    case RESET_LINEUP:
      return updateArrayInArray(state, action.order, action.set);
    default:
      return state;
  }
}
