// functions
import { insertItem } from '../immutableHelpers';
// initialState
import initialState from '../initialState';

// --------------------     Actions     -------------------- //
const ADD = 'casino/yahtzee/SCORE';

// -------------------- Action Creators     -------------------- //
export const addScore = (score) => ({ type: ADD, score });

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
