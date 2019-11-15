import { Action, AnyAction } from 'redux';
import { DBTicTacToe } from '../types';
import initialState, { newTicTacToe } from '../initialState';

// --------------------     Actions     -------------------- //
const SET = 'casino/ticTacToe/SET';
const NEW_GAME = 'casino/ticTacToe/NEW_GAME';

// -------------------- Action Creators     -------------------- //
export const playTurn = (turn: DBTicTacToe): AnyAction => ({ type: SET, turn });
export const newGame = (): Action => ({ type: NEW_GAME });

// --------------------     Reducers     -------------------- //
export default function reducer(state: DBTicTacToe = initialState.ticTacToe, action: AnyAction): DBTicTacToe {
  switch (action.type) {
    case SET:
      return action.turn;
    case NEW_GAME:
      return newTicTacToe();
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
