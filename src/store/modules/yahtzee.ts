import { AnyAction } from 'redux';
import { insertItem } from '../immutableHelpers';
import initialState from '../initialState';

// --------------------     Actions     -------------------- //
const ADD = 'casino/yahtzee/SCORE';

// -------------------- Action Creators     -------------------- //
export const addScore = (score: number): AnyAction => ({ type: ADD, score });

// --------------------     Reducers     -------------------- //
export default function reducer(state: number[] = initialState.yahtzee, action: AnyAction): number[] {
  switch (action.type) {
    case ADD:
      return insertItem(state, { score: action.score });
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
