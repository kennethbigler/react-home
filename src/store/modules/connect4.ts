import { Action, AnyAction } from 'redux';
import { C4Turn, DBConnect4 } from '../types';
import initialState, { newConnect4Game } from '../initialState';

// --------------------     Actions     -------------------- //
const NEW_GAME = 'casino/ticTacToe/NEW_GAME';
const UPDATE_TURN = 'casino/ticTacToe/UPDATE_TURN';
const UPDATE_EVAL = 'casino/ticTacToe/UPDATE_EVAL';

// -------------------- Action Creators     -------------------- //
export const newGame = (): Action => ({ type: NEW_GAME });
export const updateTurn = (turn: C4Turn): AnyAction => ({ type: UPDATE_TURN, turn });
export const updateEval = (winner: number, board: number[][]): AnyAction => ({ type: UPDATE_EVAL, winner, board });

// --------------------     Reducers     -------------------- //
export default function reducer(state: DBConnect4 = initialState.connect4, action: AnyAction): DBConnect4 {
  switch (action.type) {
    case NEW_GAME:
      return newConnect4Game();
    case UPDATE_TURN:
      return { ...state, turn: action.turn };
    case UPDATE_EVAL:
      return { ...state, winner: action.winner, board: action.board };
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
