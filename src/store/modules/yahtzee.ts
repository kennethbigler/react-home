import { AnyAction } from 'redux';
import initialState from '../initialState';

// --------------------     Actions     -------------------- //
const ADD = 'casino/yahtzee/SCORE';

// -------------------- Action Creators     -------------------- //
export const addScore = (score: number): AnyAction => ({ type: ADD, score });

// --------------------     Reducers     -------------------- //
export default function reducer(state: number[] = initialState.yahtzee, action: AnyAction): number[] {
  switch (action.type) {
    case ADD:
      return [...state, action.score];
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
