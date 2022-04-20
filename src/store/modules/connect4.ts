import { Action } from "redux";
import { C4Turn, DBConnect4 } from "../types";
import initialState, { newConnect4Game } from "../initialState";

// --------------------     Actions     -------------------- //
const NEW_GAME = "@games/connext4/NEW_GAME";
const UPDATE_TURN = "@games/connext4/UPDATE_TURN";
const UPDATE_EVAL = "@games/connext4/UPDATE_EVAL";

// -------------------- Action Creators     -------------------- //
type NewGameAction = Action<typeof NEW_GAME>;
/** start a new game in Connect4 DB */
export const newGame = (): NewGameAction => ({ type: NEW_GAME });

interface UpdateTurnAction extends Action<typeof UPDATE_TURN> {
  turn: C4Turn;
}
/** change player turn/color in Connect4 DB */
export const updateTurn = (turn: C4Turn): UpdateTurnAction => ({
  type: UPDATE_TURN,
  turn,
});

interface UpdateEvalAction extends Action<typeof UPDATE_EVAL> {
  winner: number;
  board: number[][];
}
/** update a winner and the board in Connect4 DB */
export const updateEval = (
  winner: number,
  board: number[][]
): UpdateEvalAction => ({ type: UPDATE_EVAL, winner, board });

// --------------------     Reducers     -------------------- //
type Connect4Actions = NewGameAction | UpdateTurnAction | UpdateEvalAction;
export default function reducer(
  state: DBConnect4 = initialState.connect4,
  action: Connect4Actions
): DBConnect4 {
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
