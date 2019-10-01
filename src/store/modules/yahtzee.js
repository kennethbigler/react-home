// functions
import { insertItem } from '../immutableHelpers';
// initialState
import initialState from '../initialState';

// --------------------     Actions     -------------------- //

const ADD = 'casino/yahtzee/SCORE';

// -------------------- Action Creators     -------------------- //

/** function to add a score to the state
 * @param {number} score - latest yahtzee score
 * @return {Object}
 */
export function addScore(score) {
  return { type: ADD, score };
}

// --------------------     Reducers     -------------------- //

export default function reducer(state = initialState.yahtzee, action) {
  switch (action.type) {
    case ADD:
      return insertItem(state, { score: action.score });
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
